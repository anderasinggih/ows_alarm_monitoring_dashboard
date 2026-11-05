// dailyReport_FWA

var start = parseInt(_message.start, 10);
var limit = parseInt(_message.limit, 10);

var region = normalizeList(_message.region);
var siteType = normalizeList(_message.site_type);
var siteList = normalizeSiteList(_message.site_list);
var isHub = _message.is_hub;
var isVip = _message.is_vip;
var startTime = _message.start_time;
var endTime = _message.end_time;

var startUtc;
var endUtc;
var startTimestamp;
var endTimestamp;
var nowTimestamp = new Date().getTime();

var occurrencePage;
var siteMap = {};
var pageRows = [];
var results = [];
var total = 0;

if (isNaN(start) || start < 0) {
    start = 0;
}

if (isNaN(limit) || limit <= 0) {
    limit = 10;
}

if (limit > 5000) {
    limit = 5000;
}

if (
    startTime === null ||
    startTime === undefined ||
    startTime === "" ||
    endTime === null ||
    endTime === undefined ||
    endTime === ""
) {
    throw new ScriptError("start_time and end_time are required.");
}

startUtc = TimeUtil.local2Utc(startTime, _runtime.timeZone);
endUtc = TimeUtil.local2Utc(endTime, _runtime.timeZone);

startTimestamp = new Date(startUtc.replace(/-/g, "/")).getTime();
endTimestamp = new Date(endUtc.replace(/-/g, "/")).getTime();

if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
    throw new ScriptError("Invalid start_time or end_time.");
}

if (startTimestamp > endTimestamp) {
    throw new ScriptError("start_time cannot be greater than end_time.");
}

occurrencePage = getFwaOccurrencePage(
    startTimestamp,
    endTimestamp,
    region,
    siteType,
    siteList,
    isHub,
    isVip,
    start,
    limit
);

total = occurrencePage.total;

if (total === 0 || start >= total) {
    return {
        start: start,
        limit: limit,
        total: total,
        results: []
    };
}

pageRows = occurrencePage.rows;
siteMap = occurrencePage.siteMap;

if (pageRows.length > 0) {
    results = enrichRows(
        pageRows,
        siteMap,
        nowTimestamp
    );
}

return {
    start: start,
    limit: limit,
    total: total,
    results: results
};

function getFwaOccurrencePage(
    rangeStart,
    rangeEnd,
    regionFilter,
    siteTypeFilter,
    siteListFilter,
    hubFilter,
    vipFilter,
    pageStart,
    pageLimit
) {
    var siteRows = getFwaSiteRows(
        buildFwaSiteCondition(
            regionFilter,
            siteTypeFilter,
            siteListFilter,
            hubFilter,
            vipFilter
        )
    );
    var siteIds = getSiteIds(siteRows);
    var pageSiteMap = buildSiteMap(siteRows);
    var historyFilter;
    var historyCondition;
    var total;
    var rows;

    if (siteIds.length === 0) {
        return {
            total: 0,
            rows: [],
            siteMap: pageSiteMap
        };
    }

    historyFilter =
        " and firstoccurrence >= " + rangeStart +
        " and firstoccurrence <= " + rangeEnd +
        " and sitedownfault = '1'" +
        " and rawseverity != '0'" +
        " and outageflag = 0" +
        " and cleartime > 0" +
        " and ticketid is not null" +
        " and ticketid != ''";

    historyCondition =
        " and sitecode in (" +
        buildTqlList(siteIds) +
        ")" +
        historyFilter;

    total = getHistoryCount(historyCondition);

    if (total === 0 || pageStart >= total) {
        return {
            total: total,
            rows: [],
            siteMap: pageSiteMap
        };
    }

    rows = normalizeHistoryRows(
        queryHistoryPage(
            historyCondition,
            pageStart,
            pageLimit
        )
    );

    return {
        total: total,
        rows: rows,
        siteMap: pageSiteMap
    };
}
function buildFwaSiteCondition(
    regionFilter,
    siteTypeFilter,
    siteListFilter,
    hubFilter,
    vipFilter
) {
    var condition = "";

    if (regionFilter.length > 0) {
        condition +=
            " and region.keycode in (" +
            buildTqlList(regionFilter) +
            ")";
    }

    if (siteTypeFilter.length > 0) {
        condition +=
            " and type.keycode in (" +
            buildTqlList(siteTypeFilter) +
            ")";
    }

    if (hubFilter === true || hubFilter === false) {
        condition += hubFilter === true ?
            " and site.is_hub = 'Yes'" :
            " and site.is_hub = 'No'";
    }

    if (vipFilter === true || vipFilter === false) {
        condition += vipFilter === true ?
            " and site.is_vip in ('Yes','VVIP')" :
            " and site.is_vip = 'No'";
    }

    if (siteListFilter.length > 0) {
        condition +=
            " and site.site_id in (" +
            buildTqlList(siteListFilter) +
            ")";
    }

    return condition;
}

function getSiteIds(rows) {
    var output = [];
    var seen = {};
    var value;
    var key;
    var i;

    for (i = 0; i < rows.length; i++) {
        value = rows[i].site_id;

        if (isEmpty(value)) {
            continue;
        }

        key = String(value);

        if (seen[key] !== true) {
            seen[key] = true;
            output.push(value);
        }
    }

    return output;
}
function getHistoryCount(condition) {
    var rows = queryTql(
        "select count(1) as total " +
        "from \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
        "where alarmname is not null" +
        condition
    );
    var count = 0;

    if (
        rows.length > 0 &&
        rows[0].total !== null &&
        rows[0].total !== undefined
    ) {
        count = parseInt(rows[0].total, 10);

        if (isNaN(count)) {
            count = 0;
        }
    }

    return count;
}

function queryHistoryPage(
    condition,
    queryStart,
    queryLimit
) {
    var tql =
        "select " +
        "sitecode, alarmname, lastoccurrence, node, alarmid, vendor, cleartime, " +
        "firstoccurrence, ticketid, rawseverity, alarmserialnumber, " +
        "total_impacted_subscribers, identifier, outageflag, diagnosesummary " +
        "from \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
        "where alarmname is not null" +
        condition +
        " order by lastoccurrence desc" +
        " start " + queryStart +
        " limit " + queryLimit;

    return queryTql(tql);
} function normalizeHistoryRows(rows) {
    var output = [];
    var i;

    for (i = 0; i < rows.length; i++) {
        output.push(
            normalizeHistoryDetailRow(rows[i])
        );
    }

    return output;
} function queryLatestHistoryDetailBatch(
    latestRows,
    historyFilter
) {
    var siteIds = [];
    var occurrences = [];
    var siteSeen = {};
    var occurrenceSeen = {};
    var siteKey;
    var occurrenceKey;
    var i;

    for (i = 0; i < latestRows.length; i++) {
        siteKey = String(latestRows[i].sitecode);
        occurrenceKey =
            String(latestRows[i].latest_occurrence);

        if (siteSeen[siteKey] !== true) {
            siteSeen[siteKey] = true;
            siteIds.push(latestRows[i].sitecode);
        }

        if (occurrenceSeen[occurrenceKey] !== true) {
            occurrenceSeen[occurrenceKey] = true;
            occurrences.push(
                latestRows[i].latest_occurrence
            );
        }
    }

    if (
        siteIds.length === 0 ||
        occurrences.length === 0
    ) {
        return [];
    }

    return queryTql(
        "select " +
        "sitecode, alarmname, lastoccurrence, node, alarmid, vendor, cleartime, " +
        "firstoccurrence, ticketid, rawseverity, alarmserialnumber, " +
        "total_impacted_subscribers, identifier, outageflag, diagnosesummary " +
        "from \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
        "where alarmname is not null" +
        historyFilter +
        " and sitecode in (" +
        buildTqlList(siteIds) +
        ")" +
        " and lastoccurrence in (" +
        buildNumberList(occurrences) +
        ")" +
        " order by sitecode asc, lastoccurrence desc, identifier desc"
    );
}

function normalizeHistoryDetailRow(row) {
    return {
        source_type: "history",
        sitecode: getValue(row.sitecode),
        alarmname: getValue(row.alarmname),
        lastoccurrence: row.lastoccurrence,
        alarmsource: getValue(row.node),
        alarmid: getValue(row.alarmid),
        vendor: row.vendor,
        cleartime: row.cleartime,
        firstoccurrence: row.firstoccurrence,
        tt_number: getValue(row.ticketid),
        severity: row.rawseverity,
        alarmserialnumber:
            getValue(row.alarmserialnumber),
        total_impacted_subscribers:
            row.total_impacted_subscribers,
        identifier: getValue(row.identifier),
        outageflag: row.outageflag,
        diagnosesummary:
            getValue(row.diagnosesummary)
    };
}

function getLatestHistoryKey(
    sitecode,
    lastoccurrence
) {
    return String(sitecode) +
        "|" +
        String(lastoccurrence);
}
function getChunkedFwaOccurrences(
    rangeStart,
    rangeEnd,
    regionFilter,
    siteTypeFilter,
    siteListFilter,
    hubFilter,
    vipFilter,
    requiredRows
) {
    var CHUNK_MS = 5 * 24 * 60 * 60 * 1000;
    var CHUNK_SERVICE =
        "/adc-service/rest/v1/services/gde_dashboard/ticket_dashboard/td_dailyReport_FWA_period_chunk";

    var historyCurrentMap = {};
    var topRows = [];
    var collectAll = requiredRows > 500;
    var total = 0;

    var chunkStart = rangeStart;
    var chunkEnd;

    var request;
    var response;
    var rows;
    var row;

    var entityKey;
    var existing;

    var key;
    var i;

    while (chunkStart <= rangeEnd) {
        chunkEnd = chunkStart + CHUNK_MS - 1;

        if (chunkEnd > rangeEnd) {
            chunkEnd = rangeEnd;
        }

        request = {
            start_timestamp: chunkStart,
            end_timestamp: chunkEnd,
            region: regionFilter,
            site_type: siteTypeFilter,
            site_list: siteListFilter,
            is_hub: hubFilter,
            is_vip: vipFilter
        };

        response = ServiceInvoker.post(
            CHUNK_SERVICE,
            request
        );

        rows = getChunkResults(response);

        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            entityKey = getFwaEntityKey(row);
            existing = historyCurrentMap[entityKey];

            if (existing === undefined) {
                historyCurrentMap[entityKey] =
                    cloneOccurrenceRow(row);
            } else if (
                isSameHistoryOutageWindow(
                    existing,
                    row
                )
            ) {
                historyCurrentMap[entityKey] =
                    mergeOccurrenceRow(
                        existing,
                        row
                    );
            } else {
                total += 1;
                addTopOccurrence(
                    topRows,
                    existing,
                    requiredRows,
                    collectAll
                );

                historyCurrentMap[entityKey] =
                    cloneOccurrenceRow(row);
            }
        }

        chunkStart = chunkEnd + 1;
    }

    for (key in historyCurrentMap) {
        if (historyCurrentMap.hasOwnProperty(key)) {
            total += 1;
            addTopOccurrence(
                topRows,
                historyCurrentMap[key],
                requiredRows,
                collectAll
            );
        }
    }

    if (
        collectAll &&
        topRows.length > requiredRows
    ) {
        selectTopOccurrences(
            topRows,
            requiredRows
        );
    }

    topRows.sort(compareOccurrenceRows);

    return {
        total: total,
        rows: topRows
    };
}

function addTopOccurrence(
    heap,
    row,
    maximumRows,
    collectAll
) {
    if (maximumRows <= 0) {
        return;
    }

    if (collectAll) {
        heap.push(row);
        return;
    }

    if (heap.length < maximumRows) {
        heap.push(row);
        siftOccurrenceUp(
            heap,
            heap.length - 1
        );
        return;
    }

    if (
        compareOccurrenceRows(
            row,
            heap[0]
        ) < 0
    ) {
        heap[0] = row;
        siftOccurrenceDown(heap, 0);
    }
}

function selectTopOccurrences(
    rows,
    maximumRows
) {
    var targetIndex = maximumRows - 1;
    var leftIndex = 0;
    var rightIndex = rows.length - 1;
    var equalRange;

    while (leftIndex <= rightIndex) {
        equalRange = partitionOccurrences(
            rows,
            leftIndex,
            rightIndex
        );

        if (targetIndex < equalRange.start) {
            rightIndex = equalRange.start - 1;
        } else if (targetIndex > equalRange.end) {
            leftIndex = equalRange.end + 1;
        } else {
            break;
        }
    }

    rows.length = maximumRows;
}

function partitionOccurrences(
    rows,
    leftIndex,
    rightIndex
) {
    var pivot = rows[
        Math.floor(
            (leftIndex + rightIndex) / 2
        )
    ];

    var lowerIndex = leftIndex;
    var currentIndex = leftIndex;
    var upperIndex = rightIndex;
    var comparison;
    var item;

    while (currentIndex <= upperIndex) {
        comparison = compareOccurrenceRows(
            rows[currentIndex],
            pivot
        );

        if (comparison < 0) {
            item = rows[lowerIndex];
            rows[lowerIndex] = rows[currentIndex];
            rows[currentIndex] = item;
            lowerIndex += 1;
            currentIndex += 1;
        } else if (comparison > 0) {
            item = rows[upperIndex];
            rows[upperIndex] = rows[currentIndex];
            rows[currentIndex] = item;
            upperIndex -= 1;
        } else {
            currentIndex += 1;
        }
    }

    return {
        start: lowerIndex,
        end: upperIndex
    };
}
function siftOccurrenceUp(heap, index) {
    var parentIndex;
    var item;

    while (index > 0) {
        parentIndex = Math.floor(
            (index - 1) / 2
        );

        if (
            compareOccurrenceRows(
                heap[index],
                heap[parentIndex]
            ) <= 0
        ) {
            break;
        }

        item = heap[index];
        heap[index] = heap[parentIndex];
        heap[parentIndex] = item;
        index = parentIndex;
    }
}

function siftOccurrenceDown(heap, index) {
    var length = heap.length;
    var leftIndex;
    var rightIndex;
    var worstIndex;
    var item;

    while (true) {
        leftIndex = index * 2 + 1;
        rightIndex = leftIndex + 1;
        worstIndex = index;

        if (
            leftIndex < length &&
            compareOccurrenceRows(
                heap[leftIndex],
                heap[worstIndex]
            ) > 0
        ) {
            worstIndex = leftIndex;
        }

        if (
            rightIndex < length &&
            compareOccurrenceRows(
                heap[rightIndex],
                heap[worstIndex]
            ) > 0
        ) {
            worstIndex = rightIndex;
        }

        if (worstIndex === index) {
            break;
        }

        item = heap[index];
        heap[index] = heap[worstIndex];
        heap[worstIndex] = item;
        index = worstIndex;
    }
}
function getChunkResults(response) {
    if (
        response === null ||
        response === undefined
    ) {
        return [];
    }

    if (
        response.results !== null &&
        response.results !== undefined
    ) {
        return response.results;
    }

    if (
        response.result !== null &&
        response.result !== undefined &&
        response.result.results !== null &&
        response.result.results !== undefined
    ) {
        return response.result.results;
    }

    return [];
}

function getFwaEntityKey(row) {
    return "SITE|" + String(getValue(row.sitecode));
}

function isSameHistoryOutageWindow(
    currentOccurrence,
    candidate
) {
    var candidateFirst =
        parseTimestampValue(candidate.firstoccurrence);

    var currentClear =
        parseTimestampValue(currentOccurrence.cleartime);

    if (candidateFirst <= 0 || currentClear <= 0) {
        return false;
    }

    return candidateFirst <= currentClear;
}

function mergeOccurrenceRow(
    existing,
    candidate
) {
    var result = existing;

    var existingFirst =
        parseTimestampValue(existing.firstoccurrence);

    var candidateFirst =
        parseTimestampValue(candidate.firstoccurrence);

    var existingClear =
        parseTimestampValue(existing.cleartime);

    var candidateClear =
        parseTimestampValue(candidate.cleartime);

    var existingLast =
        parseTimestampValue(existing.lastoccurrence);

    var candidateLast =
        parseTimestampValue(candidate.lastoccurrence);

    if (
        existingFirst <= 0 ||
        (
            candidateFirst > 0 &&
            candidateFirst < existingFirst
        )
    ) {
        result.firstoccurrence =
            candidate.firstoccurrence;
        result._sort_first = candidateFirst;
    }

    if (candidateClear > existingClear) {
        result.cleartime =
            candidate.cleartime;
    }

    if (candidateLast > existingLast) {
        result = copyRepresentativeFields(
            result,
            candidate
        );
        result._sort_last = candidateLast;
    }

    return result;
}
function copyRepresentativeFields(target, source) {
    var firstoccurrence = target.firstoccurrence;
    var cleartime = target.cleartime;

    target.source_type = source.source_type;
    target.sitecode = source.sitecode;
    target.alarmname = source.alarmname;
    target.lastoccurrence = source.lastoccurrence;
    target.alarmsource = source.alarmsource;
    target.alarmid = source.alarmid;
    target.vendor = source.vendor;
    target.tt_number = source.tt_number;
    target.severity = source.severity;
    target.alarmserialnumber =
        source.alarmserialnumber;
    target.total_impacted_subscribers =
        source.total_impacted_subscribers;
    target.identifier = source.identifier;
    target.outageflag = source.outageflag;
    target.diagnosesummary =
        source.diagnosesummary;

    target.firstoccurrence = firstoccurrence;
    target.cleartime = cleartime;

    return target;
}

function cloneOccurrenceRow(row) {
    return {
        source_type: row.source_type,
        sitecode: row.sitecode,
        alarmname: row.alarmname,
        lastoccurrence: row.lastoccurrence,
        alarmsource: row.alarmsource,
        alarmid: row.alarmid,
        vendor: row.vendor,
        cleartime: row.cleartime,
        firstoccurrence: row.firstoccurrence,
        tt_number: row.tt_number,
        severity: row.severity,
        alarmserialnumber: row.alarmserialnumber,
        total_impacted_subscribers:
            row.total_impacted_subscribers,
        identifier: row.identifier,
        outageflag: row.outageflag,
        diagnosesummary: row.diagnosesummary,
        _sort_last: parseTimestampValue(
            row.lastoccurrence
        ),
        _sort_first: parseTimestampValue(
            row.firstoccurrence
        )
    };
}

function compareOccurrenceRows(left, right) {
    var leftLast = left._sort_last;
    var rightLast = right._sort_last;
    var leftFirst = left._sort_first;
    var rightFirst = right._sort_first;

    if (leftLast > rightLast) {
        return -1;
    }

    if (leftLast < rightLast) {
        return 1;
    }

    if (leftFirst > rightFirst) {
        return -1;
    }

    if (leftFirst < rightFirst) {
        return 1;
    }

    return 0;
}

function parseTimestampValue(value) {
    var timestamp = parseInt(value, 10);

    if (isNaN(timestamp)) {
        return 0;
    }

    return timestamp;
}

function enrichRowsInChunks(
    rows,
    currentTime
) {
    var ENRICH_SERVICE =
        "/adc-service/rest/v1/services/gde_dashboard/ticket_dashboard/td_dailyReport_FWA_enrich_chunk";

    var batchSize = 100;
    var offset = 0;
    var output = [];
    var batch;
    var response;
    var results;
    var i;

    while (offset < rows.length) {
        batch = rows.slice(
            offset,
            offset + batchSize
        );

        response = ServiceInvoker.post(
            ENRICH_SERVICE,
            {
                rows: batch,
                current_time: currentTime
            }
        );

        results = getChunkResults(response);

        if (results.length !== batch.length) {
            throw new ScriptError(
                "Invalid enrichment response."
            );
        }

        for (i = 0; i < results.length; i++) {
            output.push(results[i]);
        }

        offset += batch.length;
    }

    return output;
}
function getPageSiteMap(rows) {
    var ids = [];
    var seen = {};
    var key;
    var i;

    for (i = 0; i < rows.length; i++) {
        if (isEmpty(rows[i].sitecode)) {
            continue;
        }

        key = String(rows[i].sitecode);

        if (seen[key] !== true) {
            seen[key] = true;
            ids.push(rows[i].sitecode);
        }
    }

    if (ids.length === 0) {
        return {};
    }

    return buildSiteMap(
        getFwaSiteRows(
            " and site.site_id in (" +
            buildTqlList(ids) +
            ")"
        )
    );
}

function queryTql(tql) {
    var response = ServiceInvoker.post(
        "/adc-model/rest/v2/model-instances/query-by-tql",
        {
            tql: tql
        }
    );

    if (
        response === null ||
        response === undefined ||
        response.results === null ||
        response.results === undefined
    ) {
        return [];
    }

    return response.results;
}

function getFwaSiteRows(condition) {
    var output = [];
    var offset = 0;
    var batchSize = 5000;

    var rows;
    var tql;
    var i;

    while (true) {
        tql =
            "select " +
            "site.site_id, " +
            "site.site_name, " +
            "site.is_hub, " +
            "site.is_vip, " +
            "site.latitude, " +
            "site.longitude, " +
            "site.site_addr as site_address, " +
            "region.keycode as region, " +
            "fm.keycode as fm_office " +
            "from \"/datahub/cmdb/cmdb_site\" as site " +
            "left join \"/datahub/cmdb/cmdb_site_access_type\" as access " +
            "on site.access_type = access.id " +
            "left join \"/datahub/cmdb/cmdb_site_stage\" as stage " +
            "on site.site_stage = stage.id " +
            "left join \"/datahub/cmdb/cmdb_region\" as region " +
            "on site.region_name = region.id " +
            "left join \"/datahub/cmdb/cmdb_site_type\" as type " +
            "on site.site_type = type.id " +
            "left join \"/datahub/cmdb/cmdb_fm_office\" as fm " +
            "on fm.id = site.fm_office " +
            "where site.active = 1 " +
            "and access.label = 'FWA' " +
            "and stage.site_stage_name = 'OnAir'" +
            condition +
            " order by site.site_id" +
            " start " + offset +
            " limit " + batchSize;

        rows = queryTql(tql);

        for (i = 0; i < rows.length; i++) {
            output.push(rows[i]);
        }

        if (
            rows.length === 0 ||
            rows.length < batchSize
        ) {
            break;
        }

        offset += rows.length;
    }

    return output;
}

function buildSiteMap(rows) {
    var map = {};
    var i;

    for (i = 0; i < rows.length; i++) {
        map[rows[i].site_id] = rows[i];
    }

    return map;
}

function enrichRows(rows, siteMap, currentTime) {
    var ticketIds = [];
    var ticketSeen = {};

    var vendorIds = [];
    var vendorSeen = {};

    var ticketMap = {};
    var vendorMap = {};
    var parentCache = {};

    var output = [];

    var row;
    var site;
    var ticket;
    var item;

    var ticketKey;
    var vendorKey;
    var parentIds;
    var agingHours;
    var recoveryTime;

    var i;

    for (i = 0; i < rows.length; i++) {
        row = rows[i];

        if (!isEmpty(row.tt_number)) {
            ticketKey = String(row.tt_number);

            if (ticketSeen[ticketKey] !== true) {
                ticketSeen[ticketKey] = true;
                ticketIds.push(row.tt_number);
            }
        }

        if (!isEmpty(row.vendor)) {
            vendorKey = String(row.vendor);

            if (
                isNumericValue(vendorKey) &&
                vendorSeen[vendorKey] !== true
            ) {
                vendorSeen[vendorKey] = true;
                vendorIds.push(vendorKey);
            }
        }
    }

    if (ticketIds.length > 0) {
        ticketMap = getTicketMap(ticketIds);
    }

    if (vendorIds.length > 0) {
        vendorMap = getVendorMap(vendorIds);
    }

    for (i = 0; i < rows.length; i++) {
        row = rows[i];

        site = siteMap[row.sitecode];
        ticket = ticketMap[row.tt_number];

        if (
            site === null ||
            site === undefined
        ) {
            site = {};
        }

        if (
            ticket === null ||
            ticket === undefined
        ) {
            ticket = {};
        }

        parentIds = getParentIds(
            row.tt_number,
            parentCache
        );

        agingHours = calculateAgingHours(
            row.firstoccurrence,
            row.cleartime,
            row.source_type,
            currentTime
        );

        recoveryTime = getRecoveryTime(row);

        item = {};

        item.site_id = row.sitecode;
        item.site_name =
            getValue(site.site_name);

        item.aging_hours = agingHours;
        item.aging = agingHours;

        item.alarmsource = row.alarmsource;
        item.alarmname = row.alarmname;

        item.acc_name =
            getValue(ticket.acc_name);

        item.ticketstatus =
            getValue(ticket.ticketstatus);

        item.businessstatus =
            getValue(ticket.businessstatus);

        item.acc_site =
            getValue(ticket.acc_site);

        item.genset_number =
            getValue(ticket.genset_number);

        item.acc_genset =
            getValue(ticket.genset_number);

        item.agg_name =
            getValue(ticket.agg_name);

        item.lastoccurrence =
            formatLocalTimestamp(
                row.lastoccurrence
            );

        item.recovery_time = recoveryTime;

        item.progress =
            buildProgress(
                getValue(ticket.progress),
                parentIds
            );

        item.total_impacted_subscribers =
            row.total_impacted_subscribers;

        item.tt_number = row.tt_number;

        item.wo_id =
            extractWoIds(
                getValue(
                    ticket.associateorderid
                )
            );

        item.fm_office =
            getValue(site.fm_office);

        item.vendor =
            getVendorName(
                row.vendor,
                vendorMap
            );

        item.region =
            getValue(site.region);

        item.sitecode = row.sitecode;
        item.site_flag = "Site Down";

        item.hub_type =
            getValue(site.is_hub);

        item.is_vip =
            getValue(site.is_vip);

        item.lat =
            getValue(site.latitude);

        item.lon =
            getValue(site.longitude);

        item.site_address =
            getValue(site.site_address);

        item.firstoccurrence =
            formatLocalTimestamp(
                row.firstoccurrence
            );

        item.cleartime = recoveryTime;

        item.severity = row.severity;
        item.alarmid = row.alarmid;

        item.alarmserialnumber =
            row.alarmserialnumber;

        item.identifier =
            row.identifier;

        item.outageflag =
            row.outageflag;

        item.diagnosesummary =
            row.diagnosesummary;

        item.source_type =
            row.source_type;

        item.alarm_status =
            row.source_type === "history" ?
                "CLEARED" :
                "UNCLEARED";

        item.parent_order_id =
            parentIds;

        item.progress_label =
            isEmpty(parentIds) ?
                "normal" :
                "merged";

        item.duration_range =
            classifyDuration(
                row.firstoccurrence,
                row.cleartime,
                row.source_type,
                currentTime
            );

        if (
            row.source_type === "history" &&
            !isEmpty(ticket.root_cause)
        ) {
            item.initial_rca =
                ticket.root_cause;
        } else {
            item.initial_rca =
                getInitialRca(
                    row.diagnosesummary,
                    row.alarmsource,
                    row.alarmname
                );
        }

        item.sub_root_cause =
            row.source_type === "history" ?
                getValue(
                    ticket.sub_root_cause
                ) :
                "";

        output.push(item);
    }

    return output;
}

function getTicketMap(ticketIds) {
    var map = {};
    var batchSize = 500;
    var offset = 0;

    var batch;
    var tql;
    var rows;
    var i;

    while (offset < ticketIds.length) {
        batch = ticketIds.slice(
            offset,
            offset + batchSize
        );

        tql =
            "select " +
            "tt.orderid, " +
            "tt.associateorderid, " +
            "tt.procupdatedes as progress, " +
            "tt.acc_name, " +
            "tt.agg_name, " +
            "tt.has_oil_machine as genset_number, " +
            "tt.root_cause, " +
            "tt.ticketstatus, " +
            "tt.businessstatus, " +
            "tt.sub_root_cause, " +
            "st.site_name as acc_site " +
            "from \"/TroubleTicket/TroubleTicket/tt_troubleticket\" as tt " +
            "left join \"/datahub/cmdb/cmdb_device\" as device " +
            "on device.device_name = tt.acc_name " +
            "left join \"/datahub/cmdb/cmdb_site\" as st " +
            "on device.site_id = st.id " +
            "where tt.orderid in (" +
            buildTqlList(batch) +
            ")";

        rows = queryTql(tql);

        for (i = 0; i < rows.length; i++) {
            if (
                map[
                rows[i].orderid
                ] === undefined
            ) {
                map[
                    rows[i].orderid
                ] = rows[i];
            }
        }

        offset += batch.length;
    }

    return map;
}

function getVendorMap(vendorIds) {
    var map = {};
    var batchSize = 500;
    var offset = 0;

    var batch;
    var tql;
    var rows;
    var i;

    while (offset < vendorIds.length) {
        batch = vendorIds.slice(
            offset,
            offset + batchSize
        );

        tql =
            "select value_id, vendor_name " +
            "from \"/datahub/cmdb/cmdb_vendor\" " +
            "where value_id in (" +
            buildNumberList(batch) +
            ")";

        rows = queryTql(tql);

        for (i = 0; i < rows.length; i++) {
            map[
                String(rows[i].value_id)
            ] =
                normalizeVendorName(
                    rows[i].vendor_name
                );
        }

        offset += batch.length;
    }

    return map;
}

function getVendorName(value, vendorMap) {
    var key;

    if (isEmpty(value)) {
        return "";
    }

    key = String(value);

    if (
        vendorMap[key] !== undefined
    ) {
        return vendorMap[key];
    }

    return normalizeVendorName(value);
}

function normalizeVendorName(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (
        value === "HUAWEI" ||
        value === "Huawei"
    ) {
        return "HUAWEI";
    }

    return value;
}

function getInitialRca(
    diagnoseSummary,
    alarmsource,
    alarmname
) {
    if (
        alarmname ===
        "GNB power cut off notification" ||
        alarmname ===
        "Input power-off"
    ) {
        return "Power issue";
    }

    if (
        !isEmpty(diagnoseSummary) &&
        (
            diagnoseSummary === "Power issue" ||
            diagnoseSummary === "ACC DOWN"
        )
    ) {
        return diagnoseSummary;
    }

    if (
        !isEmpty(alarmsource) &&
        String(alarmsource).indexOf("ISP") !== -1
    ) {
        return "ISP";
    }

    return "Transmission Issue";
}

function getParentIds(orderId, cache) {
    var request;
    var response;
    var list;

    var parentList = [];
    var parentSeen = {};

    var relationshipType;
    var parentOrderId;
    var parentKey;

    var i;

    if (isEmpty(orderId)) {
        return "";
    }

    if (cache[orderId] !== undefined) {
        return cache[orderId];
    }

    request = {
        start: 0,
        limit: 100,
        orderid: orderId
    };

    try {
        response = ServiceInvoker.post(
            "/adc-service/rest/v1/services/CompatibleAsset/bpm/bpm_getAssociateListScript",
            request
        );
    } catch (e) {
        cache[orderId] = "";
        return "";
    }

    if (
        response === null ||
        response === undefined ||
        response.results === null ||
        response.results === undefined
    ) {
        cache[orderId] = "";
        return "";
    }

    list = response.results;

    for (i = 0; i < list.length; i++) {
        relationshipType =
            list[i].relationshiptype;

        parentOrderId =
            list[i].orderid;

        if (
            (
                relationshipType ===
                "Related Ticket (Parent)" ||
                relationshipType ===
                "Merged Ticket (Parent)"
            ) &&
            !isEmpty(parentOrderId)
        ) {
            parentKey =
                String(parentOrderId);

            if (
                parentSeen[parentKey] !== true
            ) {
                parentSeen[parentKey] = true;
                parentList.push(parentOrderId);
            }
        }
    }

    cache[orderId] =
        parentList.join(";");

    return cache[orderId];
}

function buildProgress(progress, parentIds) {
    if (isEmpty(parentIds)) {
        return getValue(progress);
    }

    if (isEmpty(progress)) {
        return "Associated Ticket: " +
            parentIds;
    }

    return progress +
        " Associated Ticket: " +
        parentIds;
}

function extractWoIds(value) {
    var output = [];
    var values;
    var item;
    var i;

    if (isEmpty(value)) {
        return "";
    }

    values = String(value).split(";");

    for (i = 0; i < values.length; i++) {
        item = trimValue(values[i]);

        if (
            item.indexOf("CM-") === 0 ||
            item.indexOf("PM-") === 0 ||
            item.indexOf("PLM-") === 0
        ) {
            if (
                output.indexOf(item) === -1
            ) {
                output.push(item);
            }
        }
    }

    return output.join(";");
}

function calculateAgingHours(
    firstoccurrence,
    cleartime,
    sourceType,
    currentTime
) {
    var begin =
        parseInt(firstoccurrence, 10);

    var end;
    var hours;

    if (isNaN(begin)) {
        return 0;
    }

    if (sourceType === "history") {
        end = parseInt(cleartime, 10);
    } else {
        end = currentTime;
    }

    if (
        isNaN(end) ||
        end < begin
    ) {
        return 0;
    }

    hours =
        (end - begin) / 3600000;

    return Math.round(hours * 10) / 10;
}

function classifyDuration(
    firstoccurrence,
    cleartime,
    sourceType,
    currentTime
) {
    var begin =
        parseInt(firstoccurrence, 10);

    var end;
    var duration;

    if (isNaN(begin)) {
        return "";
    }

    if (sourceType === "history") {
        end = parseInt(cleartime, 10);
    } else {
        end = currentTime;
    }

    if (
        isNaN(end) ||
        end < begin
    ) {
        return "";
    }

    duration = end - begin;

    if (duration <= 3600000) {
        return "1";
    }

    if (duration <= 14400000) {
        return "1_4";
    }

    if (duration <= 28800000) {
        return "4_8";
    }

    if (duration <= 86400000) {
        return "8_24";
    }

    return "m24";
}

function getRecoveryTime(row) {
    var clearTimestamp;

    if (row.source_type !== "history") {
        return null;
    }

    clearTimestamp =
        parseInt(row.cleartime, 10);

    if (
        isNaN(clearTimestamp) ||
        clearTimestamp <= 0
    ) {
        return null;
    }

    return formatLocalTimestamp(
        clearTimestamp
    );
}

function formatLocalTimestamp(value) {
    var timestamp =
        parseInt(value, 10);

    if (
        isNaN(timestamp) ||
        timestamp <= 0
    ) {
        return null;
    }

    return TimeUtil.utc2Local(
        TimeUtil.formatTimestamp(
            timestamp,
            "yyyy-MM-dd HH:mm:ss"
        ),
        _runtime.timeZone
    );
}

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "[]"
    ) {
        return [];
    }

    return [value];
}
function normalizeSiteList(value) {
    var output = [];
    var seen = {};
    var values;
    var item;
    var i;

    if (Array.isArray(value)) {
        values = value;
    } else if (
        value === null ||
        value === undefined ||
        value === "" ||
        value === "[]"
    ) {
        return output;
    } else {
        values =
            String(value).split(/[,\n\r]+/);
    }

    for (i = 0; i < values.length; i++) {
        item = trimValue(values[i]);

        if (
            item !== "" &&
            seen[item] !== true
        ) {
            seen[item] = true;
            output.push(item);
        }
    }

    return output;
}

function buildTqlList(values) {
    var output = [];
    var value;
    var i;

    for (i = 0; i < values.length; i++) {
        value = values[i];

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            continue;
        }

        value = String(value);

        if (!isSafeTqlValue(value)) {
            throw new ScriptError(
                "Invalid filter value."
            );
        }

        output.push("'" + value + "'");
    }

    return output.join(",");
}

function buildNumberList(values) {
    var output = [];
    var value;
    var i;

    for (i = 0; i < values.length; i++) {
        value = String(values[i]);

        if (!isNumericValue(value)) {
            throw new ScriptError(
                "Invalid numeric value."
            );
        }

        output.push(value);
    }

    return output.join(",");
}

function isNumericValue(value) {
    return /^[0-9]+$/.test(value);
}

function isSafeTqlValue(value) {
    return /^[A-Za-z0-9 _.,()\/:+-]+$/.test(
        value
    );
}

function trimValue(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).replace(
        /^\s+|\s+$/g,
        ""
    );
}

function isEmpty(value) {
    return (
        value === null ||
        value === undefined ||
        value === ""
    );
}

function getValue(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return value;
}

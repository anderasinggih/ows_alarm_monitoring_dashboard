// FWA_chunk

var startTimestamp = parseInt(_message.start_timestamp, 10);
var endTimestamp = parseInt(_message.end_timestamp, 10);

var region = normalizeList(_message.region);
var siteType = normalizeList(_message.site_type);
var siteList = normalizeSiteList(_message.site_list);
var isHub = _message.is_hub;
var isVip = _message.is_vip;

var siteCondition = "";
var siteIds = [];
var siteIdList = "";
var historyCondition = "";

if (isNaN(startTimestamp) || isNaN(endTimestamp) || startTimestamp > endTimestamp) {
    throw new ScriptError("Invalid chunk timestamp.");
}

if (region.length > 0) {
    siteCondition += " and region.keycode in (" + buildTqlList(region) + ")";
}

if (siteType.length > 0) {
    siteCondition += " and type.keycode in (" + buildTqlList(siteType) + ")";
}

if (isHub === true || isHub === false) {
    siteCondition += isHub === true ?
        " and site.is_hub = 'Yes'" :
        " and site.is_hub = 'No'";
}

if (isVip === true || isVip === false) {
    siteCondition += isVip === true ?
        " and site.is_vip in ('Yes','VVIP')" :
        " and site.is_vip = 'No'";
}

if (siteList.length > 0) {
    siteCondition += " and site.site_id in (" + buildTqlList(siteList) + ")";
}

siteIds = getFwaSiteIds(siteCondition);

if (siteIds.length === 0) {
    return { results: [] };
}

siteIdList = buildTqlList(siteIds);

historyCondition =
    " and sitecode in (" + siteIdList + ")" +
    " and firstoccurrence >= " + startTimestamp +
    " and firstoccurrence <= " + endTimestamp +
    " and sitedownfault = '1'" +
    " and rawseverity != '0'" +
    " and outageflag = 0" +
    " and cleartime > 0";

return {
    results: getFwaOccurrenceRows(historyCondition)
};

function getFwaOccurrenceRows(historyWhere) {
    var output = [];
    var batchSize = 5000;
    var offset = 0;
    var rows;
    var row;
    var currentHistory = null;
    var siteKey;
    var i;

    while (true) {
        rows = queryHistoryPage(
            historyWhere,
            offset,
            batchSize
        );

        for (i = 0; i < rows.length; i++) {
            row = rows[i];
            siteKey = String(
                getValue(row.sitecode)
            );

            if (currentHistory === null) {
                currentHistory =
                    normalizeHistoryRow(row);
            } else if (
                siteKey !==
                String(currentHistory.sitecode)
            ) {
                output.push(currentHistory);
                currentHistory =
                    normalizeHistoryRow(row);
            } else if (
                isSameHistoryOutageWindow(
                    currentHistory,
                    row
                )
            ) {
                currentHistory =
                    mergeRawHistoryRow(
                        currentHistory,
                        row
                    );
            } else {
                output.push(currentHistory);
                currentHistory =
                    normalizeHistoryRow(row);
            }
        }

        if (
            rows.length === 0 ||
            rows.length < batchSize
        ) {
            break;
        }

        offset += rows.length;
    }

    if (currentHistory !== null) {
        output.push(currentHistory);
    }

    return output;
}
function isSameHistoryOutageWindow(currentOccurrence, candidate) {
    var candidateFirst = parseTimestampValue(candidate.firstoccurrence);
    var currentClear = parseTimestampValue(currentOccurrence.cleartime);

    if (candidateFirst <= 0 || currentClear <= 0) {
        return false;
    }

    return candidateFirst <= currentClear;
}

function mergeRawHistoryRow(existing, candidate) {
    var candidateFirst = parseTimestampValue(candidate.firstoccurrence);
    var candidateClear = parseTimestampValue(candidate.cleartime);
    var candidateLast = parseTimestampValue(candidate.lastoccurrence);

    var existingFirst = parseTimestampValue(existing.firstoccurrence);
    var existingClear = parseTimestampValue(existing.cleartime);
    var existingLast = parseTimestampValue(existing.lastoccurrence);

    if (existingFirst <= 0 || (candidateFirst > 0 && candidateFirst < existingFirst)) {
        existing.firstoccurrence = candidate.firstoccurrence;
    }

    if (candidateClear > existingClear) {
        existing.cleartime = candidate.cleartime;
    }

    if (candidateLast > existingLast) {
        copyHistoryRepresentativeFields(existing, candidate);
        existing.lastoccurrence = candidate.lastoccurrence;
    }

    return existing;
}

function copyHistoryRepresentativeFields(target, source) {
    target.source_type = "history";
    target.sitecode = getValue(source.sitecode);
    target.alarmname = getValue(source.alarmname);
    target.alarmsource = getValue(source.node);
    target.alarmid = getValue(source.alarmid);
    target.vendor = source.vendor;
    target.tt_number = getValue(source.ticketid);
    target.severity = source.rawseverity;
    target.alarmserialnumber = getValue(source.alarmserialnumber);
    target.total_impacted_subscribers = source.total_impacted_subscribers;
    target.identifier = getValue(source.identifier);
    target.outageflag = source.outageflag;
    target.diagnosesummary = getValue(source.diagnosesummary);
}

function normalizeHistoryRow(row) {
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
        alarmserialnumber: getValue(row.alarmserialnumber),
        total_impacted_subscribers: row.total_impacted_subscribers,
        identifier: getValue(row.identifier),
        outageflag: row.outageflag,
        diagnosesummary: getValue(row.diagnosesummary)
    };
}

function parseTimestampValue(value) {
    var timestamp = parseInt(value, 10);

    if (isNaN(timestamp)) {
        return 0;
    }

    return timestamp;
}

function queryHistoryPage(condition, queryStart, queryLimit) {
    var tql =
        "select " +
        "sitecode, alarmname, lastoccurrence, node, alarmid, vendor, cleartime, " +
        "firstoccurrence, ticketid, rawseverity, alarmserialnumber, total_impacted_subscribers, " +
        "identifier, outageflag, diagnosesummary " +
        "from \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
        "where alarmname is not null" +
        condition +
        " order by sitecode asc, firstoccurrence asc, lastoccurrence asc, identifier asc" +
        " start " + queryStart +
        " limit " + queryLimit;

    return queryTql(tql);
}

function queryTql(tql) {
    var response = ServiceInvoker.post(
        "/adc-model/rest/v2/model-instances/query-by-tql",
        { tql: tql }
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

function getFwaSiteIds(condition) {
    var output = [];
    var offset = 0;
    var batchSize = 5000;
    var rows;
    var tql;
    var i;

    while (true) {
        tql =
            "select site.site_id " +
            "from \"/datahub/cmdb/cmdb_site\" as site " +
            "left join \"/datahub/cmdb/cmdb_site_access_type\" as access " +
            "on site.access_type = access.id " +
            "left join \"/datahub/cmdb/cmdb_site_stage\" as stage " +
            "on site.site_stage = stage.id " +
            "left join \"/datahub/cmdb/cmdb_region\" as region " +
            "on site.region_name = region.id " +
            "left join \"/datahub/cmdb/cmdb_site_type\" as type " +
            "on site.site_type = type.id " +
            "where site.active = 1 " +
            "and access.label = 'FWA' " +
            "and stage.site_stage_name = 'OnAir'" +
            condition +
            " order by site.site_id" +
            " start " + offset +
            " limit " + batchSize;

        rows = queryTql(tql);

        for (i = 0; i < rows.length; i++) {
            if (!isEmpty(rows[i].site_id)) {
                output.push(rows[i].site_id);
            }
        }

        if (rows.length === 0 || rows.length < batchSize) {
            break;
        }

        offset += rows.length;
    }

    return output;
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
    } else if (value === null || value === undefined || value === "" || value === "[]") {
        return output;
    } else {
        values = String(value).split(/[,\n\r]+/);
    }

    for (i = 0; i < values.length; i++) {
        item = trimValue(values[i]);

        if (item !== "" && seen[item] !== true) {
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

        if (value === null || value === undefined || value === "") {
            continue;
        }

        value = String(value);

        if (!/^[A-Za-z0-9 _.,()\/:+-]+$/.test(value)) {
            throw new ScriptError("Invalid filter value." + value);
        }

        output.push("'" + value + "'");
    }

    return output.join(",");
}

function trimValue(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value).replace(/^\s+|\s+$/g, "");
}

function isEmpty(value) {
    return value === null || value === undefined || value === "";
}

function getValue(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return value;
}
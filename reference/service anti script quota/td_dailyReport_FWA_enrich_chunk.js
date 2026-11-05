var rows = _message.rows;
var currentTime = parseInt(_message.current_time, 10);
var siteMap;
var results;

if (!Array.isArray(rows)) {
    throw new ScriptError("rows must be an array.");
}

if (rows.length > 100) {
    throw new ScriptError("rows exceeds batch limit.");
}

if (isNaN(currentTime)) {
    throw new ScriptError("Invalid current_time.");
}

siteMap = getPageSiteMap(rows);
results = enrichRows(rows, siteMap, currentTime);

return {
    results: results
};
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
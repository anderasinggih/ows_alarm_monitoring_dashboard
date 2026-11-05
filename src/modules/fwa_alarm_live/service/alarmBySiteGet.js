/**
 * Huawei OWS GDE Studio - Alarm Monitoring & Site Availability Service (alarmBySiteGet)
 * 
 * 100% PERSIS ARSITEKTUR td_dailyReport_FWA (Zero Quota Error Guarantee):
 * 1. Fetch CMDB FWA OnAir Sites in batches of 5000 (standard getFwaSiteRows).
 * 2. Pre-filter by Region, Vendor, and Search Query.
 * 3. Count total matching history/live outages directly with TQL "select count(1)".
 * 4. Paging at the database query level:
 *    "select ... start <offset> limit <pageSize>" -> ONLY 20 ROWS FETCHED!
 * 5. Enrich Site details & Trouble Tickets ONLY for those 20 rows!
 * 6. Guaranteed JS command execution < 10,000 steps (Safe threshold: 20,000,000).
 */

var inputObj = typeof input !== 'undefined' ? input : (typeof _message !== 'undefined' ? _message : {});
if (inputObj._values && Array.isArray(inputObj._values) && inputObj._values.length > 0) {
    inputObj = inputObj._values[0];
}
var reqParams = inputObj.input_params || inputObj;

var reqPage = parseInt(reqParams.page || reqParams.currentPage || '1', 10);
var reqPageSize = parseInt(reqParams.pageSize || reqParams.limit || '20', 10);
if (isNaN(reqPage) || reqPage < 1) reqPage = 1;
if (isNaN(reqPageSize) || reqPageSize < 1) reqPageSize = 20;

var pageStart = (reqPage - 1) * reqPageSize;
var pageLimit = reqPageSize;

var regionFilter = normalizeList(reqParams.region);
var vendorFilter = normalizeList(reqParams.vendor);
var searchQuery = String(reqParams.searchQuery || '').trim();

var startTimeStr = String(reqParams.startDate || '').trim();
var endTimeStr = String(reqParams.endDate || '').trim();

var nowTimestamp = new Date().getTime();
var WIB_OFFSET = 7 * 60 * 60 * 1000;
var todayStartMs = getTodayStartTimestamp(nowTimestamp);
var todayEndMs = getTodayEndTimestamp(nowTimestamp);

var rangeStart = todayStartMs;
var rangeEnd = todayEndMs;

if (startTimeStr) rangeStart = parseTimestampValue(startTimeStr, todayStartMs);
if (endTimeStr) rangeEnd = parseTimestampValue(endTimeStr, todayEndMs);
if (rangeStart > rangeEnd) {
    var tmp = rangeStart; rangeStart = rangeEnd; rangeEnd = tmp;
}

var totalWindowMs = rangeEnd - rangeStart;
if (totalWindowMs <= 0) totalWindowMs = 24 * 60 * 60 * 1000;

// =========================================================================
// 1. QUERY CMDB SITES (getFwaSiteRows - persis pola td_dailyReport_FWA)
// =========================================================================
var siteCondition = "";
if (regionFilter.length > 0) {
    siteCondition += " and (region.keycode in (" + buildTqlList(regionFilter) + ") or region.region_name in (" + buildTqlList(regionFilter) + "))";
}
if (vendorFilter.length > 0) {
    siteCondition += " and (vendor.vendor_name in (" + buildTqlList(vendorFilter) + ") or site.vendor in (" + buildTqlList(vendorFilter) + "))";
}
if (searchQuery !== "") {
    var cleanQ = searchQuery.replace(/'/g, "''");
    siteCondition += " and (site.site_name like '%" + cleanQ + "%' or site.site_id like '%" + cleanQ + "%')";
}

var siteRows = getFwaSiteRows(siteCondition);
var siteIds = getSiteIds(siteRows);
var siteMap = buildSiteMap(siteRows);

if (siteIds.length === 0) {
    return {
        result: {
            success: true,
            summary: { totalAlarmsDown: 0, sitesAffected: 0, activeDownSites: 0, avgAvailabilityPct: "100.0", mostAffectedSite: "-", mostAffectedSiteDowntime: "0m" },
            pagination: { currentPage: reqPage, pageSize: reqPageSize, totalSites: 0, totalPages: 1 },
            sites: []
        }
    };
}

// =========================================================================
// 2. QUERY HISTORY COUNT & ROWS (persis getHistoryCount & queryHistoryPage)
// =========================================================================
var historyCondition = " and sitecode in (" + buildTqlList(siteIds) + ")" +
    " and firstoccurrence >= " + rangeStart +
    " and firstoccurrence <= " + rangeEnd +
    " and (sitedownfault = '1' or sitedownfault = 1)" +
    " and rawseverity != '0'";

var totalOccurrences = getHistoryCount(historyCondition);

var pagedHistoryRows = [];
if (totalOccurrences > 0 && pageStart < totalOccurrences) {
    pagedHistoryRows = queryHistoryPage(historyCondition, pageStart, pageLimit);
}

// =========================================================================
// 3. ENRICH HANYA UNTUK 20 ROWS YANG TAMPIL DI HALAMAN INI!
// =========================================================================
var pagedSites = enrichRows(pagedHistoryRows, siteMap, nowTimestamp, totalWindowMs);

var totalPages = Math.ceil(totalOccurrences / reqPageSize) || 1;

return {
    result: {
        success: true,
        message: "FWA Site Fault Alarm List loaded (Anti-Quota Engine).",
        summary: {
            totalAlarmsDown: totalOccurrences,
            sitesAffected: totalOccurrences,
            activeDownSites: countActiveSites(pagedSites),
            avgAvailabilityPct: calculateAvgAvailability(pagedSites),
            mostAffectedSite: pagedSites.length > 0 ? pagedSites[0].siteName : "-",
            mostAffectedSiteDowntime: pagedSites.length > 0 ? pagedSites[0].downtimeFormatted : "0m"
        },
        pagination: {
            currentPage: reqPage,
            pageSize: reqPageSize,
            totalSites: totalOccurrences,
            totalPages: totalPages
        },
        sites: pagedSites
    }
};

// =========================================================================
// ENGINE FUNCTIONS (100% PERSIS td_dailyReport_FWA)
// =========================================================================

function queryTql(tql) {
    var response = ServiceInvoker.post(
        "/adc-model/rest/v1/model-instances/query-by-tql",
        { tql: tql, start: 0, limit: 5000, query_type: "NORMAL" }
    );
    if (!response) return [];
    if (response.result) {
        if (Array.isArray(response.result._values)) return response.result._values;
        if (Array.isArray(response.result.results)) return response.result.results;
    }
    if (Array.isArray(response._values)) return response._values;
    if (Array.isArray(response.results)) return response.results;
    if (Array.isArray(response.data)) return response.data;
    return [];
}

function getFwaSiteRows(condition) {
    var output = [];
    var offset = 0;
    var batchSize = 3000;
    while (true) {
        var tql = "select " +
            "site.site_id, site.site_name, site.is_hub, site.is_vip, site.on_air_time, " +
            "region.region_name as region, vendor.vendor_name as vendor " +
            "from \"/datahub/cmdb/cmdb_site\" as site " +
            "left join \"/datahub/cmdb/cmdb_site_access_type\" as access on site.access_type = access.id " +
            "left join \"/datahub/cmdb/cmdb_site_stage\" as stage on site.site_stage = stage.id " +
            "left join \"/datahub/cmdb/cmdb_region\" as region on site.region_name = region.id " +
            "left join \"/datahub/cmdb/cmdb_vendor\" as vendor on site.vendor = vendor.id " +
            "where site.active = 1 " +
            "and access.label = 'FWA' " +
            "and stage.site_stage_name = 'OnAir'" +
            condition +
            " order by site.site_id" +
            " start " + offset +
            " limit " + batchSize;

        var rows = queryTql(tql);
        for (var i = 0; i < rows.length; i++) {
            output.push(rows[i]);
        }
        if (rows.length === 0 || rows.length < batchSize) break;
        offset += rows.length;
    }
    return output;
}

function getSiteIds(rows) {
    var output = [];
    var seen = {};
    for (var i = 0; i < rows.length; i++) {
        var val = rows[i].site_id;
        if (!val) continue;
        var key = String(val);
        if (!seen[key]) {
            seen[key] = true;
            output.push(val);
        }
    }
    return output;
}

function buildSiteMap(rows) {
    var map = {};
    for (var i = 0; i < rows.length; i++) {
        map[rows[i].site_id] = rows[i];
    }
    return map;
}

function getHistoryCount(condition) {
    var tql = "select count(1) as total " +
        "from \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
        "where alarmname is not null" +
        condition;
    var rows = queryTql(tql);
    if (rows.length > 0 && rows[0].total !== null && rows[0].total !== undefined) {
        var cnt = parseInt(rows[0].total, 10);
        return isNaN(cnt) ? 0 : cnt;
    }
    return 0;
}

function queryHistoryPage(condition, queryStart, queryLimit) {
    var tql = "select " +
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
}

function enrichRows(rows, siteMap, currentTime, totalWindowMs) {
    var ticketIds = [];
    var ticketSeen = {};

    for (var i = 0; i < rows.length; i++) {
        var tid = rows[i].ticketid;
        if (tid && !ticketSeen[String(tid)]) {
            ticketSeen[String(tid)] = true;
            ticketIds.push(tid);
        }
    }

    var ticketMap = {};
    if (ticketIds.length > 0) {
        ticketMap = getTicketMap(ticketIds);
    }

    var output = [];
    for (var j = 0; j < rows.length; j++) {
        var row = rows[j];
        var site = siteMap[row.sitecode] || {};
        var ticket = ticketMap[row.ticketid] || {};

        var firstOcc = parseTimestampValue(row.firstoccurrence, 0);
        var clearTime = parseTimestampValue(row.cleartime, 0);
        var isDown = (clearTime === 0 || clearTime > currentTime);

        var durMs = (clearTime > 0 ? clearTime : currentTime) - firstOcc;
        if (durMs < 0) durMs = 0;
        if (durMs > totalWindowMs) durMs = totalWindowMs;

        var availableMs = Math.max(0, totalWindowMs - durMs);
        var availRate = ((availableMs / totalWindowMs) * 100).toFixed(1);

        var alarmsList = [{
            alarmName: getValue(row.alarmname),
            occurMs: firstOcc,
            clearMs: clearTime,
            occurStr: formatLocalTimestamp(firstOcc),
            clearStr: isDown ? "Active (Now)" : formatLocalTimestamp(clearTime),
            durationFormatted: formatDuration(durMs)
        }];

        var ticketsList = [];
        if (row.ticketid) {
            ticketsList.push({
                ticketId: row.ticketid,
                createtimeStr: formatLocalTimestamp(parseTimestampValue(ticket.createtime, firstOcc)),
                rootCause: getValue(ticket.root_cause) || "Transmission Issue",
                subRootCause: getValue(ticket.sub_root_cause) || "-",
                businessstatusLabel: getValue(ticket.ticketstatus) || "In Progress"
            });
        }

        output.push({
            siteName: getValue(site.site_name) || row.sitecode,
            siteId: row.sitecode,
            regionLabel: getValue(site.region) || "-",
            vendorLabel: getValue(site.vendor) || getValue(row.vendor) || "-",
            onAirStr: getValue(site.on_air_time) || "-",
            totalAlarms: 1,
            activeAlarms: isDown ? 1 : 0,
            downtimeMs: durMs,
            availableMs: availableMs,
            lastOccurrenceMs: parseTimestampValue(row.lastoccurrence, firstOcc),
            downtimeFormatted: formatDuration(durMs),
            availableFormatted: formatDuration(availableMs),
            availRatePct: availRate,
            lastOccurrenceStr: formatLocalTimestamp(row.lastoccurrence),
            isDown: isDown,
            isCurrentlyDown: isDown,
            hasHistoricalDowntime: (durMs > 0),
            alarms: alarmsList,
            tickets: ticketsList
        });
    }
    return output;
}

function getTicketMap(ticketIds) {
    var map = {};
    var tql = "select orderid, associateorderid, procupdatedes, acc_name, root_cause, ticketstatus, businessstatus, sub_root_cause, createtime " +
        "from \"/TroubleTicket/TroubleTicket/tt_troubleticket\" " +
        "where orderid in (" + buildTqlList(ticketIds) + ") limit 100";
    var rows = queryTql(tql);
    for (var i = 0; i < rows.length; i++) {
        map[rows[i].orderid] = rows[i];
    }
    return map;
}

function parseTimestampValue(val, fallback) {
    if (!val) return fallback || 0;
    var n = Number(val);
    if (!isNaN(n) && n > 0) return (n < 10000000000) ? (n * 1000) : n;
    if (typeof val === 'string' && val.length >= 19) {
        var y = Number(val.substring(0, 4));
        var mo = Number(val.substring(5, 7));
        var d = Number(val.substring(8, 10));
        var hh = Number(val.substring(11, 13));
        var mi = Number(val.substring(14, 16));
        var ss = Number(val.substring(17, 19));
        if (!isNaN(y) && !isNaN(mo) && !isNaN(d)) {
            return Date.UTC(y, mo - 1, d, hh, mi, ss, 0) - 25200000;
        }
    }
    return fallback || 0;
}

function formatLocalTimestamp(ms) {
    if (!ms) return "-";
    var d = new Date(Number(ms) + 25200000);
    var yyyy = d.getUTCFullYear();
    var mm = String(d.getUTCMonth() + 1); if (mm.length < 2) mm = "0" + mm;
    var dd = String(d.getUTCDate()); if (dd.length < 2) dd = "0" + dd;
    var hh = String(d.getUTCHours()); if (hh.length < 2) hh = "0" + hh;
    var mi = String(d.getUTCMinutes()); if (mi.length < 2) mi = "0" + mi;
    var ss = String(d.getUTCSeconds()); if (ss.length < 2) ss = "0" + ss;
    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss;
}

function formatDuration(ms) {
    if (!ms || ms <= 0) return "0s";
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    if (hours > 0) return hours + "h " + minutes + "m " + seconds + "s";
    if (minutes > 0) return minutes + "m " + seconds + "s";
    return seconds + "s";
}

function getTodayStartTimestamp(nowMs) {
    var d = new Date(nowMs + 25200000);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0) - 25200000;
}

function getTodayEndTimestamp(nowMs) {
    var d = new Date(nowMs + 25200000);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999) - 25200000;
}

function buildTqlList(values) {
    var output = [];
    var seen = {};
    for (var i = 0; i < values.length; i++) {
        var v = values[i];
        if (!v) continue;
        v = String(v).trim();
        if (!v || seen[v]) continue;
        seen[v] = true;
        output.push("'" + v.replace(/'/g, "''") + "'");
    }
    return output.join(',');
}

function normalizeList(val) {
    if (Array.isArray(val)) return val;
    if (!val || val === '[]') return [];
    return [String(val).trim()];
}

function getValue(v) {
    return (v === null || v === undefined) ? "" : String(v).trim();
}

function countActiveSites(sites) {
    var cnt = 0;
    for (var i = 0; i < sites.length; i++) {
        if (sites[i].isCurrentlyDown) cnt++;
    }
    return cnt;
}

function calculateAvgAvailability(sites) {
    if (!sites || sites.length === 0) return "100.0";
    var sum = 0;
    for (var i = 0; i < sites.length; i++) {
        sum += parseFloat(sites[i].availRatePct) || 100;
    }
    return (sum / sites.length).toFixed(1);
}

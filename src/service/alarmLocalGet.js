var safeJsonParse = function (str) { try { return JSON.parse(str); } catch (e) { return str; } };

function extractOWSField(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'number' || typeof v === 'boolean') return v;
    if (v._value !== undefined) return extractOWSField(v._value);
    if (v.value  !== undefined) return extractOWSField(v.value);
    return String(v).trim();
}

function getPropIC(obj, key) {
    if (!obj || !key) return undefined;
    if (obj[key] !== undefined) return obj[key];
    var lk = key.toLowerCase();
    for (var k in obj) {
        if (k.toLowerCase() === lk) return obj[k];
    }
    return undefined;
}

function getRows(response) {
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

function getFastVal(row, k1, k2) {
    if (!row) return '';
    var v = row[k1] !== undefined ? row[k1] : row[k2];
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' || typeof v === 'number') return v;
    if (v._value !== undefined) return v._value;
    if (v.value !== undefined) return v.value;
    return String(v);
}

function queryByTql(tql, parameters, customMaxLimit) {
    var allRows = [];
    var start = 0;
    var maxRowsLimit = customMaxLimit || 20000;
    var pageSize = 1000;

    try {
        while (start < maxRowsLimit) {
            var request = {
                tql: tql,
                start: start,
                limit: pageSize,
                page_size: pageSize
            };
            var response = ServiceInvoker.post(
                "/adc-model/rest/v2/model-instances/query-by-tql",
                request
            );

            var pageRows = [];
            if (response && Array.isArray(response.results)) {
                pageRows = response.results;
            } else {
                pageRows = getRows(response);
            }

            if (!pageRows || pageRows.length === 0) {
                break;
            }

            for (var r = 0; r < pageRows.length; r++) {
                allRows.push(pageRows[r]);
                if (allRows.length >= maxRowsLimit) break;
            }

            if (pageRows.length < pageSize) {
                break;
            }

            start += pageSize;
        }
    } catch (err) {
    }

    return allRows;
}

var inputObj = typeof input !== 'undefined' ? input : (typeof _message !== 'undefined' ? _message : {});
if (inputObj.body) inputObj = inputObj.body;
if (inputObj._values && Array.isArray(inputObj._values) && inputObj._values.length > 0) {
    inputObj = inputObj._values[0];
}
var reqParams = inputObj.input_params || inputObj;

var now = new Date();
var pad = function (n) { return (n < 10 ? '0' : '') + n; };
var todayStr = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());

var startDateStr  = String(extractOWSField(reqParams.startDate) || todayStr).trim();
var endDateStr    = String(extractOWSField(reqParams.endDate)   || todayStr).trim();
var regionFilter  = String(extractOWSField(reqParams.region)    || '').trim().toLowerCase();
var vendorFilter  = String(extractOWSField(reqParams.vendor)    || '').trim().toLowerCase();
var searchFilter  = String(extractOWSField(reqParams.searchQuery)|| '').trim().toLowerCase();
var reqPage       = parseInt(extractOWSField(reqParams.page)     || 1, 10);
var reqPageSize   = parseInt(extractOWSField(reqParams.pageSize) || 20, 10);
if (reqPage < 1) reqPage = 1;
if (reqPageSize < 1) reqPageSize = 20;

var siteTql =
    "SELECT " +
    "  site.site_id, " +
    "  site.site_name, " +
    "  site.on_air_time, " +
    "  reg.region_name, " +
    "  vend.vendor_name " +
    "FROM " +
    "  \"/datahub/cmdb/cmdb_site\" AS site " +
    "  LEFT JOIN \"/datahub/cmdb/cmdb_site_access_type\" AS stype ON site.access_type = stype.id " +
    "  LEFT JOIN \"/datahub/cmdb/cmdb_region\" AS reg ON site.region_name = reg.id " +
    "  LEFT JOIN \"/datahub/cmdb/cmdb_vendor\" AS vend ON site.vendor = vend.id " +
    "  LEFT JOIN \"/datahub/cmdb/cmdb_site_stage\" AS stage ON site.site_stage = stage.id " +
    "WHERE " +
    "  site.active = true " +
    "  AND stype.access_type_name IN ('FWA', 'Fixed Wireless Access') " +
    "  AND stage.site_stage_name = 'OnAir'";

var siteRows = queryByTql(siteTql, {}, 5000);

var availTql =
    "SELECT site_id, AVG(availibility) AS avg_avail, COUNT(monitoring_date) AS day_cnt " +
    "FROM \"/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_siteavailable\" " +
    "WHERE monitoring_date >= '" + startDateStr + "' " +
    "  AND monitoring_date <= '" + endDateStr + "' " +
    "GROUP BY site_id";

var availRows = queryByTql(availTql, {}, 5000);

var availMap = {};
for (var a = 0; a < availRows.length; a++) {
    var ar = availRows[a];
    if (!ar) continue;
    var arSiteId = String(getFastVal(ar, 'site_id', 'SITE_ID')).trim();
    var avgAvail = parseFloat(getFastVal(ar, 'avg_avail', 'AVG_AVAIL'));
    var dayCnt   = parseInt(getFastVal(ar, 'day_cnt', 'DAY_CNT'), 10) || 1;

    if (!arSiteId || isNaN(avgAvail)) continue;

    availMap[arSiteId] = {
        avgAvail:         avgAvail,
        downtimeMinutes:  (100 - avgAvail) / 100 * 1440 * dayCnt,
        availableMinutes: avgAvail / 100 * 1440 * dayCnt,
        windowMinutes:    1440 * dayCnt,
        daysCount:        dayCnt
    };
}

var dailyAvailTql =
    "SELECT monitoring_date, AVG(availibility) AS avg_avail, COUNT(site_id) AS record_cnt " +
    "FROM \"/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_siteavailable\" " +
    "WHERE monitoring_date >= '" + startDateStr + "' " +
    "  AND monitoring_date <= '" + endDateStr + "' " +
    "GROUP BY monitoring_date " +
    "ORDER BY monitoring_date ASC";

var dailyAvailRows = queryByTql(dailyAvailTql, {}, 1000);

var dailyAvailMap = {};
for (var da = 0; da < dailyAvailRows.length; da++) {
    var dar = dailyAvailRows[da];
    if (!dar) continue;
    var mDate = String(getFastVal(dar, 'monitoring_date', 'MONITORING_DATE')).trim();
    var mDateKey = mDate.length >= 10 ? mDate.substring(0, 10) : mDate;
    var dAvg = parseFloat(getFastVal(dar, 'avg_avail', 'AVG_AVAIL'));
    var dCnt = parseInt(getFastVal(dar, 'record_cnt', 'RECORD_CNT'), 10) || 0;
    if (mDateKey) {
        dailyAvailMap[mDateKey] = {
            avg_avail: !isNaN(dAvg) ? dAvg : null,
            site_count: dCnt
        };
    }
}

var regionSet        = {};
var vendorSet        = {};
var cleanSites       = [];
var allSites         = [];
var regionMap        = {};
var totalAvailSum    = 0;
var totalAvailCount  = 0;
var totalDowntimeMin = 0;
var sitesWithDowntime = 0;
var maxDowntimeMin   = 0;
var mostAffectedSite = '-';
var mostAffectedDowntime = 0;

for (var i = 0; i < siteRows.length; i++) {
    var row = siteRows[i];

    var siteId     = String(getFastVal(row, 'site_id', 'SITE_ID')).trim();
    var siteName   = String(getFastVal(row, 'site_name', 'SITE_NAME')).trim();
    var regionName = String(getFastVal(row, 'region_name', 'REGION_NAME')).trim() || 'Unknown';
    var vendorName = String(getFastVal(row, 'vendor_name', 'VENDOR_NAME')).trim() || 'Unknown';
    var onAirTime  = String(getFastVal(row, 'on_air_time', 'ON_AIR_TIME')).trim();

    if (!siteId) continue;

    if (regionName) regionSet[regionName] = true;
    if (vendorName) vendorSet[vendorName] = true;

    var sRegLower = regionName.toLowerCase();
    var sVenLower = vendorName.toLowerCase();

    var passFilter = true;
    if (regionFilter && sRegLower !== regionFilter) passFilter = false;
    if (vendorFilter && sVenLower !== vendorFilter) passFilter = false;

    if (passFilter) {
        cleanSites.push({
            site_id:     siteId,
            site_name:   siteName,
            region_name: regionName,
            vendor_name: vendorName,
            on_air_time: onAirTime
        });
    }

    if (!passFilter) continue;

    var avEntry       = availMap[siteId] || null;
    var siteAvail     = avEntry ? avEntry.avgAvail         : null;
    var downtimeMin   = avEntry ? avEntry.downtimeMinutes  : 0;
    var availMin      = avEntry ? avEntry.availableMinutes : (avEntry ? null : 1440);
    var windowMin     = avEntry ? avEntry.windowMinutes    : 1440;
    var daysCnt       = avEntry ? avEntry.daysCount        : 1;

    if (!regionMap[regionName]) {
        regionMap[regionName] = {
            region_name: regionName,
            totalSites: 0,
            sitesWithDowntime: 0,
            downtime_minutes: 0,
            available_minutes: 0,
            totalAvailSum: 0,
            availCount: 0
        };
    }
    var regEntry = regionMap[regionName];
    regEntry.totalSites++;
    regEntry.downtime_minutes += downtimeMin;
    if (availMin !== null) regEntry.available_minutes += availMin;
    if (siteAvail !== null) {
        regEntry.totalAvailSum += siteAvail;
        regEntry.availCount++;
    }
    if (downtimeMin > 0) {
        regEntry.sitesWithDowntime++;
    }

    if (searchFilter) {
        var matchName   = siteName.toLowerCase().indexOf(searchFilter)   !== -1;
        var matchId     = siteId.toLowerCase().indexOf(searchFilter)     !== -1;
        var matchRegion = sRegLower.indexOf(searchFilter) !== -1;
        var matchVendor = sVenLower.indexOf(searchFilter) !== -1;
        if (!matchName && !matchId && !matchRegion && !matchVendor) continue;
    }

    if (siteAvail !== null) {
        totalAvailSum += siteAvail;
        totalAvailCount++;
    }
    totalDowntimeMin += downtimeMin;
    if (downtimeMin > 0) sitesWithDowntime++;
    if (downtimeMin > maxDowntimeMin) {
        maxDowntimeMin    = downtimeMin;
        mostAffectedSite  = siteName || siteId;
        mostAffectedDowntime = downtimeMin;
    }

    allSites.push({
        site_id:              siteId,
        site_name:            siteName,
        region_name:          regionName,
        vendor_name:          vendorName,
        on_air_time:          onAirTime,
        site_availability:    siteAvail,
        downtime_minutes:     downtimeMin,
        available_minutes:    availMin,
        total_window_minutes: windowMin,
        days_counted:         daysCnt
    });
}

var dailyTrend = [];
var curD = new Date(startDateStr.replace(/-/g, '/'));
var endD = new Date(endDateStr.replace(/-/g, '/'));

while (curD <= endD) {
    var dy = curD.getFullYear();
    var dm = String(curD.getMonth() + 1);
    if (dm.length < 2) dm = "0" + dm;
    var dd = String(curD.getDate());
    if (dd.length < 2) dd = "0" + dd;
    var dStr = dy + "-" + dm + "-" + dd;

    var dailyEntry = dailyAvailMap[dStr] || null;
    var dayTotalSites = dailyEntry ? dailyEntry.site_count : 0;
    var dayAvgAvail   = dailyEntry && dailyEntry.avg_avail !== null ? parseFloat(dailyEntry.avg_avail.toFixed(2)) : null;

    dailyTrend.push({
        date: dStr,
        total_sites: dayTotalSites,
        avg_availability: dayAvgAvail
    });

    curD.setDate(curD.getDate() + 1);
}

var regionSummary = [];
var regNames = Object.keys(regionMap).sort();
for (var r = 0; r < regNames.length; r++) {
    var rObj = regionMap[regNames[r]];
    var rAvg = rObj.availCount > 0 ? (rObj.totalAvailSum / rObj.availCount) : null;
    regionSummary.push({
        region_name:        rObj.region_name,
        totalSites:         rObj.totalSites,
        sitesWithDowntime:  rObj.sitesWithDowntime,
        downtime_minutes:   rObj.downtime_minutes,
        available_minutes:  rObj.available_minutes,
        avgAvailabilityPct: rAvg
    });
}

allSites.sort(function (a, b) {
    var aHas = a.downtime_minutes > 0 ? 1 : 0;
    var bHas = b.downtime_minutes > 0 ? 1 : 0;
    if (aHas !== bHas) return bHas - aHas;
    var aAvail = a.site_availability !== null ? a.site_availability : 100;
    var bAvail = b.site_availability !== null ? b.site_availability : 100;
    return aAvail - bAvail;
});

var totalSites = allSites.length;
var totalPages = Math.ceil(totalSites / reqPageSize) || 1;
if (reqPage > totalPages) reqPage = totalPages;
var startIdx   = (reqPage - 1) * reqPageSize;
var pagedSites = allSites.slice(startIdx, startIdx + reqPageSize);

var hasData = totalAvailCount > 0;
var avgAvailabilityPct = hasData ? (totalAvailSum / totalAvailCount) : null;

var availableRegions = Object.keys(regionSet).sort();
var availableVendors = Object.keys(vendorSet).sort();

return {
    result: {
        success: true,
        summary: {
            hasData:                hasData,
            totalSites:             totalSites,
            sitesWithDowntime:      sitesWithDowntime,
            avgAvailabilityPct:     avgAvailabilityPct,
            totalDowntimeMinutes:   totalDowntimeMin,
            mostAffectedSite:       mostAffectedSite,
            mostAffectedSiteDowntime: mostAffectedDowntime
        },
        pagination: {
            currentPage: reqPage,
            pageSize:    reqPageSize,
            totalSites:  totalSites,
            totalPages:  totalPages
        },
        availableRegions: availableRegions,
        availableVendors: availableVendors,
        regionSummary:    regionSummary,
        dailyTrend:       dailyTrend,
        sites: pagedSites
    }
};

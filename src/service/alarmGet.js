/**
 * OWS GDE Studio - Alarm Monitoring RunScript Backend (alarmGet / alrmget)
 */

function getPropIC(obj, propName) {
    if (!obj || typeof obj !== 'object') return '';
    if (obj[propName] !== undefined && obj[propName] !== null) return obj[propName];
    var target = propName.trim().toLowerCase();
    for (var k in obj) {
        if (k.trim().toLowerCase() === target) {
            return obj[k];
        }
    }
    return '';
}

function extractOWSField(val) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val.trim();
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val) && val.length > 0) {
        var item = val[0];
        if (typeof item === 'object' && item !== null) {
            return (item.label || item.text || item.name || item.value || '').trim();
        }
        return String(item).trim();
    }
    if (typeof val === 'object') {
        return (val.label || val.text || val.name || val.value || val.local || val.utc || '').trim();
    }
    return String(val).trim();
}

function toNumber(value) {
    var n = parseFloat(value);
    return isNaN(n) ? 0 : n;
}

function parseOWSTimestamp(val, defaultFallback) {
    if (!val) return defaultFallback || 0;
    var str = extractOWSField(val);
    if (!str) return defaultFallback || 0;

    if (str.indexOf('-') !== -1 || str.indexOf('/') !== -1) {
        var cleanStr = str.trim().replace(' ', 'T');
        if (cleanStr.indexOf('Z') === -1 && cleanStr.indexOf('+') === -1 && cleanStr.lastIndexOf('-') <= 7) {
            cleanStr += '+07:00';
        }
        var dt = new Date(cleanStr);
        if (!isNaN(dt.getTime())) {
            return dt.getTime();
        }
    }

    var num = parseFloat(str);
    if (!isNaN(num) && num > 0) {
        if (num < 10000000000) return num * 1000;
        return num;
    }

    return defaultFallback || 0;
}

function getRows(response) {
    if (!response) return [];
    if (response.result && response.result._values) return response.result._values;
    if (response.result && response.result.results) return response.result.results;
    if (response._values) return response._values;
    if (response.results) return response.results;
    if (response.data) return response.data;
    return [];
}

function queryByTql(tql, parameters, customMaxLimit) {
    var allRows = [];
    var start = 0;
    var pageSize = 1000;
    var isUnlimited = (customMaxLimit === 0);
    var maxRowsLimit = isUnlimited ? Infinity : (customMaxLimit || 5000);

    try {
        while (start < maxRowsLimit) {
            var request = {
                start: start,
                limit: pageSize,
                page_size: pageSize,
                tql: tql,
                query_type: "NORMAL",
                parameters: parameters || {}
            };

            var response = ServiceInvoker.post(
                "/adc-model/rest/v1/model-instances/query-by-tql",
                request
            );

            var pageRows = getRows(response);
            if (!pageRows || pageRows.length === 0) {
                break;
            }

            allRows = allRows.concat(pageRows);

            if (pageRows.length < pageSize) {
                break;
            }

            start += pageSize;
        }
        return allRows;
    } catch (e) {
        return allRows;
    }
}

function formatDuration(ms) {
    if (!ms || ms <= 0) return "0s";
    var totalSeconds = Math.floor(ms / 1000);
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    if (hours > 0) {
        return hours + "h " + minutes + "m " + seconds + "s";
    }
    if (minutes > 0) {
        return minutes + "m " + seconds + "s";
    }
    return seconds + "s";
}

function formatISODate(dateObj) {
    var utcMs = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    var wibDate = new Date(utcMs + (7 * 60 * 60 * 1000));
    var yyyy = wibDate.getFullYear();
    var mm = String(wibDate.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var dd = String(wibDate.getDate());
    if (dd.length < 2) dd = "0" + dd;
    var hh = String(wibDate.getHours());
    if (hh.length < 2) hh = "0" + hh;
    var mi = String(wibDate.getMinutes());
    if (mi.length < 2) mi = "0" + mi;
    var ss = String(wibDate.getSeconds());
    if (ss.length < 2) ss = "0" + ss;
    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss;
}

function formatTimeOnly(ms) {
    if (!ms) return "-";
    var dateObj = new Date(Number(ms));
    var utcMs = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
    var wibDate = new Date(utcMs + (7 * 60 * 60 * 1000));
    var yyyy = wibDate.getFullYear();
    var mm = String(wibDate.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var dd = String(wibDate.getDate());
    if (dd.length < 2) dd = "0" + dd;
    var hh = String(wibDate.getHours());
    if (hh.length < 2) hh = "0" + hh;
    var mi = String(wibDate.getMinutes());
    if (mi.length < 2) mi = "0" + mi;
    var ss = String(wibDate.getSeconds());
    if (ss.length < 2) ss = "0" + ss;
    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss;
}

function mergeOverlappingIntervals(intervals) {
    if (!intervals || intervals.length === 0) return [];

    intervals.sort(function (a, b) {
        return a.start - b.start;
    });

    var merged = [intervals[0]];

    for (var i = 1; i < intervals.length; i++) {
        var current = intervals[i];
        var lastMerged = merged[merged.length - 1];

        if (current.start <= lastMerged.end) {
            if (current.end > lastMerged.end) {
                lastMerged.end = current.end;
            }
        } else {
            merged.push(current);
        }
    }

    return merged;
}

// ==========================================
// 1. READ INPUT PARAMETERS
// ==========================================
var inputObj = typeof input !== 'undefined' ? input : (typeof _message !== 'undefined' ? _message : {});
if (inputObj._values && Array.isArray(inputObj._values) && inputObj._values.length > 0) {
    inputObj = inputObj._values[0];
}

var reqParams = inputObj.input_params || inputObj;

var startDateStr = extractOWSField(reqParams.startDate);
var endDateStr = extractOWSField(reqParams.endDate);
var selectedRegionStr = extractOWSField(reqParams.region);
var selectedVendorStr = extractOWSField(reqParams.vendor);
var searchQueryStr = extractOWSField(reqParams.searchQuery);
var reqPage = parseInt(extractOWSField(reqParams.page || reqParams.currentPage || '1'), 10);
var reqPageSize = parseInt(extractOWSField(reqParams.pageSize || '50'), 10);
if (isNaN(reqPage) || reqPage < 1) reqPage = 1;
if (isNaN(reqPageSize) || reqPageSize < 1) reqPageSize = 50;

var WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

var nowObj = new Date();
var nowMs = nowObj.getTime();

var wibNowMs = nowMs + (nowObj.getTimezoneOffset() * 60000) + WIB_OFFSET_MS;
var wibNowDate = new Date(wibNowMs);

var wibYear = wibNowDate.getUTCFullYear();
var wibMonth = wibNowDate.getUTCMonth();
var wibDay = wibNowDate.getUTCDate();

var todayStartWIBMs = Date.UTC(wibYear, wibMonth, wibDay, 0, 0, 0, 0) - WIB_OFFSET_MS;
var todayEndWIBMs = Date.UTC(wibYear, wibMonth, wibDay, 23, 59, 59, 999) - WIB_OFFSET_MS;

var windowStartMs;
var windowEndMs = todayEndWIBMs;

function parseDateTimeInputWIB(str, isEnd) {
    if (!str) return isEnd ? todayEndWIBMs : todayStartWIBMs;
    var s = str.trim();
    if (s.indexOf("T") !== -1 || s.indexOf(" ") !== -1) {
        var cleanStr = s.replace(" ", "T");
        if (cleanStr.indexOf("Z") === -1 && cleanStr.indexOf("+") === -1 && cleanStr.lastIndexOf("-") <= 7) {
            cleanStr += "+07:00";
        }
        var dt = new Date(cleanStr);
        if (!isNaN(dt.getTime())) return dt.getTime();
    }
    if (s.length >= 10) {
        var parts = s.substring(0, 10).split("-");
        if (parts.length === 3) {
            var yr = parseInt(parts[0], 10);
            var mo = parseInt(parts[1], 10) - 1;
            var dy = parseInt(parts[2], 10);
            if (!isNaN(yr) && !isNaN(mo) && !isNaN(dy)) {
                if (isEnd) {
                    return Date.UTC(yr, mo, dy, 23, 59, 59, 999) - WIB_OFFSET_MS;
                } else {
                    return Date.UTC(yr, mo, dy, 0, 0, 0, 0) - WIB_OFFSET_MS;
                }
            }
        }
    }
    return isEnd ? todayEndWIBMs : todayStartWIBMs;
}

if (startDateStr === "" && endDateStr === "") {
    windowStartMs = todayStartWIBMs;
    windowEndMs = todayEndWIBMs;
} else if (startDateStr !== "" && endDateStr !== "") {
    windowStartMs = parseDateTimeInputWIB(startDateStr, false);
    windowEndMs = parseDateTimeInputWIB(endDateStr, true);
} else if (startDateStr !== "") {
    windowStartMs = parseDateTimeInputWIB(startDateStr, false);
    windowEndMs = parseDateTimeInputWIB(startDateStr, true);
} else {
    windowStartMs = todayStartWIBMs;
    windowEndMs = todayEndWIBMs;
}

if (windowStartMs > windowEndMs) {
    var tempMs = windowStartMs;
    windowStartMs = windowEndMs;
    windowEndMs = tempMs;
}

var totalWindowMs = windowEndMs - windowStartMs;
if (totalWindowMs <= 0) totalWindowMs = 24 * 60 * 60 * 1000;

var execStartMs = new Date().getTime();
var startISO = formatISODate(new Date(windowStartMs));
var endISO = formatISODate(new Date(windowEndMs));

// ==========================================
// 2. FETCH LOOKUP CMDB MAPS FIRST (REGION & VENDOR)
// ==========================================
var vendorTql = "SELECT id, vendor_name FROM \"/datahub/cmdb/cmdb_vendor\"";
var regionTql = "SELECT id, region_name FROM \"/datahub/cmdb/cmdb_region\"";
var vendorRows = queryByTql(vendorTql, {}, 500);
var regionRows = queryByTql(regionTql, {}, 500);

var regionMap = {};
var regionNameToIdsMap = {};
for (var r = 0; r < regionRows.length; r++) {
    var rRow = regionRows[r];
    var rId = extractOWSField(getPropIC(rRow, 'id') || getPropIC(rRow, 'keycode'));
    var rName = extractOWSField(getPropIC(rRow, 'region_name') || getPropIC(rRow, 'keycode'));
    if (rId && rName) {
        regionMap[rId] = rName;
        var lowerName = rName.toLowerCase();
        if (!regionNameToIdsMap[lowerName]) regionNameToIdsMap[lowerName] = [];
        regionNameToIdsMap[lowerName].push("'" + rId + "'");
    }
}

var vendorMap = {};
var vendorNameToIdsMap = {};
for (var v = 0; v < vendorRows.length; v++) {
    var vRow = vendorRows[v];
    var vId = extractOWSField(getPropIC(vRow, 'id') || getPropIC(vRow, 'value_id') || getPropIC(vRow, 'keycode'));
    var vName = extractOWSField(getPropIC(vRow, 'vendor_name') || getPropIC(vRow, 'label') || getPropIC(vRow, 'keycode'));
    if (vId && vName) {
        vendorMap[vId] = vName;
        var lowerVName = vName.toLowerCase();
        if (!vendorNameToIdsMap[lowerVName]) vendorNameToIdsMap[lowerVName] = [];
        vendorNameToIdsMap[lowerVName].push("'" + vId + "'");
    }
}

// ==========================================
// 3. QUERY CMDB SITE FWA ON-AIR FIRST
// ==========================================
var siteTql = "SELECT site_id, keycode, site_name, vendor, region_name, on_air_time, access_type, site_stage FROM \"/datahub/cmdb/cmdb_site\" " +
    "WHERE access_type = 'ce1d6700-f34d-11f0-80d8-0255ac12193b' " +
    "AND site_stage = 'f343d1fb-e165-11f0-90da-0255ac121938'";

if (selectedVendorStr !== "") {
    var matchingVendorIds = vendorNameToIdsMap[selectedVendorStr.toLowerCase()] || [];
    if (matchingVendorIds.length > 0) {
        siteTql += " AND vendor IN (" + matchingVendorIds.join(",") + ")";
    } else {
        siteTql += " AND vendor = '" + selectedVendorStr + "'";
    }
}

if (selectedRegionStr !== "") {
    var matchingRegionIds = regionNameToIdsMap[selectedRegionStr.toLowerCase()] || [];
    if (matchingRegionIds.length > 0) {
        siteTql += " AND region_name IN (" + matchingRegionIds.join(",") + ")";
    } else {
        siteTql += " AND region_name = '" + selectedRegionStr + "'";
    }
}

if (searchQueryStr !== "") {
    var cleanQ = searchQueryStr.replace(/'/g, "''");
    siteTql += " AND (site_name LIKE '%" + cleanQ + "%' OR site_id LIKE '%" + cleanQ + "%')";
}

var cmdbSiteRows = queryByTql(siteTql, {}, 2000);

var fwaSiteCodesList = [];
for (var cs = 0; cs < cmdbSiteRows.length; cs++) {
    var cRow = cmdbSiteRows[cs];
    var sIdVal = extractOWSField(getPropIC(cRow, 'site_id') || getPropIC(cRow, 'keycode'));
    if (sIdVal) fwaSiteCodesList.push("'" + sIdVal + "'");
}

var siteInClause = fwaSiteCodesList.length > 0 ? (" AND sitecode IN (" + fwaSiteCodesList.join(",") + ")") : " AND sitecode IN ('__NO_MATCHING_SITES__')";

// ==========================================
// 4. QUERY LIVE & HISTORY ALARMS
// ==========================================
var liveTql = "SELECT sitecode, logicsiteid, sitename, sitedownfault, firstinserttime, firstoccurrence, cleartime, active, alarmname, rawalarmname FROM \"/AlarmBase/ICT_AlarmPush/ap_alarm_live\" WHERE (sitedownfault = '1' OR sitedownfault = 1)" + siteInClause;

var historyTql = "SELECT sitecode, logicsiteid, sitename, sitedownfault, firstinserttime, firstoccurrence, cleartime, active, alarmname, rawalarmname FROM \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
    "WHERE firstinserttime <= " + windowEndMs + " " +
    "AND (cleartime >= " + windowStartMs + " OR cleartime = 0 OR cleartime IS NULL) " +
    "AND (sitedownfault = '1' OR sitedownfault = 1)" + siteInClause;

// alarmGet (summary only) - TIDAK query TT & BS untuk hemat JS command quota
var liveRows = queryByTql(liveTql, {}, 5000);
var historyRows = queryByTql(historyTql, {}, 5000); // limit 5000, bukan unlimited

var ttDateIndexMap = {};

function getLocalDateStr(msOrStr) {
    if (typeof msOrStr === 'string' && msOrStr.length >= 10) {
        return msOrStr.substring(0, 10);
    }
    if (typeof msOrStr === 'number' && msOrStr > 0) {
        var d = new Date(msOrStr + (7 * 60 * 60 * 1000));
        var y = d.getUTCFullYear();
        var m = String(d.getUTCMonth() + 1); if (m.length < 2) m = '0' + m;
        var day = String(d.getUTCDate()); if (day.length < 2) day = '0' + day;
        return y + '-' + m + '-' + day;
    }
    return '';
}

function getSiteTickets() { return []; } // disabled in summary service

function getVendorLabelFromRecord(record) {
    if (!record) return '-';
    var rawVendor = extractOWSField(record.vendor || record.vendor_id || record.vendorid || record.vendorcode);
    if (!rawVendor) return '-';
    if (vendorMap[rawVendor]) {
        return vendorMap[rawVendor];
    }
    return rawVendor;
}

function getRegionFromRecord(record) {
    if (!record) return '-';
    var rawReg = extractOWSField(record.region_name || record.regionname || record.region || record.region_id);
    if (rawReg && regionMap[rawReg]) {
        return regionMap[rawReg];
    }
    var prov = extractOWSField(record.province || record.prov || '');
    var city = extractOWSField(record.city || record.cityname || record.township || '');
    if (prov && city) {
        return prov + " / " + city;
    } else if (prov) {
        return prov;
    } else if (city) {
        return city;
    }
    return rawReg || '-';
}

function getSiteCodeFromRecord(record) {
    if (!record) return '';
    return extractOWSField(record.sitecode || record.site_code || record.siteid || record.site_id);
}

function getSiteNameFromRecord(record) {
    if (!record) return '';
    return extractOWSField(record.sitename || record.site_name || record.name);
}

var siteIntervalMap = {};
var siteIdToKeyMap = {};
var totalAlarmCountAccumulated = 0;

// ==========================================
// 5. PRE-POPULATE MASTER SITES FROM CMDB SITES
// ==========================================
for (var cs = 0; cs < cmdbSiteRows.length; cs++) {
    var cRow = cmdbSiteRows[cs];
    var cSiteName = extractOWSField(getPropIC(cRow, 'site_name'));
    if (!cSiteName) continue;

    var cSiteId = extractOWSField(getPropIC(cRow, 'site_id') || getPropIC(cRow, 'keycode') || '-');

    var cVendorRaw = extractOWSField(getPropIC(cRow, 'vendor'));
    var cVendorLabel = vendorMap[cVendorRaw] || cVendorRaw || '-';

    var cRegionRaw = extractOWSField(getPropIC(cRow, 'region_name'));
    var cRegionName = regionMap[cRegionRaw] || cRegionRaw || '-';

    if (selectedRegionStr !== "" && cRegionName.toLowerCase() !== selectedRegionStr.toLowerCase() && cRegionRaw.toLowerCase() !== selectedRegionStr.toLowerCase()) {
        continue;
    }
    if (selectedVendorStr !== "" && cVendorLabel.toLowerCase() !== selectedVendorStr.toLowerCase() && cVendorRaw.toLowerCase() !== selectedVendorStr.toLowerCase()) {
        continue;
    }
    if (searchQueryStr !== "") {
        var sq = searchQueryStr.toLowerCase();
        var matchName = cSiteName.toLowerCase().indexOf(sq) !== -1;
        var matchId = cSiteId.toLowerCase().indexOf(sq) !== -1;
        var matchReg = cRegionName.toLowerCase().indexOf(sq) !== -1;
        var matchVen = cVendorLabel.toLowerCase().indexOf(sq) !== -1;
        if (!matchName && !matchId && !matchReg && !matchVen) {
            continue;
        }
    }

    var cOnAirStr = extractOWSField(getPropIC(cRow, 'on_air_time'));
    if (!cOnAirStr) {
        continue;
    }

    var cOnAirMs = parseOWSTimestamp(cOnAirStr, 0);

    if (cOnAirMs === 0 || cOnAirMs > windowEndMs) {
        continue;
    }

    if (!siteIntervalMap[cSiteName]) {
        siteIntervalMap[cSiteName] = {
            siteName: cSiteName,
            siteId: cSiteId,
            regionLabel: cRegionName,
            regionId: cRegionRaw,
            vendorLabel: cVendorLabel,
            vendorId: cVendorRaw,
            onAirMs: cOnAirMs,
            onAirStr: cOnAirStr,
            totalAlarms: 0,
            activeAlarms: 0,
            intervals: [],
            alarms: [],
            firstOccurMs: 0
        };
    }

    var cSiteId2 = extractOWSField(cRow.site_id || cRow.keycode);

    var keysToRegister = [cSiteId2, cSiteName];
    for (var k = 0; k < keysToRegister.length; k++) {
        var keyVal = keysToRegister[k];
        if (keyVal) {
            siteIdToKeyMap[keyVal] = cSiteName;
            siteIdToKeyMap[keyVal.toUpperCase()] = cSiteName;
            siteIdToKeyMap[keyVal.toLowerCase()] = cSiteName;
        }
    }
}

function findMatchingSiteKey(alarmRecord) {
    if (!alarmRecord) return null;

    var alarmCode = alarmRecord.sitecode || alarmRecord.SITECODE || alarmRecord.site_code || alarmRecord.logicsiteid || alarmRecord.LOGICSITEID || '';
    if (alarmCode) {
        if (typeof alarmCode !== 'string') alarmCode = String(alarmCode);
        alarmCode = alarmCode.trim();
        if (siteIdToKeyMap[alarmCode]) return siteIdToKeyMap[alarmCode];
        var upperCode = alarmCode.toUpperCase();
        if (siteIdToKeyMap[upperCode]) return siteIdToKeyMap[upperCode];
    }

    var alarmSiteName = alarmRecord.sitename || alarmRecord.SITENAME || alarmRecord.site_name || '';
    if (alarmSiteName) {
        if (typeof alarmSiteName !== 'string') alarmSiteName = String(alarmSiteName);
        alarmSiteName = alarmSiteName.trim();
        if (siteIdToKeyMap[alarmSiteName]) return siteIdToKeyMap[alarmSiteName];
        var upperName = alarmSiteName.toUpperCase();
        if (siteIdToKeyMap[upperName]) return siteIdToKeyMap[upperName];
    }

    return null;
}

// ==========================================
// 6. PROCESS LIVE ALARMS
// ==========================================
for (var l = 0; l < liveRows.length; l++) {
    var alarmL = liveRows[l];
    var targetSiteKeyL = findMatchingSiteKey(alarmL);
    if (!targetSiteKeyL || !siteIntervalMap[targetSiteKeyL]) continue;

    var rawClearL = parseOWSTimestamp(alarmL.cleartime, 0);
    var isLiveActive = (rawClearL === 0);

    totalAlarmCountAccumulated++;
    siteIntervalMap[targetSiteKeyL].totalAlarms += 1;
    if (isLiveActive) {
        siteIntervalMap[targetSiteKeyL].activeAlarms += 1;
    }

    var startL = parseOWSTimestamp(alarmL.firstinserttime || alarmL.firstoccurrence, windowStartMs);
    var effStartL = startL < windowStartMs ? windowStartMs : startL;
    var effEndL = isLiveActive ? ((windowEndMs > nowMs) ? nowMs : windowEndMs) : (rawClearL > windowEndMs ? windowEndMs : rawClearL);
    var alarmNameL = extractOWSField(alarmL.alarmname || alarmL.rawalarmname || 'Site Down Alarm');

    if (startL > 0 && (siteIntervalMap[targetSiteKeyL].firstOccurMs === 0 || startL < siteIntervalMap[targetSiteKeyL].firstOccurMs)) {
        siteIntervalMap[targetSiteKeyL].firstOccurMs = startL;
    }

    if (effEndL > effStartL) {
        siteIntervalMap[targetSiteKeyL].intervals.push({ start: effStartL, end: effEndL });
    }

    siteIntervalMap[targetSiteKeyL].alarms.push({
        alarmName: alarmNameL,
        occurMs: startL,
        clearMs: isLiveActive ? 0 : rawClearL,
        effStart: effStartL,
        isLiveAlarm: isLiveActive,
        isHistoryCleared: !isLiveActive
    });
}

// ==========================================
// 7. PROCESS HISTORY ALARMS
// ==========================================
for (var h = 0; h < historyRows.length; h++) {
    var alarmH = historyRows[h];
    var startH = parseOWSTimestamp(alarmH.firstinserttime || alarmH.firstoccurrence, windowStartMs);
    var rawClearH = parseOWSTimestamp(alarmH.cleartime, 0);

    var isHistoryCleared = rawClearH > 0;
    var endH = isHistoryCleared ? rawClearH : windowEndMs;

    if (startH <= windowEndMs && endH >= windowStartMs && startH > 0) {
        var targetSiteKeyH = findMatchingSiteKey(alarmH);
        if (!targetSiteKeyH || !siteIntervalMap[targetSiteKeyH]) continue;

        var effStart = startH < windowStartMs ? windowStartMs : startH;
        var effEnd = endH > windowEndMs ? windowEndMs : endH;
        var alarmNameH = extractOWSField(alarmH.alarmname || alarmH.rawalarmname || 'Site Down Alarm');

        if (effEnd > effStart) {
            totalAlarmCountAccumulated++;
            siteIntervalMap[targetSiteKeyH].totalAlarms += 1;
            if (!isHistoryCleared) {
                siteIntervalMap[targetSiteKeyH].activeAlarms += 1;
            }

            if (startH > 0 && (siteIntervalMap[targetSiteKeyH].firstOccurMs === 0 || startH < siteIntervalMap[targetSiteKeyH].firstOccurMs)) {
                siteIntervalMap[targetSiteKeyH].firstOccurMs = startH;
            }

            siteIntervalMap[targetSiteKeyH].intervals.push({ start: effStart, end: effEnd });
            siteIntervalMap[targetSiteKeyH].alarms.push({
                alarmName: alarmNameH,
                occurMs: startH,
                clearMs: endH,
                effStart: effStart,
                isHistoryCleared: isHistoryCleared
            });
        }
    }
}

// ==========================================
// 8. CALCULATE MERGED DOWNTIME & SLA AVAILABILITY PER SITE
// ==========================================
var sitesList = [];
var affectedSitesCount = 0;
var activeDownSitesCount = 0;
var totalAvailRateSum = 0;
var maxDowntimeMs = 0;
var mostAffectedSiteName = "-";
var mostAffectedSiteDowntime = "0m";

for (var sKey in siteIntervalMap) {
    var item = siteIntervalMap[sKey];
    var totalDowntimeMergedMs = 0;
    var latestOccurMs = 0;

    if (item.intervals.length > 0) {
        var mergedIntervals = mergeOverlappingIntervals(item.intervals);

        for (var m = 0; m < mergedIntervals.length; m++) {
            var mergedPeriod = mergedIntervals[m];
            var mergedDuration = mergedPeriod.end - mergedPeriod.start;
            if (mergedDuration > 0) {
                totalDowntimeMergedMs += mergedDuration;
            }
        }

        if (totalDowntimeMergedMs > totalWindowMs) {
            totalDowntimeMergedMs = totalWindowMs;
        }

        item.alarms.sort(function (a, b) {
            return (b.occurMs || 0) - (a.occurMs || 0);
        });

        if (item.alarms.length > 0 && item.alarms[0].occurMs > 0) {
            latestOccurMs = item.alarms[0].occurMs;
        }
    }

    var siteWindowStartMs = windowStartMs;
    if (item.onAirMs > 0 && item.onAirMs > windowStartMs) {
        siteWindowStartMs = item.onAirMs;
    }

    var siteWindowEndMs = (windowEndMs > nowMs) ? nowMs : windowEndMs;
    var siteEffectiveWindowMs = siteWindowEndMs - siteWindowStartMs;
    if (siteEffectiveWindowMs <= 0) siteEffectiveWindowMs = 1;

    if (totalDowntimeMergedMs > siteEffectiveWindowMs) {
        totalDowntimeMergedMs = siteEffectiveWindowMs;
    }

    if (totalDowntimeMergedMs > 0 || item.alarms.length > 0) {
        affectedSitesCount++;
    }
    if (item.activeAlarms > 0) {
        activeDownSitesCount++;
    }

    if (totalDowntimeMergedMs > maxDowntimeMs) {
        maxDowntimeMs = totalDowntimeMergedMs;
        mostAffectedSiteName = sKey;
        mostAffectedSiteDowntime = formatDuration(totalDowntimeMergedMs);
    }

    var availableMs = siteEffectiveWindowMs - totalDowntimeMergedMs;
    if (availableMs < 0) availableMs = 0;

    var availRate = ((availableMs / siteEffectiveWindowMs) * 100).toFixed(1);
    totalAvailRateSum += Number(availRate);

    var lastOccStr = "-";
    if (latestOccurMs > 0) {
        lastOccStr = formatTimeOnly(latestOccurMs);
    }

    // Summary service: skip formattedAlarms & tickets building (hemat JS commands)
    sitesList.push({
        siteName: item.siteName,
        siteId: item.siteId || '-',
        regionLabel: item.regionLabel || '-',
        regionId: item.regionId || '-',
        vendorLabel: item.vendorLabel || '-',
        vendorId: item.vendorId || '-',
        totalAlarms: item.totalAlarms,
        activeAlarms: item.activeAlarms,
        downtimeMs: totalDowntimeMergedMs,
        lastOccurrenceMs: latestOccurMs,
        downtimeFormatted: formatDuration(totalDowntimeMergedMs),
        availableFormatted: formatDuration(availableMs),
        availRatePct: availRate,
        lastOccurrenceStr: lastOccStr,
        isDown: item.activeAlarms > 0,
        isCurrentlyDown: item.activeAlarms > 0,
        hasHistoricalDowntime: totalDowntimeMergedMs > 0
    });
}

sitesList.sort(function (a, b) {
    var aActive = (a.activeAlarms > 0) ? 1 : 0;
    var bActive = (b.activeAlarms > 0) ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return (b.lastOccurrenceMs || 0) - (a.lastOccurrenceMs || 0);
});

var globalAvgAvailabilityPct = sitesList.length > 0 ? (totalAvailRateSum / sitesList.length).toFixed(1) : "100.0";

var execEndMs = new Date().getTime();
var totalExecDurationMs = execEndMs - execStartMs;

return {
    result: {
        success: true,
        message: "FWA Site Fault Alarm Summary loaded.",
        queryParams: {
            startDate: startISO.substring(0, 10),
            endDate: endISO.substring(0, 10)
        },
        summary: {
            totalAlarmsDown: totalAlarmCountAccumulated,
            sitesAffected: affectedSitesCount,
            activeDownSites: activeDownSitesCount,
            avgAvailabilityPct: globalAvgAvailabilityPct,
            mostAffectedSite: mostAffectedSiteName,
            mostAffectedSiteDowntime: mostAffectedSiteDowntime
        },
        pagination: {
            currentPage: 1,
            pageSize: 0,
            totalSites: sitesList.length,
            totalPages: 1
        },
        sites: [],
        _performanceStatus: {
            executionDurationMs: totalExecDurationMs,
            executionDurationSec: (totalExecDurationMs / 1000).toFixed(2) + "s",
            isCpuSafe: totalExecDurationMs < 5000,
            statusMessage: totalExecDurationMs < 5000 ? ("AMAN / RAMAH CPU (" + totalExecDurationMs + "ms)") : ("BERAT (" + totalExecDurationMs + "ms)")
        }
    }
};

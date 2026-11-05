/**
 * OWS GDE Studio - Alarm Monitoring RunScript Backend (alarmGet / alrmget)
 * Optimized to stay well under the ADC "JS Command" quota (20M) while keeping
 * the exact same output/logic:
 *  - parseOWSTimestamp fast-paths epoch numbers & clean "YYYY-MM-DD HH:MM:SS"
 *    strings (avoids the very expensive new Date(string) per row).
 *  - queryByTql is defensive against over-sized pages (truncates to the cap).
 *  - The CMDB site list is scanned once instead of twice.
 *  - History alarms are matched to a site BEFORE heavy timestamp parsing.
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
            return extractOWSField(item);
        }
        return String(item).trim();
    }
    if (typeof val === 'object') {
        var pick = val.label || val.text || val.name || val.value || val.local || val.utc || val.time || val.timestamp || '';
        return String(pick).trim();
    }
    return String(val).trim();
}

function toNumber(value) {
    var n = parseFloat(value);
    return isNaN(n) ? 0 : n;
}

/**
 * Fast manual parse for "YYYY-MM-DD[ T]HH:MM:SS[.sss]" (no timezone suffix).
 * Replicates the legacy behaviour of appending "+07:00" before new Date().
 * Returns epoch ms, or -1 when the string does not match this exact shape
 * (caller falls back to the original new Date() logic).
 */
function fastParseDateString(s) {
    if (s.length < 19) return -1;
    if (s.indexOf('Z') !== -1 || s.indexOf('+') !== -1) return -1;
    if (s.lastIndexOf('-') > 10) return -1;
    var sep = s.charAt(10);
    if (sep !== 'T' && sep !== ' ') return -1;
    var y = Number(s.substring(0, 4));
    var mo = Number(s.substring(5, 7));
    var d = Number(s.substring(8, 10));
    var hh = Number(s.substring(11, 13));
    var mi = Number(s.substring(14, 16));
    var ss = Number(s.substring(17, 19));
    if (y < 1000 || mo < 1 || mo > 12 || d < 1 || d > 31 || hh < 0 || hh > 23 || mi < 0 || mi > 59 || ss < 0 || ss > 59) return -1;
    var ms = 0;
    if (s.length > 20 && s.charAt(19) === '.') {
        var msStr = s.substring(20, 23);
        if (msStr.length !== 3) return -1;
        ms = Number(msStr);
    }
    var utcMs = Date.UTC(y, mo - 1, d, hh, mi, ss, ms);
    if (isNaN(utcMs)) return -1;
    return utcMs - 25200000;
}

function parseOWSTimestamp(val, defaultFallback) {
    if (val === null || val === undefined) return defaultFallback || 0;
    if (typeof val === 'number') {
        if (val > 0) {
            return (val < 10000000000) ? (val * 1000) : val;
        }
        return defaultFallback || 0;
    }
    if (typeof val === 'string') {
        var s = val.trim();
        if (s === '') return defaultFallback || 0;
        if (s.indexOf('-') !== -1 || s.indexOf('/') !== -1) {
            var fast = fastParseDateString(s);
            if (fast !== -1) return fast;
            var cleanStr = s.replace(' ', 'T');
            if (cleanStr.indexOf('Z') === -1 && cleanStr.indexOf('+') === -1 && cleanStr.lastIndexOf('-') <= 7) {
                cleanStr += '+07:00';
            }
            var dt = new Date(cleanStr);
            if (!isNaN(dt.getTime())) return dt.getTime();
        }
        var num = parseFloat(s);
        if (!isNaN(num) && num > 0) {
            if (num < 10000000000) return num * 1000;
            return num;
        }
        return defaultFallback || 0;
    }
    if (typeof val === 'object') {
        if (typeof val.getTime === 'function') {
            var dObjMs = val.getTime();
            if (!isNaN(dObjMs) && dObjMs > 0) return dObjMs;
        }
        if (Array.isArray(val)) {
            return val.length > 0 ? parseOWSTimestamp(val[0], defaultFallback) : (defaultFallback || 0);
        }
        var epochKeys = [val.time, val.timestamp, val.millis, val.value];
        for (var ek = 0; ek < epochKeys.length; ek++) {
            if (epochKeys[ek] !== undefined && epochKeys[ek] !== null && epochKeys[ek] !== '') {
                var ekParsed = parseOWSTimestamp(epochKeys[ek], 0);
                if (ekParsed > 0) return ekParsed;
            }
        }
        var strKeys = [val.local, val.utc, val.text];
        for (var sk = 0; sk < strKeys.length; sk++) {
            if (strKeys[sk] !== undefined && strKeys[sk] !== null && strKeys[sk] !== '') {
                var skParsed = parseOWSTimestamp(strKeys[sk], 0);
                if (skParsed > 0) return skParsed;
            }
        }
        var jy = val.year, jm = val.month, jd = val.date || val.day;
        if (jy !== undefined && jm !== undefined && jd !== undefined) {
            var jh = val.hours || 0, jmi = val.minutes || 0, js = val.seconds || 0;
            var jMs = Date.UTC(Number(jy), Number(jm) - 1, Number(jd), Number(jh), Number(jmi), Number(js), 0);
            if (!isNaN(jMs) && jMs > 0) return jMs - 25200000;
        }
        return defaultFallback || 0;
    }
    var str = extractOWSField(val);
    if (!str) return defaultFallback || 0;
    if (str.indexOf('-') !== -1 || str.indexOf('/') !== -1) {
        var cleanStr2 = str.trim().replace(' ', 'T');
        if (cleanStr2.indexOf('Z') === -1 && cleanStr2.indexOf('+') === -1 && cleanStr2.lastIndexOf('-') <= 7) {
            cleanStr2 += '+07:00';
        }
        var dt2 = new Date(cleanStr2);
        if (!isNaN(dt2.getTime())) return dt2.getTime();
    }
    var num2 = parseFloat(str);
    if (!isNaN(num2) && num2 > 0) {
        if (num2 < 10000000000) return num2 * 1000;
        return num2;
    }
    return defaultFallback || 0;
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

function queryByTql(tql, parameters, customMaxLimit) {
    var allRows = [];
    var start = 0;
    var isUnlimited = (customMaxLimit === 0);
    var maxRowsLimit = isUnlimited ? Infinity : (customMaxLimit || 5000);
    var pageSize = isUnlimited ? 1000 : Math.min(1000, maxRowsLimit);
    if (pageSize < 1) pageSize = 1;

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

            // Defensive: if the backend returns more rows than requested,
            // trim to the intended page size so the total never explodes.
            if (pageRows.length > pageSize) {
                pageRows = pageRows.slice(0, pageSize);
            }

            var remaining = maxRowsLimit - allRows.length;
            if (!isUnlimited && pageRows.length > remaining) {
                pageRows = pageRows.slice(0, remaining);
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
var reqPageSize = parseInt(extractOWSField(reqParams.pageSize || '20'), 10);
if (isNaN(reqPage) || reqPage < 1) reqPage = 1;
if (isNaN(reqPageSize) || reqPageSize < 1) reqPageSize = 20;

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
var regionTql = "SELECT id, region_name, active FROM \"/datahub/cmdb/cmdb_region\" WHERE active = '1' OR active = true OR active = 'true'";
var vendorRows = queryByTql(vendorTql, {}, 500);
var regionRows = queryByTql(regionTql, {}, 500);

var regionMap = {};
var regionNameToIdsMap = {};
var allRegionNamesSet = {};
for (var r = 0; r < regionRows.length; r++) {
    var rRow = regionRows[r];
    var rId = extractOWSField(getPropIC(rRow, 'id') || getPropIC(rRow, 'keycode'));
    var rName = extractOWSField(getPropIC(rRow, 'region_name') || getPropIC(rRow, 'keycode'));
    var rActive = getPropIC(rRow, 'active');
    if (rActive === false || rActive === 'false') continue;
    if (rId && rName) {
        regionMap[rId] = rName;
        allRegionNamesSet[rName] = true;
        var lowerName = rName.toLowerCase();
        if (!regionNameToIdsMap[lowerName]) regionNameToIdsMap[lowerName] = [];
        regionNameToIdsMap[lowerName].push("'" + rId + "'");
    }
}
var availableRegionsList = Object.keys(allRegionNamesSet).sort();

var vendorMap = {};
var vendorNameToIdsMap = {};
var allVendorNamesSet = {};
for (var v = 0; v < vendorRows.length; v++) {
    var vRow = vendorRows[v];
    var vId = extractOWSField(getPropIC(vRow, 'id') || getPropIC(vRow, 'value_id') || getPropIC(vRow, 'keycode'));
    var vName = extractOWSField(getPropIC(vRow, 'vendor_name') || getPropIC(vRow, 'label') || getPropIC(vRow, 'keycode'));
    if (vId && vName) {
        vendorMap[vId] = vName;
        allVendorNamesSet[vName] = true;
        var lowerVName = vName.toLowerCase();
        if (!vendorNameToIdsMap[lowerVName]) vendorNameToIdsMap[lowerVName] = [];
        vendorNameToIdsMap[lowerVName].push("'" + vId + "'");
    }
}
var availableVendorsList = Object.keys(allVendorNamesSet).sort();

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

// ==========================================
// 4. SINGLE PASS OVER CMDB SITES
//    -> pre-populate siteIntervalMap / siteIdToKeyMap
//    (alarm queries scope to FWA sites via JOIN to cmdb_site, netdrone-style)
// ==========================================
var siteIntervalMap = {};
var siteIdToKeyMap = {};
var lowerRegionFilter = selectedRegionStr !== "" ? selectedRegionStr.toLowerCase() : '';
var lowerVendorFilter = selectedVendorStr !== "" ? selectedVendorStr.toLowerCase() : '';
var lowerSearchFilter = searchQueryStr !== "" ? searchQueryStr.toLowerCase() : '';

for (var cs = 0; cs < cmdbSiteRows.length; cs++) {
    var cRow = cmdbSiteRows[cs];
    var cSiteIdRaw = extractOWSField(getPropIC(cRow, 'site_id') || getPropIC(cRow, 'keycode'));

    var cSiteName = extractOWSField(getPropIC(cRow, 'site_name'));
    if (!cSiteName) continue;

    var cSiteId = cSiteIdRaw || '-';

    var cVendorRaw = extractOWSField(getPropIC(cRow, 'vendor'));
    var cVendorLabel = vendorMap[cVendorRaw] || cVendorRaw || '-';

    var cRegionRaw = extractOWSField(getPropIC(cRow, 'region_name'));
    var cRegionName = regionMap[cRegionRaw] || cRegionRaw || '-';

    if (selectedRegionStr !== "" && cRegionName.toLowerCase() !== lowerRegionFilter && cRegionRaw.toLowerCase() !== lowerRegionFilter) {
        continue;
    }
    if (selectedVendorStr !== "" && cVendorLabel.toLowerCase() !== lowerVendorFilter && cVendorRaw.toLowerCase() !== lowerVendorFilter) {
        continue;
    }
    if (searchQueryStr !== "") {
        var sq = lowerSearchFilter;
        var matchName = cSiteName.toLowerCase().indexOf(sq) !== -1;
        var matchId = cSiteIdRaw ? (cSiteIdRaw.toLowerCase().indexOf(sq) !== -1) : false;
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
// 5. QUERY LIVE, HISTORY, TROUBLE TICKET & BS LOOKUP
// ==========================================
var liveTql = "SELECT al.sitecode, al.logicsiteid, al.sitename, al.sitedownfault, al.firstinserttime, al.firstoccurrence, al.cleartime, al.active, al.alarmname, al.rawalarmname FROM \"/AlarmBase/ICT_AlarmPush/ap_alarm_live\" AS al " +
    "INNER JOIN \"/datahub/cmdb/cmdb_site\" AS site ON al.sitecode = site.site_id " +
    "WHERE site.access_type = 'ce1d6700-f34d-11f0-80d8-0255ac12193b' " +
    "AND site.site_stage = 'f343d1fb-e165-11f0-90da-0255ac121938' " +
    "AND (al.sitedownfault = '1' OR al.sitedownfault = 1)";

var historyTql = "SELECT al.sitecode, al.logicsiteid, al.sitename, al.sitedownfault, al.firstinserttime, al.firstoccurrence, al.cleartime, al.active, al.alarmname, al.rawalarmname FROM \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" AS al " +
    "INNER JOIN \"/datahub/cmdb/cmdb_site\" AS site ON al.sitecode = site.site_id " +
    "WHERE site.access_type = 'ce1d6700-f34d-11f0-80d8-0255ac12193b' " +
    "AND site.site_stage = 'f343d1fb-e165-11f0-90da-0255ac121938' " +
    "AND al.firstinserttime <= " + windowEndMs + " " +
    "AND (al.cleartime >= " + windowStartMs + " OR al.cleartime = 0 OR al.cleartime IS NULL) " +
    "AND (al.sitedownfault = '1' OR al.sitedownfault = 1)";

var ttTql = "SELECT sitename, acc_root_cause_site_name, orderidview, sourceticketid, faultno, eventno, ticketid, orderid, id, root_cause, rootcause, level_one_root_cause, sub_root_cause, subcause, level_two_root_cause, subsolutiontype, businessstatus, createtime, processdefkey, current_phase, operate_phase, ticketstatus FROM \"/TroubleTicket/TroubleTicket/tt_troubleticket\" " +
    "WHERE (createtime >= '" + startISO + "' AND createtime <= '" + endISO + "') " +
    "OR (createtime >= '" + startISO.substring(0, 10) + " 00:00:00' AND createtime <= '" + endISO.substring(0, 10) + " 23:59:59')";
var bsTql = "SELECT id, optionlabel FROM \"/Bpm/msup_options/msup_options_businessstatus\"";

var liveRows = queryByTql(liveTql, {}, 5000);
var HISTORY_ROW_CAP = 5000; // Cap history rows (bySite lebih berat: alarm objects + TT). Kuota JS 20M. 5000 = nilai terbukti aman di versi 10 aug. historyTruncated=true bila terpotong
var historyRows = queryByTql(historyTql, {}, HISTORY_ROW_CAP);
var historyTruncated = historyRows.length >= HISTORY_ROW_CAP;
var ttRows = queryByTql(ttTql, {}, 1000);
var bsRows = queryByTql(bsTql, {}, 200);

var bsStatusMap = {};
for (var bs = 0; bs < bsRows.length; bs++) {
    var bsRow = bsRows[bs];
    var bsId = extractOWSField(bsRow.id);
    var bsLabel = extractOWSField(bsRow.optionlabel);
    if (bsId && bsLabel) {
        bsStatusMap[bsId] = bsLabel;
    }
}

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

for (var t = 0; t < ttRows.length; t++) {
    var ttRow = ttRows[t];
    var tSite = extractOWSField(ttRow.sitename || ttRow.acc_root_cause_site_name);
    if (!tSite) continue;

    var tId = extractOWSField(ttRow.orderidview || ttRow.sourceticketid || ttRow.faultno || ttRow.eventno || ttRow.ticketid);
    if (!tId) continue;

    var tRc = extractOWSField(ttRow.root_cause || ttRow.rootcause || ttRow.level_one_root_cause);
    var tSubRc = extractOWSField(ttRow.sub_root_cause || ttRow.subcause || ttRow.level_two_root_cause || ttRow.subsolutiontype);

    var tBsUuid = extractOWSField(ttRow.businessstatus);
    var tBsLabel = (tBsUuid && bsStatusMap[tBsUuid]) ? bsStatusMap[tBsUuid] : '-';

    var tCreateStr = extractOWSField(ttRow.createtime || '');
    var tCreateMs = parseOWSTimestamp(tCreateStr, 0);
    if (isNaN(tCreateMs)) tCreateMs = 0;

    var tDateStr = getLocalDateStr(tCreateStr) || getLocalDateStr(tCreateMs);

    var ttEntry = {
        ticketId: tId,
        createtimeMs: tCreateMs,
        createtimeStr: tCreateStr || '-',
        rootCause: tRc || '-',
        subRootCause: tSubRc || '-',
        businessstatusLabel: tBsLabel
    };

    if (tDateStr) {
        var compositeKey = tSite + "_" + tDateStr;
        if (!ttDateIndexMap[compositeKey]) {
            ttDateIndexMap[compositeKey] = [];
        }
        ttDateIndexMap[compositeKey].push(ttEntry);
    }
}

function getSiteTickets(siteName, firstOccurMs) {
    if (!siteName || !firstOccurMs || firstOccurMs <= 0) return [];
    var dateStr = getLocalDateStr(firstOccurMs);
    if (!dateStr) return [];

    var compositeKey = siteName + "_" + dateStr;
    var list = ttDateIndexMap[compositeKey];
    if (!list || list.length === 0) return [];

    return list;
}

var totalAlarmCountAccumulated = 0;

// ==========================================
// 6. PROCESS LIVE ALARMS
// ==========================================
for (var l = 0; l < liveRows.length; l++) {
    var alarmL = liveRows[l];
    var targetSiteKeyL = findMatchingSiteKey(alarmL);
    if (!targetSiteKeyL || !siteIntervalMap[targetSiteKeyL]) continue;

    var startL = parseOWSTimestamp(alarmL.firstinserttime || alarmL.firstoccurrence, 0);
    if (startL <= 0 || startL > windowEndMs) continue;

    var rawClearL = parseOWSTimestamp(alarmL.cleartime, 0);
    var isLiveActive = (rawClearL === 0);

    totalAlarmCountAccumulated++;
    var siteItemL = siteIntervalMap[targetSiteKeyL];
    siteItemL.totalAlarms += 1;
    if (isLiveActive) {
        siteItemL.activeAlarms += 1;
    }

    var effStartL = startL < windowStartMs ? windowStartMs : startL;
    var effEndL = isLiveActive ? ((windowEndMs > nowMs) ? nowMs : windowEndMs) : (rawClearL > windowEndMs ? windowEndMs : rawClearL);
    var alarmNameL = extractOWSField(alarmL.alarmname || alarmL.rawalarmname || 'Site Down Alarm');

    if (siteItemL.firstOccurMs === 0 || startL < siteItemL.firstOccurMs) {
        siteItemL.firstOccurMs = startL;
    }

    if (effEndL > effStartL) {
        siteItemL.intervals.push({ start: effStartL, end: effEndL });
    }

    siteItemL.alarms.push({
        alarmName: alarmNameL,
        occurMs: startL,
        clearMs: isLiveActive ? 0 : rawClearL,
        effStart: effStartL,
        isLiveAlarm: isLiveActive,
        isHistoryCleared: !isLiveActive
    });
}

// ==========================================
// 7. PROCESS HISTORY ALARMS (site match first to skip useless parsing)
// ==========================================
for (var h = 0; h < historyRows.length; h++) {
    var alarmH = historyRows[h];
    var targetSiteKeyH = findMatchingSiteKey(alarmH);
    if (!targetSiteKeyH || !siteIntervalMap[targetSiteKeyH]) continue;

    var startH = parseOWSTimestamp(alarmH.firstinserttime || alarmH.firstoccurrence, windowStartMs);
    if (startH <= 0 || startH > windowEndMs) continue;

    var rawClearH = parseOWSTimestamp(alarmH.cleartime, 0);
    var isHistoryCleared = rawClearH > 0;
    var endH = isHistoryCleared ? rawClearH : windowEndMs;
    if (endH < windowStartMs) continue;

    var siteItemH = siteIntervalMap[targetSiteKeyH];
    var effStart = startH < windowStartMs ? windowStartMs : startH;
    var effEnd = endH > windowEndMs ? windowEndMs : endH;
    var alarmNameH = extractOWSField(alarmH.alarmname || alarmH.rawalarmname || 'Site Down Alarm');

    if (effEnd > effStart) {
        totalAlarmCountAccumulated++;
        siteItemH.totalAlarms += 1;
        if (!isHistoryCleared) {
            siteItemH.activeAlarms += 1;
        }

        if (siteItemH.firstOccurMs === 0 || startH < siteItemH.firstOccurMs) {
            siteItemH.firstOccurMs = startH;
        }

        siteItemH.intervals.push({ start: effStart, end: effEnd });
        siteItemH.alarms.push({
            alarmName: alarmNameH,
            occurMs: startH,
            clearMs: endH,
            effStart: effStart,
            isHistoryCleared: isHistoryCleared
        });
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

    var isCurrentlyDown = item.activeAlarms > 0;

    sitesList.push({
        siteName: item.siteName,
        siteId: item.siteId || '-',
        regionLabel: item.regionLabel || '-',
        regionId: item.regionId || '-',
        vendorLabel: item.vendorLabel || '-',
        vendorId: item.vendorId || '-',
        onAirMs: item.onAirMs || 0,
        onAirStr: item.onAirStr || (item.onAirMs ? formatTimeOnly(item.onAirMs) : '-'),
        totalAlarms: item.totalAlarms,
        activeAlarms: item.activeAlarms,
        downtimeMs: totalDowntimeMergedMs,
        availableMs: availableMs,
        lastOccurrenceMs: latestOccurMs,
        availRatePct: availRate,
        firstOccurMs: item.firstOccurMs || 0,
        isDown: isCurrentlyDown,
        isCurrentlyDown: isCurrentlyDown,
        hasHistoricalDowntime: totalDowntimeMergedMs > 0,
        rawAlarms: item.alarms || []
    });
}

sitesList.sort(function (a, b) {
    var aActive = (a.activeAlarms > 0) ? 1 : 0;
    var bActive = (b.activeAlarms > 0) ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return (b.lastOccurrenceMs || 0) - (a.lastOccurrenceMs || 0);
});

var globalAvgAvailabilityPct = sitesList.length > 0 ? (totalAvailRateSum / sitesList.length).toFixed(1) : "-";

// Server-side pagination: page & pageSize dikirim dari frontend sebagai input param
var totalSites = sitesList.length;
var totalPages = Math.ceil(totalSites / reqPageSize) || 1;
if (reqPage > totalPages) reqPage = totalPages;
if (reqPage < 1) reqPage = 1;

var startIndex = (reqPage - 1) * reqPageSize;
var rawPagedSites = sitesList.slice(startIndex, startIndex + reqPageSize);

// LAZY FORMATTING: Hanya format 20 site yang tampil di page ini! (Hemat >95% JS commands)
var pagedSites = [];
for (var ps = 0; ps < rawPagedSites.length; ps++) {
    var pSite = rawPagedSites[ps];
    var formattedAlarms = [];

    if (pSite.isCurrentlyDown) {
        for (var fa = 0; fa < pSite.rawAlarms.length; fa++) {
            var rawAlm = pSite.rawAlarms[fa];
            var isLiveActive = rawAlm.isLiveAlarm || (!rawAlm.isHistoryCleared && (rawAlm.clearMs >= windowEndMs || rawAlm.clearMs === 0 || rawAlm.clearMs === nowMs));
            var almEffStart = rawAlm.effStart || rawAlm.occurMs || windowStartMs;
            var almEffEnd = isLiveActive ? (nowMs > windowEndMs ? windowEndMs : nowMs) : (rawAlm.clearMs || windowEndMs);
            var durMs = almEffEnd - almEffStart;
            if (durMs < 0) durMs = 0;

            formattedAlarms.push({
                alarmName: rawAlm.alarmName,
                occurMs: rawAlm.occurMs,
                clearMs: isLiveActive ? 0 : rawAlm.clearMs,
                occurStr: formatTimeOnly(rawAlm.occurMs),
                clearStr: isLiveActive ? 'Active (Now)' : (rawAlm.clearMs > 0 ? formatTimeOnly(rawAlm.clearMs) : '-'),
                durationFormatted: formatDuration(durMs)
            });
        }
    }

    var lastOccStr = pSite.lastOccurrenceMs > 0 ? formatTimeOnly(pSite.lastOccurrenceMs) : "-";

    pagedSites.push({
        siteName: pSite.siteName,
        siteId: pSite.siteId,
        regionLabel: pSite.regionLabel,
        regionId: pSite.regionId,
        vendorLabel: pSite.vendorLabel,
        vendorId: pSite.vendorId,
        onAirMs: pSite.onAirMs,
        onAirStr: pSite.onAirStr,
        totalAlarms: pSite.totalAlarms,
        activeAlarms: pSite.activeAlarms,
        downtimeMs: pSite.downtimeMs,
        lastOccurrenceMs: pSite.lastOccurrenceMs,
        downtimeFormatted: formatDuration(pSite.downtimeMs),
        availableFormatted: formatDuration(pSite.availableMs),
        availRatePct: pSite.availRatePct,
        lastOccurrenceStr: lastOccStr,
        isDown: pSite.isDown,
        isCurrentlyDown: pSite.isCurrentlyDown,
        hasHistoricalDowntime: pSite.hasHistoricalDowntime,
        alarms: formattedAlarms,
        tickets: pSite.downtimeMs > 0 ? getSiteTickets(pSite.siteName, pSite.firstOccurMs) : []
    });
}

var execEndMs = new Date().getTime();
var totalExecDurationMs = execEndMs - execStartMs;

return {
    result: {
        success: true,
        message: "FWA Site Fault Alarm List loaded.",
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
            mostAffectedSiteDowntime: mostAffectedSiteDowntime,
            availableRegions: availableRegionsList,
            availableVendors: availableVendorsList,
            historyTruncated: historyTruncated,
            historyRowCount: historyRows.length,
            historyRowCap: HISTORY_ROW_CAP
        },
        pagination: {
            currentPage: reqPage,
            pageSize: reqPageSize,
            totalSites: totalSites,
            totalPages: totalPages
        },
        sites: pagedSites,
    }
};

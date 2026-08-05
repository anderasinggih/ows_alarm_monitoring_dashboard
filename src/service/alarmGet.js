/**
 * OWS GDE Studio - Alarm Monitoring RunScript Backend (alarmGet / alrmget)
 * Features:
 * - SLA Summary & Site Aggregation (Merged Overlapping Intervals)
 * - Raw Alarm List per Site for Site Detail Drilldown Modal
 */

// Safe JSON.parse Wrapper di baris pertama (Strict Rule)
(function () {
    if (typeof JSON !== 'undefined' && JSON.parse) {
        var _nativeJSONParse = JSON.parse;
        JSON.parse = function (text, reviver) {
            if (text === undefined || text === null || text === 'undefined' || text === '') {
                return null;
            }
            try {
                return _nativeJSONParse.call(JSON, text, reviver);
            } catch (e) {
                return null;
            }
        };
    }
})();

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

function getRows(response) {
    if (!response) return [];
    if (response.result && response.result._values) return response.result._values;
    if (response.result && response.result.results) return response.result.results;
    if (response._values) return response._values;
    if (response.results) return response.results;
    if (response.data) return response.data;
    return [];
}

function queryByTql(tql, parameters) {
    var allRows = [];
    var start = 0;
    var pageSize = 1000;
    var maxRowsLimit = 5000; // Hard limit untuk keamanan RAM OWS Engine (Max 5.000 record per request)

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
    var yyyy = dateObj.getFullYear();
    var mm = String(dateObj.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var dd = String(dateObj.getDate());
    if (dd.length < 2) dd = "0" + dd;
    var hh = String(dateObj.getHours());
    if (hh.length < 2) hh = "0" + hh;
    var mi = String(dateObj.getMinutes());
    if (mi.length < 2) mi = "0" + mi;
    var ss = String(dateObj.getSeconds());
    if (ss.length < 2) ss = "0" + ss;
    return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss;
}

function formatTimeOnly(ms) {
    if (!ms) return "-";
    // Force WIB (UTC+7) offset conversion
    var d = new Date(Number(ms) + (7 * 60 * 60 * 1000));
    var hh = String(d.getUTCHours());
    if (hh.length < 2) hh = "0" + hh;
    var mi = String(d.getUTCMinutes());
    if (mi.length < 2) mi = "0" + mi;
    var ss = String(d.getUTCSeconds());
    if (ss.length < 2) ss = "0" + ss;
    return hh + ":" + mi + ":" + ss;
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

// 1. READ INPUT PARAMETERS
var inputObj = typeof input !== 'undefined' ? input : (typeof _message !== 'undefined' ? _message : {});
if (inputObj._values && Array.isArray(inputObj._values) && inputObj._values.length > 0) {
    inputObj = inputObj._values[0];
}

var reqParams = inputObj.input_params || inputObj;

var startDateStr = extractOWSField(reqParams.startDate);
var endDateStr = extractOWSField(reqParams.endDate);

var nowObj = new Date();
var nowMs = nowObj.getTime();
var windowStartMs;
var windowEndMs = nowMs;

// Default to ROLLING 24 HOURS if no startDate and endDate provided
if (startDateStr === "" && endDateStr === "") {
    windowEndMs = nowMs;
    windowStartMs = nowMs - (24 * 60 * 60 * 1000);
} else if (startDateStr !== "" && endDateStr !== "") {
    if (startDateStr.length > 10) startDateStr = startDateStr.substring(0, 10);
    if (endDateStr.length > 10) endDateStr = endDateStr.substring(0, 10);

    // Check if user selected 24h range or single day
    var dStartTemp = new Date(startDateStr + "T00:00:00");
    var dEndTemp = new Date(endDateStr + "T00:00:00");

    var diffDays = Math.round((dEndTemp.getTime() - dStartTemp.getTime()) / (24 * 60 * 60 * 1000));

    if (diffDays <= 1) {
        // ROLLING 24 HOURS: Exact last 24 hours from current timestamp (now - 24h to now)
        windowEndMs = nowMs;
        windowStartMs = nowMs - (24 * 60 * 60 * 1000);
    } else {
        // Multi-day custom range
        windowStartMs = isNaN(dStartTemp.getTime()) ? (nowMs - 24 * 60 * 60 * 1000) : dStartTemp.getTime();
        var dEndFull = new Date(endDateStr + "T23:59:59");
        windowEndMs = isNaN(dEndFull.getTime()) ? nowMs : dEndFull.getTime();
    }
} else if (startDateStr !== "") {
    if (startDateStr.length > 10) startDateStr = startDateStr.substring(0, 10);
    var dStart = new Date(startDateStr + "T00:00:00");
    windowStartMs = isNaN(dStart.getTime()) ? (nowMs - 24 * 60 * 60 * 1000) : dStart.getTime();
    windowEndMs = windowStartMs + (24 * 60 * 60 * 1000);
} else {
    windowEndMs = nowMs;
    windowStartMs = nowMs - (24 * 60 * 60 * 1000);
}

var totalWindowMs = windowEndMs - windowStartMs;
if (totalWindowMs <= 0) totalWindowMs = 24 * 60 * 60 * 1000;

var startISO = formatISODate(new Date(windowStartMs));
var endISO = formatISODate(new Date(windowEndMs));

// 2. QUERY LIVE & HISTORY ALARMS (Optimized with Dual Format ISO & Epoch Ms to Support Any OWS Column Type)
var liveTql = "SELECT * FROM \"/AlarmBase/ICT_AlarmPush/ap_alarm_live\" " +
    "WHERE (sitedownfault = '1' OR sitedownfault = 1) " +
    "AND (domain = '1001' OR domain = 1001)";

var historyTql = "SELECT * FROM \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
    "WHERE (sitedownfault = '1' OR sitedownfault = 1) " +
    "AND (domain = '1001' OR domain = 1001) " +
    "AND ((cleartime >= " + windowStartMs + " AND firstinserttime <= " + windowEndMs + ") " +
    "OR (cleartime >= '" + startISO + "' AND firstinserttime <= '" + endISO + "'))";

var liveRows = queryByTql(liveTql);
var historyRows = queryByTql(historyTql);

function getSiteNameFromRecord(record) {
    if (!record) return '';
    return extractOWSField(record.sitename);
}

var siteIntervalMap = {};
var totalLiveAlarms = 0;

// Collect Raw Intervals & Alarm Details per Site
for (var l = 0; l < liveRows.length; l++) {
    var alarmL = liveRows[l];
    var siteNameL = getSiteNameFromRecord(alarmL);
    if (!siteNameL) continue;

    totalLiveAlarms++;

    var startL = toNumber(alarmL.firstinserttime) || windowStartMs;
    // Cap startL to windowStartMs for availability calculation if occurred before window
    var effStartL = startL < windowStartMs ? windowStartMs : startL;
    var endL = windowEndMs;
    var alarmNameL = extractOWSField(alarmL.alarmname || alarmL.alarm_name || alarmL.rawalarmname || 'Site Down Alarm');

    if (!siteIntervalMap[siteNameL]) {
        siteIntervalMap[siteNameL] = {
            siteName: siteNameL,
            totalAlarms: 0,
            intervals: [],
            alarms: []
        };
    }

    siteIntervalMap[siteNameL].totalAlarms += 1;
    siteIntervalMap[siteNameL].intervals.push({ start: effStartL, end: endL });
    siteIntervalMap[siteNameL].alarms.push({
        alarmName: alarmNameL,
        occurMs: startL,
        clearMs: endL,
        occurStr: formatTimeOnly(startL),
        clearStr: 'Active (Now)',
        durationFormatted: formatDuration(endL - effStartL)
    });
}

for (var h = 0; h < historyRows.length; h++) {
    var alarmH = historyRows[h];
    var startH = toNumber(alarmH.firstinserttime) || windowStartMs;
    var endH = toNumber(alarmH.cleartime) || windowEndMs;

    if (endH >= windowStartMs && startH <= windowEndMs) {
        var siteNameH = getSiteNameFromRecord(alarmH);
        if (!siteNameH) continue;

        var effStart = startH < windowStartMs ? windowStartMs : startH;
        var effEnd = endH > windowEndMs ? windowEndMs : endH;
        var alarmNameH = extractOWSField(alarmH.alarmname || alarmH.alarm_name || alarmH.rawalarmname || 'Site Down Alarm');

        if (effEnd > effStart) {
            if (!siteIntervalMap[siteNameH]) {
                siteIntervalMap[siteNameH] = {
                    siteName: siteNameH,
                    totalAlarms: 0,
                    intervals: [],
                    alarms: []
                };
            }

            siteIntervalMap[siteNameH].totalAlarms += 1;
            siteIntervalMap[siteNameH].intervals.push({ start: effStart, end: effEnd });
            siteIntervalMap[siteNameH].alarms.push({
                alarmName: alarmNameH,
                occurMs: effStart,
                clearMs: effEnd,
                occurStr: formatTimeOnly(effStart),
                clearStr: formatTimeOnly(effEnd),
                durationFormatted: formatDuration(effEnd - effStart)
            });
        }
    }
}

// 3. MERGE OVERLAPPING INTERVALS & CALCULATE EXACT SLA
var sitesList = [];
var affectedSitesCount = 0;
var totalAvailRateSum = 0;
var maxDowntimeMs = -1;
var mostAffectedSiteName = "-";
var mostAffectedSiteDowntime = "0m";

var siteKeys = Object.keys(siteIntervalMap);
for (var k = 0; k < siteKeys.length; k++) {
    var sKey = siteKeys[k];
    var item = siteIntervalMap[sKey];

    if (item.intervals.length > 0) {
        affectedSitesCount++;

        var mergedIntervals = mergeOverlappingIntervals(item.intervals);

        var totalDowntimeMergedMs = 0;
        var latestOccurMs = 0;

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

        var availableMs = totalWindowMs - totalDowntimeMergedMs;
        if (availableMs < 0) availableMs = 0;

        var availRate = ((availableMs / totalWindowMs) * 100).toFixed(1);
        totalAvailRateSum += Number(availRate);

        if (totalDowntimeMergedMs > maxDowntimeMs) {
            maxDowntimeMs = totalDowntimeMergedMs;
            mostAffectedSiteName = sKey;
            mostAffectedSiteDowntime = formatDuration(totalDowntimeMergedMs);
        }

        // Urutkan daftar alarm individual per site berdasarkan Occur Time terbaru
        item.alarms.sort(function (a, b) {
            return (b.occurMs || 0) - (a.occurMs || 0);
        });

        if (item.alarms.length > 0 && item.alarms[0].occurMs > 0) {
            latestOccurMs = item.alarms[0].occurMs;
        }

        var lastOccStr = "-";
        if (latestOccurMs > 0) {
            lastOccStr = formatTimeOnly(latestOccurMs);
        }

        sitesList.push({
            siteName: item.siteName,
            totalAlarms: item.totalAlarms,
            downtimeMs: totalDowntimeMergedMs,
            lastOccurrenceMs: latestOccurMs,
            downtimeFormatted: formatDuration(totalDowntimeMergedMs),
            availableFormatted: formatDuration(availableMs),
            availRatePct: availRate,
            lastOccurrenceStr: lastOccStr,
            alarms: item.alarms // Detail daftar alarm per site untuk drilldown modal
        });
    }
}

// URUTKAN BERDASARKAN WAKTU OCCUR TERBARU (Most Recent Occur Time First)
sitesList.sort(function (a, b) {
    return (b.lastOccurrenceMs || 0) - (a.lastOccurrenceMs || 0);
});

var avgAvailabilityPct = sitesList.length > 0 ? (totalAvailRateSum / sitesList.length).toFixed(1) : "100.0";

return {
    result: {
        success: true,
        message: "FWA Site Fault Alarm Dashboard loaded (With Alarms List for Site Detail Modal).",
        queryParams: {
            startDate: startISO.substring(0, 10),
            endDate: endISO.substring(0, 10)
        },
        summary: {
            totalAlarmsDown: totalLiveAlarms,
            sitesAffected: affectedSitesCount,
            avgAvailabilityPct: avgAvailabilityPct,
            mostAffectedSite: mostAffectedSiteName,
            mostAffectedSiteDowntime: mostAffectedSiteDowntime
        },
        sites: sitesList
    }
};

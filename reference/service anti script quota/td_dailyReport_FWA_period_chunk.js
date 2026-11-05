var rangeStart = parseInt(_message.start_timestamp, 10);
var rangeEnd = parseInt(_message.end_timestamp, 10);

var region = _message.region;
var siteType = _message.site_type;
var siteList = _message.site_list;
var isHub = _message.is_hub;
var isVip = _message.is_vip;

if (
    isNaN(rangeStart) ||
    isNaN(rangeEnd) ||
    rangeStart > rangeEnd
) {
    throw new ScriptError("Invalid period timestamp.");
}

return {
    results: getPeriodOccurrences(
        rangeStart,
        rangeEnd,
        region,
        siteType,
        siteList,
        isHub,
        isVip
    )
};

function getPeriodOccurrences(
    rangeStart,
    rangeEnd,
    regionFilter,
    siteTypeFilter,
    siteListFilter,
    hubFilter,
    vipFilter
) {
    var DAY_MS = 24 * 60 * 60 * 1000;
    var DAILY_SERVICE =
        "/adc-service/rest/v1/services/gde_dashboard/ticket_dashboard/td_dailyReport_FWA_chunk";

    var historyCurrentMap = {};
    var output = [];
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
        chunkEnd = chunkStart + DAY_MS - 1;

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
            DAILY_SERVICE,
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
                output.push(existing);
                historyCurrentMap[entityKey] =
                    cloneOccurrenceRow(row);
            }
        }

        chunkStart = chunkEnd + 1;
    }

    for (key in historyCurrentMap) {
        if (historyCurrentMap.hasOwnProperty(key)) {
            output.push(historyCurrentMap[key]);
        }
    }

    return output;
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
    return "SITE|" +
        String(getValue(row.sitecode));
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
        existing.firstoccurrence =
            candidate.firstoccurrence;
    }

    if (candidateClear > existingClear) {
        existing.cleartime =
            candidate.cleartime;
    }

    if (candidateLast > existingLast) {
        copyRepresentativeFields(
            existing,
            candidate
        );
    }

    return existing;
}

function copyRepresentativeFields(
    target,
    source
) {
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
        diagnosesummary: row.diagnosesummary
    };
}

function parseTimestampValue(value) {
    var timestamp = parseInt(value, 10);

    if (isNaN(timestamp)) {
        return 0;
    }

    return timestamp;
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
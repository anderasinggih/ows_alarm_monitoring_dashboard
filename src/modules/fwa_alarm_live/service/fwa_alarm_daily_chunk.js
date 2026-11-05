/**
 * Sub-Service 1: fwa_alarm_daily_chunk
 * OWS Service Endpoint: /adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard/alarm_moni_fwa_alarm_daily_chunk
 * 
 * Bertugas menarik dan menggabungkan raw alarm history FWA per hari (DAY_MS)
 * untuk daftar sitecode tertentu. Setiap dipanggil via ServiceInvoker.post(),
 * kuota 20M JS command-nya selalu BERSIH (FRESH).
 */

var startTimestamp = parseInt(_message.start_timestamp, 10);
var endTimestamp = parseInt(_message.end_timestamp, 10);
var siteIds = _message.site_ids || [];

if (isNaN(startTimestamp) || isNaN(endTimestamp) || startTimestamp > endTimestamp) {
    throw new ScriptError("Invalid chunk timestamp.");
}

if (!Array.isArray(siteIds) || siteIds.length === 0) {
    return { results: [] };
}

function queryTql(tql) {
    var response = ServiceInvoker.post(
        "/adc-model/rest/v1/model-instances/query-by-tql",
        {
            start: 0,
            limit: 5000,
            tql: tql,
            query_type: "NORMAL"
        }
    );
    if (!response) return [];
    if (response.result && Array.isArray(response.result._values)) return response.result._values;
    if (response.result && Array.isArray(response.result.results)) return response.result.results;
    if (Array.isArray(response.results)) return response.results;
    if (Array.isArray(response._values)) return response._values;
    return [];
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

var allOutages = [];
var batchSize = 500;

for (var b = 0; b < siteIds.length; b += batchSize) {
    var batch = siteIds.slice(b, b + batchSize);
    var tql = "SELECT sitecode, logicsiteid, sitename, sitedownfault, firstinserttime, firstoccurrence, cleartime, active, alarmname, rawalarmname " +
        "FROM \"/AlarmBase/ICT_History_Query/ict_hq_es_history\" " +
        "WHERE (sitedownfault = '1' OR sitedownfault = 1) " +
        "AND sitecode IN (" + buildTqlList(batch) + ") " +
        "AND firstinserttime <= " + endTimestamp + " " +
        "AND (cleartime >= " + startTimestamp + " OR cleartime = 0 OR cleartime IS NULL) " +
        "ORDER BY sitecode ASC, firstoccurrence ASC";

    var rows = queryTql(tql);
    for (var i = 0; i < rows.length; i++) {
        allOutages.push(rows[i]);
    }
}

return {
    results: allOutages
};

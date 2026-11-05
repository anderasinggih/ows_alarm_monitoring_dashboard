/**
 * Sub-Service 2: fwa_alarm_ticket_enrich
 * OWS Service Endpoint: /adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard/alarm_moni_fwa_alarm_ticket_enrich
 * 
 * Bertugas menarik detail Trouble Ticket khusus untuk daftar 20 Site yang tampil di layar.
 * Memisahkan pemrosesan tiket ke sub-service ini menjamin script master TIDAK PERNAH
 * kehabisan kuota 20M JS commands karena tiket di-query terisolasi.
 */

var siteNames = _message.site_names || [];
var startTimeISO = _message.start_time_iso || "";
var endTimeISO = _message.end_time_iso || "";

if (!Array.isArray(siteNames) || siteNames.length === 0) {
    return { results: {} };
}

function queryTql(tql) {
    var response = ServiceInvoker.post(
        "/adc-model/rest/v1/model-instances/query-by-tql",
        {
            start: 0,
            limit: 1000,
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

// 1. Fetch Option Business Status Map
var bsTql = "SELECT id, optionlabel FROM \"/Bpm/msup_options/msup_options_businessstatus\"";
var bsRows = queryTql(bsTql);
var bsStatusMap = {};
for (var bs = 0; bs < bsRows.length; bs++) {
    var r = bsRows[bs];
    var id = r.id || r.ID;
    var label = r.optionlabel || r.OPTIONLABEL;
    if (id && label) {
        bsStatusMap[String(id).trim()] = String(label).trim();
    }
}

// 2. Query Trouble Ticket untuk siteNames
var timeFilter = "";
if (startTimeISO && endTimeISO) {
    timeFilter = "AND (createtime >= '" + startTimeISO + "' AND createtime <= '" + endTimeISO + "') ";
}

var ttTql = "SELECT sitename, acc_root_cause_site_name, orderidview, sourceticketid, faultno, eventno, ticketid, orderid, root_cause, rootcause, level_one_root_cause, sub_root_cause, subcause, level_two_root_cause, subsolutiontype, businessstatus, createtime " +
    "FROM \"/TroubleTicket/TroubleTicket/tt_troubleticket\" " +
    "WHERE (sitename IN (" + buildTqlList(siteNames) + ") OR acc_root_cause_site_name IN (" + buildTqlList(siteNames) + ")) " +
    timeFilter +
    "ORDER BY createtime DESC";

var ttRows = queryTql(ttTql);
var siteTicketsMap = {};

for (var i = 0; i < ttRows.length; i++) {
    var row = ttRows[i];
    var sName = String(row.sitename || row.acc_root_cause_site_name || '').trim();
    if (!sName) continue;

    var tId = String(row.orderidview || row.sourceticketid || row.faultno || row.eventno || row.ticketid || '').trim();
    if (!tId) continue;

    var rc = String(row.root_cause || row.rootcause || row.level_one_root_cause || '-').trim();
    var subRc = String(row.sub_root_cause || row.subcause || row.level_two_root_cause || row.subsolutiontype || '-').trim();
    var bsId = String(row.businessstatus || '').trim();
    var bsLabel = (bsId && bsStatusMap[bsId]) ? bsStatusMap[bsId] : '-';
    var createStr = String(row.createtime || '-').trim();

    if (!siteTicketsMap[sName]) {
        siteTicketsMap[sName] = [];
    }

    siteTicketsMap[sName].push({
        ticketId: tId,
        createtimeStr: createStr,
        rootCause: rc,
        subRootCause: subRc,
        businessstatusLabel: bsLabel
    });
}

return {
    results: siteTicketsMap
};

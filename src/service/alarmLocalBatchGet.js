function extractOWSField(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (v._value !== undefined) return extractOWSField(v._value);
    if (v.value  !== undefined) return extractOWSField(v.value);
    return String(v).trim();
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

function queryByTql(tql, parameters) {
    try {
        var request = { tql: tql };
        var response = ServiceInvoker.post(
            "/adc-model/rest/v2/model-instances/query-by-tql",
            request
        );
        if (response && Array.isArray(response.results)) {
            return response.results;
        }
        return getRows(response);
    } catch (err) {
        return [];
    }
}

var tql =
    "SELECT " +
    "  avail.batch_id, " +
    "  MIN(avail.upload_date) AS min_upload_date, " +
    "  MAX(avail.upload_date) AS max_upload_date, " +
    "  SUBSTRING(MIN(avail.upload_date), 1, 16) AS upload_minute, " +
    "  vend.vendor_name, " +
    "  MIN(avail.monitoring_date) AS min_date, " +
    "  MAX(avail.monitoring_date) AS max_date, " +
    "  COUNT(avail.site_id) AS record_cnt " +
    "FROM " +
    "  \"/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_siteavailable\" AS avail " +
    "  LEFT JOIN \"/datahub/cmdb/cmdb_site\" AS site ON avail.site_id = site.site_id " +
    "  LEFT JOIN \"/datahub/cmdb/cmdb_vendor\" AS vend ON site.vendor = vend.id " +
    "WHERE " +
    "  avail.upload_date IS NOT NULL " +
    "GROUP BY " +
    "  avail.batch_id, " +
    "  SUBSTRING(avail.upload_date, 1, 16), " +
    "  vend.vendor_name " +
    "ORDER BY " +
    "  min_upload_date DESC, " +
    "  avail.batch_id DESC " +
    "LIMIT 1000";

var rawRows = queryByTql(tql, {});

var batchMap = {};
var batchOrder = [];
var grandTotalRecords = 0;

for (var i = 0; i < rawRows.length; i++) {
    var r = rawRows[i];
    var bId    = extractOWSField(r.batch_id);
    var uMin   = extractOWSField(r.upload_minute);
    var fullUp = extractOWSField(r.min_upload_date) || uMin;
    var vName  = extractOWSField(r.vendor_name) || 'Unknown';
    var minDt  = extractOWSField(r.min_date);
    var maxDt  = extractOWSField(r.max_date);
    var recCnt = parseInt(extractOWSField(r.record_cnt), 10) || 0;

    var key = bId ? ("ID_" + bId) : ("MIN_" + uMin);
    if (!key) continue;

    if (!batchMap[key]) {
        batchMap[key] = {
            batch_key:        key,
            batch_id:         bId,
            upload_minute:    uMin || fullUp.substring(0, 16),
            full_upload_date: fullUp,
            vendorsMap:       {},
            min_date:         minDt,
            max_date:         maxDt,
            total_records:    0
        };
        batchOrder.push(key);
    }

    var entry = batchMap[key];
    entry.vendorsMap[vName] = true;
    if (minDt && (!entry.min_date || minDt < entry.min_date)) entry.min_date = minDt;
    if (maxDt && (!entry.max_date || maxDt > entry.max_date)) entry.max_date = maxDt;
    entry.total_records += recCnt;
    grandTotalRecords += recCnt;
}

var finalBatches = [];
var totalCount = batchOrder.length;

for (var k = 0; k < totalCount; k++) {
    var bKey = batchOrder[k];
    var bObj = batchMap[bKey];
    var vendorList = Object.keys(bObj.vendorsMap).sort().join(', ');
    var seqNumber  = totalCount - k;

    var displayLabel = bObj.batch_id ? ("Batch #" + bObj.batch_id) : ("Batch #" + seqNumber);

    finalBatches.push({
        batch_key:        bObj.batch_key,
        batch_id:         bObj.batch_id || bObj.upload_minute,
        seq_number:       seqNumber,
        display_label:    displayLabel,
        upload_minute:    bObj.upload_minute,
        full_upload_date: bObj.full_upload_date,
        vendors:          vendorList,
        start_date:       bObj.min_date,
        end_date:         bObj.max_date,
        total_records:    bObj.total_records
    });
}

return {
    result: {
        success: true,
        summary: {
            totalBatches: finalBatches.length,
            totalRecords: grandTotalRecords,
            latestUpload: finalBatches.length > 0 ? finalBatches[0].full_upload_date : '-'
        },
        batches: finalBatches
    }
};

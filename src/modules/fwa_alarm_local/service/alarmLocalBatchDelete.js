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

function queryAllIdsByTql(tql) {
    var allRows = [];
    var start = 0;
    var pageSize = 1000;
    var maxLimit = 50000;

    while (start < maxLimit) {
        var req = {
            tql: tql,
            start: start,
            limit: pageSize
        };
        try {
            var res = ServiceInvoker.post("/adc-model/rest/v2/model-instances/query-by-tql", req);
            var pageRows = (res && Array.isArray(res.results)) ? res.results : getRows(res);
            if (!pageRows || pageRows.length === 0) break;

            for (var p = 0; p < pageRows.length; p++) {
                allRows.push(pageRows[p]);
            }

            if (pageRows.length < pageSize) break;
            start += pageSize;
        } catch (e) {
            break;
        }
    }
    return allRows;
}

var inputObj = typeof input !== 'undefined' ? input : (typeof _message !== 'undefined' ? _message : {});
if (inputObj.body) inputObj = inputObj.body;
if (inputObj._values && Array.isArray(inputObj._values) && inputObj._values.length > 0) {
    inputObj = inputObj._values[0];
}
var reqParams = inputObj.input_params || inputObj;
var targetBatchParam = extractOWSField(reqParams.batch_id || reqParams.upload_date || (typeof batch_id !== 'undefined' ? batch_id : ''));

if (!targetBatchParam) {
    return {
        result: {
            success: false,
            message: "Parameter batch_id is required for batch delete!"
        }
    };
}

var modelPath = "/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_siteavailable";

try {
    var tql = "SELECT id FROM \"" + modelPath + "\" WHERE batch_id = '" + targetBatchParam + "'";
    var rows = queryAllIdsByTql(tql);

    if (!rows || rows.length === 0 || rows.length === 1) {
        var cleanMinute = targetBatchParam.substring(0, 16);
        if (cleanMinute.length >= 10) {
            var tqlFallback = "SELECT id FROM \"" + modelPath + "\" WHERE SUBSTRING(upload_date, 1, 16) >= '" + cleanMinute + "' AND SUBSTRING(upload_date, 1, 16) <= '" + cleanMinute + "'";
            var fallbackRows = queryAllIdsByTql(tqlFallback);
            if (fallbackRows && fallbackRows.length > rows.length) {
                rows = fallbackRows;
            }
        }
    }

    if (!rows || rows.length === 0) {
        return {
            result: {
                success: true,
                message: "No records found matching batch target: " + targetBatchParam,
                deleted_count: 0
            }
        };
    }

    var deleteItems = [];
    for (var i = 0; i < rows.length; i++) {
        var recId = extractOWSField(rows[i].id);
        if (recId) {
            deleteItems.push({ id: recId });
        }
    }

    var totalDeleted = 0;
    var chunkSize = 500;

    // Service Model Batch Delete Endpoint Bawaan OWS (Sama Persis Tadi Siang)
    var modelDeleteEndpoint = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_siteavail_batch_delete";

    for (var j = 0; j < deleteItems.length; j += chunkSize) {
        var chunk = deleteItems.slice(j, j + chunkSize);
        var deletePayload = {
            _values: chunk
        };
        ServiceInvoker.post(modelDeleteEndpoint, deletePayload);
        totalDeleted += chunk.length;
    }

    return {
        result: {
            success: true,
            message: "Successfully deleted " + totalDeleted + " records for batch " + targetBatchParam,
            deleted_count: totalDeleted
        }
    };
} catch (err) {
    return {
        result: {
            success: false,
            message: "Failed to delete data batch: " + err.toString()
        }
    };
}

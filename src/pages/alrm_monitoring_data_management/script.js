var GET_BATCHES_SERVICE = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_data_management_batch_get";
var DELETE_BATCH_SERVICE = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard_local/alarmlocal_data_management_batch_delete";

var PendingDeleteBatch = null;

function renderHeaderControls() {
    var placeholder = document.getElementById('mgmtRefreshBtnPlaceholder');
    if (!placeholder || document.getElementById('mgmtRefreshBtn')) return;

    placeholder.innerHTML = '<button id="mgmtRefreshBtn" class="custom-mgmt-btn-refresh">Refresh List</button>';
    document.getElementById('mgmtRefreshBtn').addEventListener('click', fetchBatchData);
}

function renderKPI(summary) {
    var statBatches = document.getElementById('mgmtStatTotalBatches');
    var statRecords = document.getElementById('mgmtStatTotalRecords');
    var statLatest  = document.getElementById('mgmtStatLatestUpload');

    if (statBatches) statBatches.innerText = summary.totalBatches || 0;
    if (statRecords) statRecords.innerText = (summary.totalRecords || 0).toLocaleString();
    if (statLatest)  statLatest.innerText  = summary.latestUpload || '-';
}

function renderBatchTable(batches) {
    var container = document.getElementById('mgmtTableContainer');
    if (!container) return;

    if (!batches || batches.length === 0) {
        container.innerHTML = '<div style="color: #a1a1aa; padding: 36px; text-align: center;">No import batch history found.</div>';
        return;
    }

    var rowsHtml = '';
    for (var i = 0; i < batches.length; i++) {
        var b = batches[i];
        var no = i + 1;
        var dateRangeStr = (b.start_date && b.end_date) 
            ? ('<span style="color: #34d399; font-weight: 500;">' + b.start_date + '</span> <span style="color: #71717a;">—</span> <span style="color: #34d399; font-weight: 500;">' + b.end_date + '</span>')
            : '-';

        var batchParam = b.batch_id || b.upload_minute;
        var badgeText  = b.display_label || (b.batch_id ? ('Batch #' + b.batch_id) : 'Batch');
        var batchBadgeHtml = '<span class="custom-mgmt-badge-batch" style="background: rgba(16, 185, 129, 0.15); color: #34d399; border-color: rgba(16, 185, 129, 0.3);">' + badgeText + '</span>';

        rowsHtml +=
            '<tr>' +
            '<td style="color: #71717a; font-weight: 500;">' + no + '</td>' +
            '<td>' + batchBadgeHtml + '</td>' +
            '<td style="color: #a1a1aa; font-family: monospace;">' + (b.upload_minute || b.full_upload_date || '-') + '</td>' +
            '<td><span class="custom-mgmt-badge-vendor">' + (b.vendors || '-') + '</span></td>' +
            '<td>' + dateRangeStr + '</td>' +
            '<td style="font-weight: 600; color: #f4f4f5;">' + (b.total_records || 0).toLocaleString() + ' sites</td>' +
            '<td><span class="custom-mgmt-badge-active">Active</span></td>' +
            '<td>' +
            '  <button class="custom-mgmt-btn-danger custom-mgmt-delete-btn" data-batch-id="' + batchParam + '" data-records="' + b.total_records + '" data-label="' + badgeText + '">' +
            '    Delete' +
            '  </button>' +
            '</td>' +
            '</tr>';
    }

    container.innerHTML =
        '<table class="custom-mgmt-table">' +
        '  <thead><tr>' +
        '    <th>NO</th><th>BATCH ID</th><th>UPLOAD TIME</th><th>VENDOR(S)</th>' +
        '    <th>MONITORING RANGE</th><th>TOTAL RECORDS</th><th>STATUS</th><th>ACTION</th>' +
        '  </tr></thead>' +
        '  <tbody>' + rowsHtml + '</tbody>' +
        '</table>';

    var deleteBtns = container.querySelectorAll('.custom-mgmt-delete-btn');
    for (var d = 0; d < deleteBtns.length; d++) {
        deleteBtns[d].addEventListener('click', function () {
            var batchId  = this.getAttribute('data-batch-id');
            var recCount = this.getAttribute('data-records');
            var label    = this.getAttribute('data-label');
            openDeleteModal(batchId, recCount, label);
        });
    }
}

function openDeleteModal(batchId, recCount, label) {
    PendingDeleteBatch = batchId;
    var modalContainer = document.getElementById('customMgmtDeleteModal');
    if (!modalContainer) return;

    var displayTitle = label || ('Batch #' + batchId);

    var modalHtml =
        '<div class="custom-mgmt-modal-card">' +
        '  <h3 class="custom-mgmt-modal-title">Delete Upload Batch?</h3>' +
        '  <div class="custom-mgmt-modal-body">' +
        '    Are you sure you want to permanently delete all availability data for <strong style="color: #34d399; font-family: monospace;">' + displayTitle + '</strong> (' + recCount + ' records)?<br/><br/>' +
        '    <span style="color: #f87171;">Warning: This action cannot be undone!</span>' +
        '  </div>' +
        '  <div class="custom-mgmt-modal-footer">' +
        '    <button id="mgmtCancelDeleteBtn" class="custom-mgmt-btn-refresh">Cancel</button>' +
        '    <button id="mgmtConfirmDeleteBtn" class="custom-mgmt-btn-danger">Yes, Delete Batch</button>' +
        '  </div>' +
        '</div>';

    modalContainer.innerHTML = modalHtml;
    modalContainer.style.setProperty('display', 'flex', 'important');

    var cancelBtn  = document.getElementById('mgmtCancelDeleteBtn');
    var confirmBtn = document.getElementById('mgmtConfirmDeleteBtn');

    if (cancelBtn)  cancelBtn.addEventListener('click', closeDeleteModal);
    if (confirmBtn) confirmBtn.addEventListener('click', executeDeleteBatch);
}

function closeDeleteModal() {
    PendingDeleteBatch = null;
    var modalContainer = document.getElementById('customMgmtDeleteModal');
    if (modalContainer) {
        modalContainer.style.setProperty('display', 'none', 'important');
    }
}

function executeDeleteBatch() {
    if (!PendingDeleteBatch) return;

    var container = document.getElementById('mgmtTableContainer');
    if (container) container.innerHTML = '<div style="color: #f87171; padding: 36px; text-align: center;">Deleting batch data...</div>';

    var targetBatch = PendingDeleteBatch;
    closeDeleteModal();

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        alert('[OWS Error] MessageProcessor API not available.');
        fetchBatchData();
        return;
    }

    MessageProcessor.process({
        serviceId: DELETE_BATCH_SERVICE,
        data: {
            batch_id: targetBatch,
            upload_date: targetBatch
        },
        success: function (res) {
            console.log('[OWS Batch Delete Raw Res]:', res);
            var resultData = res;
            if (res && res.result) {
                resultData = res.result.result ? res.result.result : res.result;
            } else if (res && res.data) {
                resultData = res.data;
            }
            if (resultData && resultData.result) {
                resultData = resultData.result;
            }

            console.log('[OWS Batch Delete Unwrapped Result]:', resultData);

            if (resultData && resultData.success === false) {
                alert('Delete Failed: ' + (resultData.message || 'Unknown error'));
            } else {
                console.log('[OWS Batch Delete Logs]:', resultData ? resultData.logs : []);
                console.log('[OWS Batch Delete HTTP Responses]:', resultData ? resultData.http_responses : []);
            }
            fetchBatchData();
        },
        error: function (err) {
            alert('Failed to delete batch: ' + (err.message || 'Network error'));
            fetchBatchData();
        }
    });
}

function fetchBatchData() {
    var container = document.getElementById('mgmtTableContainer');
    if (container) container.innerHTML = '<div style="color: #a1a1aa; padding: 36px; text-align: center;">Loading batch upload history...</div>';

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        if (container) container.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">[OWS Error] MessageProcessor runtime API not found.</div>';
        return;
    }

    MessageProcessor.process({
        serviceId: GET_BATCHES_SERVICE,
        data: {},
        success: function (res) {
            var resultData = res;
            if (res && res.result) {
                resultData = res.result.result ? res.result.result : res.result;
            } else if (res && res.data) {
                resultData = res.data;
            }

            if (!resultData) return;

            if (resultData.summary) {
                renderKPI(resultData.summary);
            }
            renderBatchTable(resultData.batches || []);
        },
        error: function (err) {
            if (container) container.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">Failed to load batch history from OWS service.</div>';
        }
    });
}

function initManagementPage() {
    renderHeaderControls();
    fetchBatchData();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initManagementPage, 1);
} else {
    document.addEventListener('DOMContentLoaded', initManagementPage);
}

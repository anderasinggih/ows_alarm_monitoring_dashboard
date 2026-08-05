/**
 * Huawei OWS Alarm Monitoring Dashboard - Pure UI Presenter (script.js)
 * Features:
 * - 100% Dynamic UI Element Injection (Filter Panel & View Toggle Buttons)
 * - Default Page Size: 50 rows per page
 * - Dynamic View Switcher: List View & Grid View (Matches Reference Screenshot)
 * - Robust Lifecycle Initialization
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
                console.warn('[OWS Safe JSON.parse] Prevented crash on invalid JSON input:', text);
                return null;
            }
        };
    }
})();

// OWS Service Endpoint Path
var SERVICE_ENDPOINT = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard/alarm_moni_alarmget";

function formatYYYYMMDD(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var dd = String(d.getDate());
    if (dd.length < 2) dd = "0" + dd;
    return yyyy + "-" + mm + "-" + dd;
}

function getDefaultDates() {
    var e = new Date();
    var s = new Date(e.getTime() - (7 * 24 * 60 * 60 * 1000));
    return {
        startDate: formatYYYYMMDD(s),
        endDate: formatYYYYMMDD(e)
    };
}

function getLast24HoursDates() {
    var e = new Date();
    var s = new Date(e.getTime() - (24 * 60 * 60 * 1000));
    return {
        startDate: formatYYYYMMDD(s),
        endDate: formatYYYYMMDD(e)
    };
}

var initialDates = getDefaultDates();

// Global Dashboard State (Default Rows per Page = 50)
var DashboardState = {
    loading: false,
    viewMode: 'list', // 'list' or 'grid'
    isLast24hMode: true, // DEFAULT ROLLING 24 HOURS MODE
    allSites: [],
    filteredSites: [],
    searchQuery: '',
    searchDebounceTimeout: null,
    startDate: initialDates.startDate,
    endDate: initialDates.endDate,
    pagination: {
        currentPage: 1,
        pageSize: 50 // DEFAULT ROWS PER PAGE IS 50
    },
    summary: {
        totalAlarmsDown: 0,
        sitesAffected: 0,
        avgAvailabilityPct: "100.0",
        mostAffectedSite: "-",
        mostAffectedSiteDowntime: "0m"
    }
};

// Helper to calculate active date label
function getActiveFilterLabel() {
    if (DashboardState.isLast24hMode) {
        return "Active: Last 24 Hours (Rolling)";
    }
    var s = DashboardState.startDate;
    var e = DashboardState.endDate;
    var def = getDefaultDates();

    if (s === def.startDate && e === def.endDate) {
        return "Active: Last 7 Days";
    } else if (s && e) {
        return "Active: " + s + " – " + e;
    }
    return "Active: Custom Range";
}

// Inject Filter Card Panel & View Toggle Buttons via JS (Bypasses OWS HTML Sanitizer)
function renderFilterPanel() {
    var filterPlaceholder = document.getElementById('customFilterPanelPlaceholder');
    if (filterPlaceholder && !document.getElementById('customStartDateInput')) {
        var html = '' +
            '<div class="custom-filter-card">' +
            '  <div class="custom-filter-title-row">' +
            '    <div class="custom-filter-title">Date Range Filter</div>' +
            '    <div id="customActiveFilterBadge" class="custom-active-filter-badge">' + getActiveFilterLabel() + '</div>' +
            '  </div>' +
            '  <div class="custom-filter-row">' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Start Date</span>' +
            '      <input type="date" id="customStartDateInput" class="custom-date-input" value="' + DashboardState.startDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">End Date</span>' +
            '      <input type="date" id="customEndDateInput" class="custom-date-input" value="' + DashboardState.endDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-actions">' +
            '      <button id="customQuick24hBtn" class="custom-btn-quick24" title="Quick Filter Rolling Last 24 Hours">Last 24h</button>' +
            '      <button id="customApplyDateBtn" class="custom-btn-apply">Apply Filter</button>' +
            '      <button id="customResetDateBtn" class="custom-btn-reset">Reset (7D)</button>' +
            '    </div>' +
            '    <div class="custom-search-container">' +
            '      <input type="text" id="customSearchInput" class="custom-search-input" placeholder="Search site name..." />' +
            '    </div>' +
            '  </div>' +
            '</div>';

        filterPlaceholder.innerHTML = html;

        function updateActiveBadge() {
            var b = document.getElementById('customActiveFilterBadge');
            if (b) b.innerText = getActiveFilterLabel();
        }

        var applyBtn = document.getElementById('customApplyDateBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', function () {
                var sVal = document.getElementById('customStartDateInput')?.value;
                var eVal = document.getElementById('customEndDateInput')?.value;

                if (sVal && eVal) {
                    if (sVal > eVal) {
                        alert('Start Date cannot be greater than End Date!');
                        return;
                    }
                    DashboardState.isLast24hMode = false;
                    DashboardState.startDate = sVal;
                    DashboardState.endDate = eVal;
                    DashboardState.pagination.currentPage = 1;
                    updateActiveBadge();
                    fetchDashboardData();
                }
            });
        }

        var quick24Btn = document.getElementById('customQuick24hBtn');
        if (quick24Btn) {
            quick24Btn.addEventListener('click', function () {
                DashboardState.isLast24hMode = true;
                var q24 = getLast24HoursDates();
                DashboardState.startDate = q24.startDate;
                DashboardState.endDate = q24.endDate;
                DashboardState.pagination.currentPage = 1;

                var sInput = document.getElementById('customStartDateInput');
                var eInput = document.getElementById('customEndDateInput');
                if (sInput) sInput.value = q24.startDate;
                if (eInput) eInput.value = q24.endDate;

                updateActiveBadge();
                fetchDashboardData();
            });
        }

        var resetBtn = document.getElementById('customResetDateBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                DashboardState.isLast24hMode = false;
                var def = getDefaultDates();
                DashboardState.startDate = def.startDate;
                DashboardState.endDate = def.endDate;
                DashboardState.searchQuery = '';
                DashboardState.pagination.currentPage = 1;

                var sInput = document.getElementById('customStartDateInput');
                var eInput = document.getElementById('customEndDateInput');
                if (sInput) sInput.value = def.startDate;
                if (eInput) eInput.value = def.endDate;

                var searchInput = document.getElementById('customSearchInput');
                if (searchInput) searchInput.value = '';

                updateActiveBadge();
                fetchDashboardData();
            });
        }

        var searchInput = document.getElementById('customSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function (e) {
                var val = e.target.value;
                clearTimeout(DashboardState.searchDebounceTimeout);
                DashboardState.searchDebounceTimeout = setTimeout(function () {
                    DashboardState.searchQuery = val;
                    DashboardState.pagination.currentPage = 1;
                    applySearchFilter();
                }, 300);
            });
        }
    }

    // Dynamic Injection for Panel Header (Grid / List Buttons)
    var headerPlaceholder = document.getElementById('customPanelHeaderPlaceholder');
    if (headerPlaceholder && !document.getElementById('customGridViewBtn')) {
        var headerHtml = '' +
            '<div>' +
            '  <span>ALARMS DOWN BY SITE <span style="font-size: 11px; font-weight: normal; color: #a1a1aa;">(Sorted by Latest Occur Time)</span></span>' +
            '</div>' +
            '<div class="custom-view-toggle-group">' +
            '  <button id="customGridViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'grid' ? 'custom-active' : '') + '">Grid</button>' +
            '  <button id="customListViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'list' ? 'custom-active' : '') + '">List</button>' +
            '</div>';

        headerPlaceholder.innerHTML = headerHtml;

        var gridBtn = document.getElementById('customGridViewBtn');
        var listBtn = document.getElementById('customListViewBtn');

        if (gridBtn && listBtn) {
            gridBtn.onclick = function () {
                DashboardState.viewMode = 'grid';
                gridBtn.classList.add('custom-active');
                listBtn.classList.remove('custom-active');
                renderTable();
            };

            listBtn.onclick = function () {
                DashboardState.viewMode = 'list';
                listBtn.classList.add('custom-active');
                gridBtn.classList.remove('custom-active');
                renderTable();
            };
        }
    }

    return true;
}

// Fetch Data from OWS Service
function fetchDashboardData() {
    // If Last 24h mode is active, recalculate rolling date timestamps on every refresh
    if (DashboardState.isLast24hMode) {
        var q24 = getLast24HoursDates();
        DashboardState.startDate = q24.startDate;
        DashboardState.endDate = q24.endDate;

        var sInput = document.getElementById('customStartDateInput');
        var eInput = document.getElementById('customEndDateInput');
        if (sInput) sInput.value = q24.startDate;
        if (eInput) eInput.value = q24.endDate;

        var b = document.getElementById('customActiveFilterBadge');
        if (b) b.innerText = getActiveFilterLabel();
    }
    var tableContainer = document.getElementById('alarmTableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = '<div style="color: #a1a1aa; padding: 24px; text-align: center;">Loading data from OWS...</div>';
    }

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        console.error('[OWS Error] MessageProcessor.process API runtime not found.');
        if (tableContainer) {
            tableContainer.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">[OWS Error] MessageProcessor runtime error.</div>';
        }
        return;
    }

    MessageProcessor.process({
        serviceId: SERVICE_ENDPOINT,
        data: {
            startDate: DashboardState.startDate,
            endDate: DashboardState.endDate
        },
        success: function (res) {
            try {
                var resObj = typeof res === 'string' ? JSON.parse(res) : res;
                var resultData = (resObj && resObj.result) || (resObj && resObj.data) || resObj;

                if (resultData && resultData.summary) {
                    DashboardState.summary = resultData.summary;
                    DashboardState.allSites = resultData.sites || [];
                    DashboardState.filteredSites = DashboardState.allSites;

                    renderKPIStats();
                    renderTable();
                } else {
                    if (tableContainer) {
                        tableContainer.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">Failed to load data. OWS payload empty.</div>';
                    }
                }
            } catch (e) {
                console.error('[OWS Error] Parse Exception:', e);
            }
        },
        error: function (err) {
            console.error('[OWS Service Error]:', err);
            if (tableContainer) {
                tableContainer.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">Failed to load data from OWS service.</div>';
            }
        }
    });
}

// Render KPI Stat Cards
function renderKPIStats() {
    var statTotal = document.getElementById('statTotalAlarms');
    var statSites = document.getElementById('statSitesAffected');
    var statAvail = document.getElementById('statAvgAvail');
    var statMost = document.getElementById('statMostAffected');

    if (statTotal) statTotal.innerText = DashboardState.summary.totalAlarmsDown || 0;
    if (statSites) statSites.innerText = DashboardState.summary.sitesAffected || 0;
    if (statAvail) statAvail.innerText = (DashboardState.summary.avgAvailabilityPct || "100.0") + "%";
    if (statMost) statMost.innerText = DashboardState.summary.mostAffectedSite || "-";
}

// Client-Side Search Filter
function applySearchFilter() {
    var q = (DashboardState.searchQuery || '').toLowerCase().trim();
    if (!q) {
        DashboardState.filteredSites = DashboardState.allSites;
    } else {
        DashboardState.filteredSites = DashboardState.allSites.filter(function (item) {
            return (item.siteName || '').toLowerCase().indexOf(q) !== -1;
        });
    }
    renderTable();
}

// Render Table (Supports both List View & Grid View Modes)
function renderTable() {
    var tableContainer = document.getElementById('alarmTableContainer');
    if (!tableContainer) return;

    var list = DashboardState.filteredSites;
    if (!list || list.length === 0) {
        tableContainer.innerHTML = '' +
            '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #27272a; background: #18181b;">' +
            '  <span style="font-size: 13px; font-weight: 600; color: #f4f4f5;">ALARMS DOWN BY SITE <span style="font-size: 11px; font-weight: normal; color: #a1a1aa;">(Sorted by Latest Occur Time)</span></span>' +
            '  <div class="custom-view-toggle-group">' +
            '    <button id="customGridViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'grid' ? 'custom-active' : '') + '">Grid</button>' +
            '    <button id="customListViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'list' ? 'custom-active' : '') + '">List</button>' +
            '  </div>' +
            '</div>' +
            '<div style="color: #a1a1aa; padding: 24px; text-align: center;">No site or alarm data found.</div>';

        attachViewToggleListeners();
        return;
    }

    var pag = DashboardState.pagination;
    var totalItems = list.length;
    var totalPages = Math.ceil(totalItems / pag.pageSize) || 1;

    if (pag.currentPage > totalPages) pag.currentPage = totalPages;
    if (pag.currentPage < 1) pag.currentPage = 1;

    var startIdx = (pag.currentPage - 1) * pag.pageSize;
    var endIdx = Math.min(startIdx + pag.pageSize, totalItems);
    var pageItems = list.slice(startIdx, endIdx);

    var html = '' +
        '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #27272a; background: #18181b;">' +
        '  <span style="font-size: 13px; font-weight: 600; color: #f4f4f5;">ALARMS DOWN BY SITE <span style="font-size: 11px; font-weight: normal; color: #a1a1aa;">(Sorted by Latest Occur Time)</span></span>' +
        '  <div class="custom-view-toggle-group">' +
        '    <button id="customGridViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'grid' ? 'custom-active' : '') + '">Grid</button>' +
        '    <button id="customListViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'list' ? 'custom-active' : '') + '">List</button>' +
        '  </div>' +
        '</div>';

    if (DashboardState.viewMode === 'grid') {
        // RENDER GRID VIEW CARDS
        html += '<div class="custom-sites-grid-container">';
        for (var g = 0; g < pageItems.length; g++) {
            var gSite = pageItems[g];
            var gPct = gSite.availRatePct || "100.0";
            var gGlobalIndex = startIdx + g;

            html += '' +
                '<div class="custom-site-grid-card custom-table-row" data-site-index="' + gGlobalIndex + '">' +
                '  <div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
                '    <div>' +
                '      <div style="font-size: 16px; font-weight: 700; color: #f4f4f5;">' + gSite.siteName + '</div>' +
                '      <div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">' + (gSite.totalAlarms || 0) + ' alarms down</div>' +
                '    </div>' +
                '    <div style="font-size: 16px; font-weight: 700; color: #ffffff; background: #27272a; padding: 2px 8px; border-radius: 4px;">' + gPct + '%</div>' +
                '  </div>' +
                '  <div style="margin-top: 14px;">' +
                '    <div class="custom-avail-bar-wrapper"><div class="custom-avail-bar-inner" style="width: ' + gPct + '%;"></div></div>' +
                '  </div>' +
                '  <div style="display: flex; justify-content: space-between; margin-top: 14px; font-size: 12px;">' +
                '    <div><span style="color: #a1a1aa;">Down:</span> <b style="color: #ef4444;">' + (gSite.downtimeFormatted || '0m') + '</b></div>' +
                '    <div><span style="color: #a1a1aa;">Avail:</span> <b style="color: #10b981;">' + (gSite.availableFormatted || '0m') + '</b></div>' +
                '  </div>' +
                '</div>';
        }
        html += '</div>';
    } else {
        // RENDER LIST VIEW TABLE
        html += '' +
            '<table class="custom-table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th style="width: 50px; text-align: center;">NO</th>' +
            '      <th>SITE NAME</th>' +
            '      <th>UPTIME</th>' +
            '      <th>DOWNTIME</th>' +
            '      <th>AVAILABLE</th>' +
            '      <th>AVAIL RATE %</th>' +
            '      <th>LAST OCCURRENCE</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>';

        for (var i = 0; i < pageItems.length; i++) {
            var site = pageItems[i];
            var pct = site.availRatePct || "100.0";
            var rowNo = startIdx + i + 1;
            var globalIndex = startIdx + i;

            html += '' +
                '<tr class="custom-table-row" data-site-index="' + globalIndex + '" style="cursor: pointer;">' +
                '  <td style="text-align: center; color: #71717a; font-weight: 600;">' + rowNo + '</td>' +
                '  <td>' +
                '    <div style="font-weight: 600; color: #f4f4f5;">' + site.siteName + '</div>' +
                '    <div style="font-size: 11px; color: #a1a1aa;">' + (site.totalAlarms || 0) + ' alarms</div>' +
                '  </td>' +
                '  <td style="min-width: 160px;">' +
                '    <div class="custom-avail-bar-wrapper">' +
                '      <div class="custom-avail-bar-inner" style="width: ' + pct + '%;"></div>' +
                '    </div>' +
                '  </td>' +
                '  <td style="color: #ef4444; font-weight: 600;">' + (site.downtimeFormatted || '0m') + '</td>' +
                '  <td style="color: #10b981; font-weight: 600;">' + (site.availableFormatted || '0m') + '</td>' +
                '  <td style="font-weight: 600;">' + pct + '%</td>' +
                '  <td style="color: #a1a1aa;">' + (site.lastOccurrenceStr || '-') + '</td>' +
                '</tr>';
        }

        html += '  </tbody></table>';
    }

    // RENDER AUTO PAGINATION CONTROLS
    html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #18181b; border-top: 1px solid #27272a; font-size: 12px; color: #a1a1aa;">';
    html += '  <div>Total <b style="color: #f4f4f5;">' + totalItems + '</b> sites | Page <b style="color: #f4f4f5;">' + pag.currentPage + '</b> of <b style="color: #f4f4f5;">' + totalPages + '</b></div>';

    html += '  <div style="display: flex; gap: 8px; align-items: center;">';
    html += '    <label>Rows per page:</label>';
    html += '    <select id="customPageSizeSelect" style="background: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 6px; padding: 4px 8px; outline: none; cursor: pointer;">';
    [10, 20, 50, 100].forEach(function (size) {
        var sel = pag.pageSize === size ? 'selected' : '';
        html += '      <option value="' + size + '" ' + sel + '>' + size + '</option>';
    });
    html += '    </select>';

    var prevDisabledStr = pag.currentPage === 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : 'style="cursor:pointer;"';
    var nextDisabledStr = pag.currentPage === totalPages ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : 'style="cursor:pointer;"';

    html += '    <button id="customPrevPageBtn" ' + prevDisabledStr + ' style="background: #09090b; color: #f4f4f5; border: 1px solid #27272a; padding: 4px 10px; border-radius: 6px; font-weight: 600;">&lt; Prev</button>';
    html += '    <button id="customNextPageBtn" ' + nextDisabledStr + ' style="background: #09090b; color: #f4f4f5; border: 1px solid #27272a; padding: 4px 10px; border-radius: 6px; font-weight: 600;">Next &gt;</button>';
    html += '  </div>';
    html += '</div>';

    tableContainer.innerHTML = html;

    attachViewToggleListeners();

    // Attach Row / Grid Click Event Listener for Site Detail Modal
    var clickables = tableContainer.querySelectorAll('.custom-table-row');
    clickables.forEach(function (item) {
        item.addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-site-index'), 10);
            if (!isNaN(idx) && DashboardState.filteredSites[idx]) {
                openSiteDetailModal(DashboardState.filteredSites[idx]);
            }
        });
    });

    // Attach Pagination Event Listeners
    var sizeSelect = document.getElementById('customPageSizeSelect');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function () {
            pag.pageSize = parseInt(this.value, 10) || 50;
            pag.currentPage = 1;
            renderTable();
        });
    }

    var prevBtn = document.getElementById('customPrevPageBtn');
    if (prevBtn && pag.currentPage > 1) {
        prevBtn.addEventListener('click', function () {
            pag.currentPage--;
            renderTable();
        });
    }

    var nextBtn = document.getElementById('customNextPageBtn');
    if (nextBtn && pag.currentPage < totalPages) {
        nextBtn.addEventListener('click', function () {
            pag.currentPage++;
            renderTable();
        });
    }
}

function attachViewToggleListeners() {
    var gridBtn = document.getElementById('customGridViewBtn');
    var listBtn = document.getElementById('customListViewBtn');

    if (gridBtn && listBtn) {
        gridBtn.onclick = function () {
            DashboardState.viewMode = 'grid';
            renderTable();
        };

        listBtn.onclick = function () {
            DashboardState.viewMode = 'list';
            renderTable();
        };
    }
}

/**
 * Open Site Detail Drilldown Modal
 */
function openSiteDetailModal(siteData) {
    var modalContainer = document.getElementById('customSiteDetailModal');
    if (!modalContainer) return;

    var alarmsList = siteData.alarms || [];

    var modalHtml = '' +
        '<div class="custom-modal-dialog">' +
        '  <div class="custom-modal-header">' +
        '    <div>' +
        '      <div class="custom-modal-subtitle">Site detail</div>' +
        '      <div class="custom-modal-title">' + siteData.siteName + '</div>' +
        '      <div class="custom-modal-date">' + DashboardState.startDate + ' – ' + DashboardState.endDate + '</div>' +
        '    </div>' +
        '    <button id="customCloseModalBtn" class="custom-modal-close-btn">X</button>' +
        '  </div>' +
        '' +
        '  <div class="custom-modal-metrics">' +
        '    <div>' +
        '      <div class="custom-metric-label">Downtime</div>' +
        '      <div class="custom-metric-val-danger">' + (siteData.downtimeFormatted || '0m') + '</div>' +
        '    </div>' +
        '    <div>' +
        '      <div class="custom-metric-label">Available</div>' +
        '      <div class="custom-metric-val-success">' + (siteData.availableFormatted || '0m') + '</div>' +
        '    </div>' +
        '    <div>' +
        '      <div class="custom-metric-label">Availability</div>' +
        '      <div class="custom-metric-val-white">' + (siteData.availRatePct || '100.0') + '%</div>' +
        '    </div>' +
        '  </div>' +
        '' +
        '  <div class="custom-modal-table-container">' +
        '    <table class="custom-table">' +
        '      <thead>' +
        '        <tr>' +
        '          <th>ALARM</th>' +
        '          <th style="text-align: center;">OCCUR</th>' +
        '          <th style="text-align: center;">CLEAR</th>' +
        '          <th style="text-align: right;">DURATION</th>' +
        '        </tr>' +
        '      </thead>' +
        '      <tbody>';

    if (alarmsList.length === 0) {
        modalHtml += '<tr><td colspan="4" style="text-align: center; color: #71717a; padding: 16px;">No alarm details available.</td></tr>';
    } else {
        for (var a = 0; a < alarmsList.length; a++) {
            var alarm = alarmsList[a];
            modalHtml += '' +
                '<tr>' +
                '  <td style="color: #f4f4f5; font-weight: 500;">' + alarm.alarmName + '</td>' +
                '  <td style="text-align: center; color: #a1a1aa;">' + alarm.occurStr + '</td>' +
                '  <td style="text-align: center; color: #a1a1aa;">' + alarm.clearStr + '</td>' +
                '  <td style="text-align: right; color: #f4f4f5; font-weight: 700;">' + alarm.durationFormatted + '</td>' +
                '</tr>';
        }
    }

    modalHtml += '' +
        '      </tbody>' +
        '    </table>' +
        '  </div>' +
        '' +
        '  <div class="custom-modal-footer">' +
        '    <div>Showing ' + alarmsList.length + ' of ' + alarmsList.length + ' alarms</div>' +
        '    <button id="customCloseModalBtnBottom" class="custom-btn-reset">Close</button>' +
        '  </div>' +
        '</div>';

    modalContainer.innerHTML = modalHtml;
    modalContainer.style.display = 'flex';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100vw';
    modalContainer.style.height = '100vh';
    modalContainer.style.zIndex = '999999';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';

    // Attach Close Button Listeners
    var closeBtn = document.getElementById('customCloseModalBtn');
    var closeBtnBottom = document.getElementById('customCloseModalBtnBottom');

    function closeModal() {
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', function (e) {
        if (e.target === modalContainer) closeModal();
    });
}

// ROBUST LIFECYCLE INITIALIZER FOR OWS RUN & PREVIEWER MODE
(function initDashboardLifecycle() {
    function tryInit() {
        var rendered = renderFilterPanel();
        if (rendered) {
            fetchDashboardData();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

    // Fallback retries for OWS iframe delay in RUN Mode
    setTimeout(tryInit, 50);
    setTimeout(tryInit, 300);
    setTimeout(tryInit, 1000);
})();

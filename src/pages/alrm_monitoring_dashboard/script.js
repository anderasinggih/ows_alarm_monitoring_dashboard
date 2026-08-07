/**
 * Huawei OWS Alarm Monitoring Dashboard - Pure UI Presenter (script.js)
 */



// OWS Service Endpoint - Summary only (KPI cards)
var SERVICE_ENDPOINT = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard/alarm_moni_alarmget";
// OWS Service Endpoint - Paginated site list (table)
var SERVICE_ENDPOINT_LIST = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard/alarm_moni_alarmbysite";

function formatDateTimeLocal(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var dd = String(d.getDate());
    if (dd.length < 2) dd = "0" + dd;
    var hh = String(d.getHours());
    if (hh.length < 2) hh = "0" + hh;
    var mi = String(d.getMinutes());
    if (mi.length < 2) mi = "0" + mi;
    return yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + mi;
}

function getDefaultDates() {
    var e = new Date();
    var s = new Date(e.getTime() - (7 * 24 * 60 * 60 * 1000));
    return {
        startDate: formatDateTimeLocal(s),
        endDate: formatDateTimeLocal(e)
    };
}

function getTodayDates() {
    var now = new Date();
    var startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    var endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return {
        startDate: formatDateTimeLocal(startToday),
        endDate: formatDateTimeLocal(endToday)
    };
}

var initialDates = getDefaultDates();

// Global Dashboard State (Default Rows per Page = 50)
// Global Dashboard State (Default Rows per Page = 50)
var DashboardState = {
    loading: false,
    viewMode: 'list', // 'list' or 'grid'
    isTodayMode: true, // DEFAULT TODAY MODE (00:00 - Current Time)
    isAllTimeMode: false,
    allSites: [],
    filteredSites: [],
    searchQuery: '',
    selectedRegion: '',
    selectedVendor: '',
    kpiFilterMode: '', // '', 'active_down', 'sites_affected'
    searchDebounceTimeout: null,
    startDate: getTodayDates().startDate,
    endDate: getTodayDates().endDate,
    pagination: {
        currentPage: 1,
        pageSize: 20, // server-side page size
        totalSites: 0,
        totalPages: 1
    },
    summary: {
        totalAlarmsDown: 0,
        sitesAffected: 0,
        activeDownSites: 0,
        avgAvailabilityPct: "100.0",
        mostAffectedSite: "-",
        mostAffectedSiteDowntime: "0m"
    }
};

// Helper to calculate active date label
// Helper to calculate active filter badges HTML
function getActiveFilterLabel() {
    var html = '';
    
    // 1. Date Range Badge
    var dateLabel = '';
    if (DashboardState.isTodayMode) {
        dateLabel = "Active: Today (00:00 – Now)";
    } else if (DashboardState.isAllTimeMode) {
        dateLabel = "Active: All Time (Live & History)";
    } else if (DashboardState.startDate && DashboardState.endDate) {
        dateLabel = "Active: " + DashboardState.startDate.replace("T", " ") + " – " + DashboardState.endDate.replace("T", " ");
    } else {
        dateLabel = "Active: Custom Range";
    }
    html += '<span class="custom-active-filter-badge">' + dateLabel + '</span>';

    // 2. Region Badge
    if (DashboardState.selectedRegion) {
        html += '<span class="custom-active-filter-badge">Region: ' + DashboardState.selectedRegion + '</span>';
    }

    // 3. Vendor Badge
    if (DashboardState.selectedVendor) {
        html += '<span class="custom-active-filter-badge">Vendor: ' + DashboardState.selectedVendor + '</span>';
    }

    // 4. Search Query Badge
    if (DashboardState.searchQuery) {
        html += '<span class="custom-active-filter-badge">Search: "' + DashboardState.searchQuery + '"</span>';
    }

    // 5. KPI Filter Mode Badge
    if (DashboardState.kpiFilterMode === 'active_down') {
        html += '<span class="custom-active-filter-badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border-color: rgba(239, 68, 68, 0.3);">Filter: Active Down Only</span>';
    } else if (DashboardState.kpiFilterMode === 'sites_affected') {
        html += '<span class="custom-active-filter-badge" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border-color: rgba(245, 158, 11, 0.3);">Filter: Sites Affected (All Downtime)</span>';
    }

    return html;
}

function updateActiveBadge() {
    var b = document.getElementById('customActiveFilterBadge');
    if (b) b.innerHTML = getActiveFilterLabel();
}

// Inject Filter Card Panel & View Toggle Buttons via JS (Bypasses OWS HTML Sanitizer)
function renderFilterPanel() {
    var filterPlaceholder = document.getElementById('customFilterPanelPlaceholder');
    if (filterPlaceholder && !document.getElementById('customStartDateInput')) {
        var html = '' +
            '<div class="custom-filter-card">' +
            '  <div class="custom-filter-title-row">' +
            '    <div class="custom-filter-title">Date & Time Range Filter</div>' +
            '    <div id="customActiveFilterBadge" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">' + getActiveFilterLabel() + '</div>' +
            '  </div>' +
            '  <div class="custom-filter-row" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end;">' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Start Date & Time</span>' +
            '      <input type="datetime-local" id="customStartDateInput" class="custom-date-input" value="' + DashboardState.startDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">End Date & Time</span>' +
            '      <input type="datetime-local" id="customEndDateInput" class="custom-date-input" value="' + DashboardState.endDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-actions">' +
            '      <button id="customApplyDateBtn" class="custom-btn-apply">Apply Filter</button>' +
            '      <button id="customResetDateBtn" class="custom-btn-reset">Reset</button>' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Region</span>' +
            '      <select id="customRegionSelect" class="custom-date-input" style="min-width: 130px; cursor: pointer;">' +
            '        <option value="">All Regions</option>' +
            '      </select>' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Vendor</span>' +
            '      <select id="customVendorSelect" class="custom-date-input" style="min-width: 130px; cursor: pointer;">' +
            '        <option value="">All Vendors</option>' +
            '      </select>' +
            '    </div>' +
            '    <div class="custom-search-container" style="flex: 1; min-width: 180px;">' +
            '      <span class="custom-filter-label">Search Site</span>' +
            '      <input type="text" id="customSearchInput" class="custom-search-input" placeholder="Search site name or site ID..." />' +
            '    </div>' +
            '  </div>' +
            '</div>';

        filterPlaceholder.innerHTML = html;

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
                    DashboardState.isAllTimeMode = false;
                    DashboardState.isTodayMode = false;
                    DashboardState.startDate = sVal;
                    DashboardState.endDate = eVal;
                    DashboardState.pagination.currentPage = 1;
                    updateActiveBadge();
                    fetchDashboardData();
                }
            });
        }

        var resetBtn = document.getElementById('customResetDateBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                DashboardState.isAllTimeMode = false;
                DashboardState.isTodayMode = true;
                var qToday = getTodayDates();
                DashboardState.startDate = qToday.startDate;
                DashboardState.endDate = qToday.endDate;
                DashboardState.searchQuery = '';
                DashboardState.selectedRegion = '';
                DashboardState.selectedVendor = '';
                DashboardState.pagination.currentPage = 1;

                var sInput = document.getElementById('customStartDateInput');
                var eInput = document.getElementById('customEndDateInput');
                if (sInput) sInput.value = qToday.startDate;
                if (eInput) eInput.value = qToday.endDate;

                var searchInput = document.getElementById('customSearchInput');
                if (searchInput) searchInput.value = '';

                var regSelect = document.getElementById('customRegionSelect');
                if (regSelect) regSelect.value = '';

                var venSelect = document.getElementById('customVendorSelect');
                if (venSelect) venSelect.value = '';

                updateActiveBadge();
                fetchDashboardData();
            });
        }

        var regSelect = document.getElementById('customRegionSelect');
        if (regSelect) {
            regSelect.addEventListener('change', function (e) {
                DashboardState.selectedRegion = e.target.value;
                DashboardState.pagination.currentPage = 1;
                updateActiveBadge();
                fetchDashboardData();
            });
        }

        var venSelect = document.getElementById('customVendorSelect');
        if (venSelect) {
            venSelect.addEventListener('change', function (e) {
                DashboardState.selectedVendor = e.target.value;
                DashboardState.pagination.currentPage = 1;
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
                    updateActiveBadge();
                    fetchDashboardData();
                }, 300); // 300ms Debounce
            });
        }

        // Click Event Listener for KPI Cards (SITES AFFECTED, ACTIVE DOWN SITES, TOTAL ALARMS DOWN)
        var sitesAffectedCard = document.getElementById('customKpiCardSitesAffected');
        var activeDownCard = document.getElementById('customKpiCardActiveDown');
        var totalAlarmsCard = document.getElementById('customKpiCardTotalAlarms');

        function updateKpiCardHighlight() {
            if (sitesAffectedCard) {
                if (DashboardState.kpiFilterMode === 'sites_affected') sitesAffectedCard.classList.add('custom-kpi-card-active');
                else sitesAffectedCard.classList.remove('custom-kpi-card-active');
            }
            if (activeDownCard) {
                if (DashboardState.kpiFilterMode === 'active_down') activeDownCard.classList.add('custom-kpi-card-active');
                else activeDownCard.classList.remove('custom-kpi-card-active');
            }
            if (totalAlarmsCard) {
                if (DashboardState.kpiFilterMode === 'active_down') totalAlarmsCard.classList.add('custom-kpi-card-active');
                else totalAlarmsCard.classList.remove('custom-kpi-card-active');
            }
        }

        if (sitesAffectedCard) {
            sitesAffectedCard.onclick = function () {
                DashboardState.kpiFilterMode = (DashboardState.kpiFilterMode === 'sites_affected') ? '' : 'sites_affected';
                updateKpiCardHighlight();
                DashboardState.pagination.currentPage = 1;
                updateActiveBadge();
                applySearchFilter();
            };
        }

        function toggleActiveDownFilter() {
            DashboardState.kpiFilterMode = (DashboardState.kpiFilterMode === 'active_down') ? '' : 'active_down';
            updateKpiCardHighlight();
            DashboardState.pagination.currentPage = 1;
            updateActiveBadge();
            applySearchFilter();
        }

        if (activeDownCard) activeDownCard.onclick = toggleActiveDownFilter;
        if (totalAlarmsCard) totalAlarmsCard.onclick = toggleActiveDownFilter;
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
// Fetch Summary KPI only (kontainer atas) - calls alarmGet service
function fetchSummary() {
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

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        console.error('[OWS Error] MessageProcessor.process API runtime not found.');
        return;
    }

    MessageProcessor.process({
        serviceId: SERVICE_ENDPOINT,
        data: {
            startDate: DashboardState.startDate,
            endDate: DashboardState.endDate,
            region: DashboardState.selectedRegion || '',
            vendor: DashboardState.selectedVendor || '',
            searchQuery: DashboardState.searchQuery || ''
        },
        success: function (res) {
            try {
                var resultData = (res && res.result) || (res && res.data) || res;
                if (resultData && resultData.summary) {
                    DashboardState.summary = resultData.summary;
                    renderKPIStats();
                }
            } catch (e) {
                console.error('[OWS Summary Error]:', e);
            }
        },
        error: function (err) {
            console.error('[OWS Summary Service Error]:', err);
        }
    });
}

// Fetch paginated site list (tabel bawah) - calls alarmBySiteGet service
function fetchTablePage() {
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
        serviceId: SERVICE_ENDPOINT_LIST,
        data: {
            startDate: DashboardState.startDate,
            endDate: DashboardState.endDate,
            region: DashboardState.selectedRegion || '',
            vendor: DashboardState.selectedVendor || '',
            searchQuery: DashboardState.searchQuery || '',
            page: DashboardState.pagination.currentPage || 1,
            pageSize: DashboardState.pagination.pageSize || 20
        },
        success: function (res) {
            try {
                var resultData = (res && res.result) || (res && res.data) || res;

                if (resultData && resultData.pagination) {
                    DashboardState.pagination.currentPage = resultData.pagination.currentPage || 1;
                    DashboardState.pagination.pageSize = resultData.pagination.pageSize || 20;
                    DashboardState.pagination.totalSites = resultData.pagination.totalSites || 0;
                    DashboardState.pagination.totalPages = resultData.pagination.totalPages || 1;
                }

                if (resultData && resultData.sites !== undefined) {
                    var fetchedSites = resultData.sites || [];
                    var nowFetchTime = new Date().getTime();
                    for (var f = 0; f < fetchedSites.length; f++) {
                        fetchedSites[f].baseDowntimeMs = fetchedSites[f].downtimeMs || 0;
                        fetchedSites[f].initialFetchedAt = nowFetchTime;
                    }
                    DashboardState.allSites = fetchedSites;
                    DashboardState.filteredSites = fetchedSites;
                    populateFilterDropdowns();
                    renderTable();
                } else {
                    if (tableContainer) {
                        tableContainer.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">Failed to load data. OWS payload empty.</div>';
                    }
                }
            } catch (e) {
                console.error('[OWS Table Error]:', e);
            }
        },
        error: function (err) {
            console.error('[OWS Table Service Error]:', err);
            if (tableContainer) {
                tableContainer.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">Failed to load data from OWS service.</div>';
            }
        }
    });
}

// Main fetch - calls both services in parallel
function fetchDashboardData() {
    fetchSummary();
    fetchTablePage();
}

// Render KPI Stat Cards - LANGSUNG dari DashboardState.summary (hasil server, bukan hitung ulang frontend)
function renderKPIStats() {
    var statTotal = document.getElementById('statTotalAlarms');
    var statSites = document.getElementById('statSitesAffected');
    var statActiveDown = document.getElementById('statActiveDownSites');
    var statAvail = document.getElementById('statAvgAvail');
    var statMost = document.getElementById('statMostAffected');
    var statMostDt = document.getElementById('statMostAffectedDowntime');

    var summary = DashboardState.summary || {};

    if (statTotal) statTotal.innerText = summary.totalAlarmsDown || 0;
    if (statSites) statSites.innerText = summary.sitesAffected || 0;
    if (statActiveDown) statActiveDown.innerText = summary.activeDownSites || 0;

    if (statAvail) {
        var avgAvailPctStr = summary.avgAvailabilityPct || '100.0';
        var valNum = parseFloat(avgAvailPctStr) || 100;
        var kpiColor = '#10b981'; // Hijau > 80%
        if (valNum <= 40) {
            kpiColor = '#ef4444'; // Merah (0 - 40%)
        } else if (valNum <= 60) {
            kpiColor = '#f97316'; // Oren (40 - 60%)
        } else if (valNum <= 80) {
            kpiColor = '#f59e0b'; // Kuning (60 - 80%)
        }
        statAvail.innerText = avgAvailPctStr + "%";
        statAvail.style.color = kpiColor;
    }

    if (statMost) statMost.innerText = summary.mostAffectedSite || '-';
    if (statMostDt) {
        var dtStr = summary.mostAffectedSiteDowntime || '';
        if (dtStr && dtStr !== '0m' && dtStr !== '0s' && summary.mostAffectedSite !== '-') {
            statMostDt.innerText = dtStr + ' down';
        } else {
            statMostDt.innerText = '-';
        }
    }
}

// Filter dropdown populate - from allSites (current page)
function populateFilterDropdowns() {
    var regSelect = document.getElementById('customRegionSelect');
    var venSelect = document.getElementById('customVendorSelect');
    if (!regSelect || !venSelect) return;
    if (regSelect.options.length > 1 && venSelect.options.length > 1) return;

    var currentReg = DashboardState.selectedRegion;
    var currentVen = DashboardState.selectedVendor;

    var regions = {};
    var vendors = {};

    for (var i = 0; i < DashboardState.allSites.length; i++) {
        var s = DashboardState.allSites[i];
        if (s.regionLabel && s.regionLabel !== '-') regions[s.regionLabel] = true;
        if (s.vendorLabel && s.vendorLabel !== '-') vendors[s.vendorLabel] = true;
    }

    var sortedRegions = Object.keys(regions).sort();
    var sortedVendors = Object.keys(vendors).sort();

    var regHtml = '<option value="">All Regions</option>';
    for (var r = 0; r < sortedRegions.length; r++) {
        var rVal = sortedRegions[r];
        var rSel = rVal === currentReg ? 'selected' : '';
        regHtml += '<option value="' + rVal + '" ' + rSel + '>' + rVal + '</option>';
    }
    regSelect.innerHTML = regHtml;

    var venHtml = '<option value="">All Vendors</option>';
    for (var v = 0; v < sortedVendors.length; v++) {
        var vVal = sortedVendors[v];
        var vSel = vVal === currentVen ? 'selected' : '';
        venHtml += '<option value="' + vVal + '" ' + vSel + '>' + vVal + '</option>';
    }
    venSelect.innerHTML = venHtml;
}

// applySearchFilter - reset page ke 1, lalu minta server fetch ulang
function applySearchFilter() {
    DashboardState.pagination.currentPage = 1;
    fetchTablePage();
}

// Render Table (Supports both List View & Grid View Modes)
function renderTable() {
    var tableContainer = document.getElementById('alarmTableContainer');
    if (!tableContainer) return;
    // Data sudah di-slice server (max 20 items) — langsung pakai DashboardState.allSites
    var list = DashboardState.allSites || [];
    var pag = DashboardState.pagination;
    var totalItems = pag.totalSites || list.length;
    var totalPages = pag.totalPages || 1;
    var pageItems = list; // already sliced by server
    // startIdx untuk nomor baris global (misal page 3: baris mulai dari 41)
    var startIdx = (pag.currentPage - 1) * pag.pageSize;

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
            var gGlobalIndex = g; // index lokal (0-19), allSites = 20 item dari server
            var gVendor = gSite.vendorLabel || '-';
            var gRegion = gSite.regionLabel || '-';

            var gPctNum = parseFloat(gPct) || 100;
            var gColor = '#10b981'; // Hijau (> 80%)
            if (gPctNum <= 40) {
                gColor = '#ef4444'; // Merah (0 - 40%)
            } else if (gPctNum <= 60) {
                gColor = '#f97316'; // Oren (40 - 60%)
            } else if (gPctNum <= 80) {
                gColor = '#f59e0b'; // Kuning (60 - 80%)
            }

            html += '' +
                '<div class="custom-site-grid-card custom-table-row" data-site-index="' + gGlobalIndex + '">' +
                '  <div style="display: flex; justify-content: space-between; align-items: flex-start;">' +
                '    <div>' +
                '      <div style="font-weight: 700; color: #f4f4f5; font-size: 15px;">' + gSite.siteName + '</div>' +
                '      <div style="font-size: 11px; color: #38bdf8; font-weight: 600; font-family: monospace;">ID: ' + (gSite.siteId || '-') + '</div>' +
                '      <div style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">' + (gSite.totalAlarms || 0) + ' alarms down • <span style="color: #a1a1aa;">' + gRegion + '</span> • <span style="color: #60a5fa; font-weight: 600;">' + gVendor + '</span></div>' +
                '    </div>' +
                '    <div style="font-size: 16px; font-weight: 700; color: ' + gColor + '; background: #27272a; padding: 2px 8px; border-radius: 4px;">' + gPct + '%</div>' +
                '  </div>' +
                '  <div style="margin-top: 14px;">' +
                '    <div class="custom-avail-bar-wrapper"><div class="custom-avail-bar-inner" style="width: ' + gPct + '%; background-color: ' + gColor + ';"></div></div>' +
                '  </div>' +
                '  <div style="display: flex; justify-content: space-between; margin-top: 14px; font-size: 12px;">' +
                '    <div><span style="color: #a1a1aa;">Down:</span> <b style="color: #ef4444;">' + (gSite.downtimeFormatted || '0m') + '</b></div>' +
                '    <div><span style="color: #a1a1aa;">Avail:</span> <b style="color: #10b981;">' + (gSite.availableFormatted || '0m') + '</b></div>' +
                '  </div>' +
                '</div>';
        }
        html += '</div>';
    } else {
        // Calculate Header Period Label
        var periodSuffix = DashboardState.isTodayMode ? " (Today)" : "";

        // RENDER LIST VIEW TABLE
        html += '' +
            '<table class="custom-table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th style="width: 50px; text-align: center;">NO</th>' +
            '      <th>SITE NAME</th>' +
            '      <th>SITE ID</th>' +
            '      <th>REGION</th>' +
            '      <th>VENDOR</th>' +
            '      <th>DOWNTIME' + periodSuffix + '</th>' +
            '      <th>AVAILABLE' + periodSuffix + '</th>' +
            '      <th>AVAIL RATE %</th>' +
            '      <th>LAST OCCURRENCE</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>';

        for (var i = 0; i < pageItems.length; i++) {
            var site = pageItems[i];

            var pct = site.availRatePct || "100.0";
            var pctNum = parseFloat(pct) || 100;
            var pctColor = '#10b981'; // Hijau (> 80%)
            if (pctNum <= 40) {
                pctColor = '#ef4444'; // Merah (0 - 40%)
            } else if (pctNum <= 60) {
                pctColor = '#f97316'; // Oren (40 - 60%)
            } else if (pctNum <= 80) {
                pctColor = '#f59e0b'; // Kuning (60 - 80%)
            }
            var rowNo = startIdx + i + 1;  // nomor baris global
            var globalIndex = i;            // index lokal di allSites (0-19)
            var vLabel = site.vendorLabel || '-';
            var rLabel = site.regionLabel || '-';
            var sId = site.siteId || '-';

            html += '' +
                '<tr class="custom-table-row" data-site-index="' + globalIndex + '" style="cursor: pointer;">' +
                '  <td style="text-align: center; color: #71717a; font-weight: 600;">' + rowNo + '</td>' +
                '  <td>' +
                '    <div style="font-weight: 600; color: #f4f4f5;">' + site.siteName + '</div>' +
                '    <div style="font-size: 11px; color: #a1a1aa;">' + (site.totalAlarms || 0) + ' alarms</div>' +
                '  </td>' +
                '  <td><span style="font-family: monospace; color: #38bdf8; font-weight: 600; font-size: 12px; background: #0f172a; padding: 2px 6px; border-radius: 4px; border: 1px solid #1e293b;">' + sId + '</span></td>' +
                '  <td style="color: #e4e4e7; font-weight: 500; font-size: 12px;">' + rLabel + '</td>' +
                '  <td><span style="background: #1e293b; color: #60a5fa; border: 1px solid #3b82f6; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">' + vLabel + '</span></td>' +
                '  <td style="color: ' + (site.isDown ? '#ef4444' : '#71717a') + '; font-weight: 600;">' + (site.downtimeFormatted || '0m') + '</td>' +
                '  <td style="color: #10b981; font-weight: 600;">' + (site.availableFormatted || '0m') + '</td>' +
                '  <td style="font-weight: 700; color: ' + pctColor + ';">' + pct + '%</td>' +
                '  <td style="color: #a1a1aa;">' + (site.lastOccurrenceStr || '-') + '</td>' +
                '</tr>';
        }

    html += '  </tbody></table>';
    }

    // RENDER AUTO PAGINATION CONTROLS (server-side)
    var startIdx = (pag.currentPage - 1) * pag.pageSize + 1;
    var endIdx = Math.min(pag.currentPage * pag.pageSize, totalItems);
    html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #18181b; border-top: 1px solid #27272a; font-size: 12px; color: #a1a1aa;">';
    html += '  <div>Total <b style="color: #f4f4f5;">' + totalItems + '</b> sites | Page <b style="color: #f4f4f5;">' + pag.currentPage + '</b> of <b style="color: #f4f4f5;">' + totalPages + '</b></div>';
    html += '  <div style="display: flex; gap: 8px; align-items: center;">';
    html += '    <label>Rows per page:</label>';
    html += '    <select id="customPageSizeSelect" style="background: #09090b; color: #f4f4f5; border: 1px solid #27272a; border-radius: 6px; padding: 4px 8px; outline: none; cursor: pointer;">';
    [10, 20, 50].forEach(function (size) {
        var sel = pag.pageSize === size ? 'selected' : '';
        html += '      <option value="' + size + '" ' + sel + '>' + size + '</option>';
    });
    html += '    </select>';

    var prevDisabledStr = pag.currentPage === 1 ? 'disabled' : '';
    var nextDisabledStr = pag.currentPage === totalPages ? 'disabled' : '';
    html += '    <button id="customPrevPageBtn" class="custom-pag-btn" ' + prevDisabledStr + '>&lt; Prev</button>';
    html += '    <button id="customNextPageBtn" class="custom-pag-btn" ' + nextDisabledStr + '>Next &gt;</button>';
    html += '  </div>';
    html += '</div>';

    tableContainer.innerHTML = html;

    attachViewToggleListeners();

    // Attach Row / Grid Click for Site Detail Modal — index relative to current page
    var clickables = tableContainer.querySelectorAll('.custom-table-row');
    clickables.forEach(function (item) {
        item.addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-site-index'), 10);
            if (!isNaN(idx) && DashboardState.allSites[idx]) {
                openSiteDetailModal(DashboardState.allSites[idx]);
            }
        });
    });

    // Attach Pagination Event Listeners - SERVER-SIDE (fetch from service)
    var sizeSelect = document.getElementById('customPageSizeSelect');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function () {
            pag.pageSize = parseInt(this.value, 10) || 20;
            pag.currentPage = 1;
            fetchTablePage();
        });
    }

    var prevBtn = document.getElementById('customPrevPageBtn');
    if (prevBtn && pag.currentPage > 1) {
        prevBtn.addEventListener('click', function () {
            pag.currentPage--;
            fetchTablePage();
        });
    }

    var nextBtn = document.getElementById('customNextPageBtn');
    if (nextBtn && pag.currentPage < totalPages) {
        nextBtn.addEventListener('click', function () {
            pag.currentPage++;
            fetchTablePage();
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
    var ticketsList = siteData.tickets || [];

    var modalHtml = '' +
        '<div class="custom-modal-dialog" data-site-name="' + siteData.siteName + '">' +
        '  <div class="custom-modal-header">' +
        '    <div>' +
        '      <div class="custom-modal-subtitle">Site detail</div>' +
        '      <div class="custom-modal-title">' + siteData.siteName + '</div>' +
        '      <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px; flex-wrap: wrap;">' +
        '        <div class="custom-modal-date">' + DashboardState.startDate + ' – ' + DashboardState.endDate + '</div>' +
        '        <div style="font-size: 12px; color: #34d399; font-weight: 500; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3);">⚡ On-Air: ' + (siteData.onAirStr || '-') + '</div>' +
        '      </div>' +
        '    </div>' +
        '    <button id="customCloseModalBtn" class="custom-modal-close-btn">X</button>' +
        '  </div>' +
        '' +
        '  <div class="custom-modal-metrics">' +
        '    <div>' +
        '      <div class="custom-metric-label">Downtime</div>' +
        '      <div id="customModalDowntime" class="custom-metric-val-danger">' + (siteData.downtimeFormatted || '0m') + '</div>' +
        '    </div>' +
        '    <div>' +
        '      <div class="custom-metric-label">Available</div>' +
        '      <div id="customModalAvailable" class="custom-metric-val-success">' + (siteData.availableFormatted || '0m') + '</div>' +
        '    </div>' +
        '    <div>' +
        '      <div class="custom-metric-label">Availability</div>' +
        '      <div id="customModalAvailRate" class="custom-metric-val-white">' + (siteData.availRatePct || '100.0') + '%</div>' +
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
            var isActiveAlarm = alarm.clearStr === 'Active (Now)';
            var durClassAttr = isActiveAlarm ? ' class="custom-modal-active-duration" data-occur-ms="' + (alarm.occurMs || 0) + '"' : '';

            modalHtml += '' +
                '<tr>' +
                '  <td style="color: #f4f4f5; font-weight: 500;">' + alarm.alarmName + '</td>' +
                '  <td style="text-align: center; color: #a1a1aa;">' + alarm.occurStr + '</td>' +
                '  <td style="text-align: center; color: #a1a1aa;">' + alarm.clearStr + '</td>' +
                '  <td style="text-align: right; color: #f4f4f5; font-weight: 700;"' + durClassAttr + '>' + alarm.durationFormatted + '</td>' +
                '</tr>';
        }
    }

    modalHtml += '' +
        '      </tbody>' +
        '    </table>' +
        '  </div>';

    // Related Tickets container
    modalHtml += '<div class="custom-modal-tickets-section">';
    modalHtml += '<div class="custom-modal-tickets-title">RELATED TICKETS <span class="custom-modal-tickets-count">' + ticketsList.length + '</span></div>';

    if (ticketsList.length === 0) {
        modalHtml += '<div class="custom-modal-tickets-empty">No related tickets available for this site.</div>';
    } else {
        for (var tk = 0; tk < ticketsList.length; tk++) {
            var ticket = ticketsList[tk];
            var bsColor = '#71717a';
            var bsBg = '#27272a';
            var bsBorder = '#3f3f46';
            var bsLabel = ticket.businessstatusLabel || '-';
            if (bsLabel === 'Resolved' || bsLabel === 'Closed') { bsColor = '#4ade80'; bsBg = '#052e16'; bsBorder = '#16a34a'; }
            else if (bsLabel === 'In Progress' || bsLabel === 'WIP' || bsLabel === 'In Process') { bsColor = '#60a5fa'; bsBg = '#172554'; bsBorder = '#2563eb'; }
            else if (bsLabel === 'New' || bsLabel === 'Initialized') { bsColor = '#fb923c'; bsBg = '#431407'; bsBorder = '#ea580c'; }

            var ticketLinkHtml = '<span class="custom-modal-ticket-id" style="background: #1e293b; color: #38bdf8; border: 1px solid #334155; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 12px; font-weight: 600;">' + ticket.ticketId + '</span>';

            modalHtml += '' +
                '<div class="custom-modal-ticket-card">' +
                '  <div class="custom-modal-ticket-row">' +
                '    ' + ticketLinkHtml +
                '    <span class="custom-modal-ticket-status" style="color:' + bsColor + ';background:' + bsBg + ';border:1px solid ' + bsBorder + ';">' + bsLabel + '</span>' +
                '  </div>' +
                '  <div class="custom-modal-ticket-row custom-modal-ticket-meta">' +
                '    <span>Created: ' + ticket.createtimeStr + '</span>' +
                '  </div>' +
                '  <div class="custom-modal-ticket-row custom-modal-ticket-rc">' +
                '    <span class="custom-modal-ticket-rc-label">Root Cause:</span>' +
                '    <span class="custom-modal-ticket-rc-val">' + ticket.rootCause + '</span>' +
                '    <span class="custom-modal-ticket-rc-label" style="margin-left:12px;">Sub RC:</span>' +
                '    <span class="custom-modal-ticket-rc-val">' + ticket.subRootCause + '</span>' +
                '  </div>' +
                '</div>';
        }
    }
    modalHtml += '</div>';

    modalHtml += '' +
        '  <div class="custom-modal-footer">' +
        '    <div>Showing ' + alarmsList.length + ' of ' + alarmsList.length + ' alarms</div>' +
        '    <button id="customCloseModalBtnBottom" class="custom-btn-reset">Close</button>' +
        '  </div>' +
        '</div>';

    modalContainer.innerHTML = modalHtml;
    modalContainer.style.setProperty('display', 'flex', 'important');
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
        modalContainer.style.setProperty('display', 'none', 'important');
        modalContainer.innerHTML = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeBtnBottom) closeBtnBottom.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', function (e) {
        if (e.target === modalContainer) closeModal();
    });
}

// 1-SECOND LIVE TICKER FOR DOWNTIME & AVAILABLE COUNTERS
var liveTickerInterval = null;

function startLiveTicker() {
    // Live ticking dimatikan - semua angka statis dari data refresh
    if (liveTickerInterval) clearInterval(liveTickerInterval);
}

// ROBUST LIFECYCLE INITIALIZER FOR OWS RUN & PREVIEWER MODE
(function initDashboardLifecycle() {
    function tryInit() {
        var rendered = renderFilterPanel();
        if (rendered) {
            fetchDashboardData();
            startLiveTicker();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryInit);
    } else {
        tryInit();
    }

    // Auto-refresh data dari OWS server setiap 5 menit
    setInterval(function () {
        if (!DashboardState.loading) {
            fetchDashboardData();
        }
    }, 300000);

    // Fallback retries for OWS iframe delay in RUN Mode
    setTimeout(tryInit, 50);
    setTimeout(tryInit, 300);
    setTimeout(tryInit, 1000);
})();

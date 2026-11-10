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
            '      <input type="datetime-local" id="customStartDateInput" class="custom-date-input" style="color-scheme: dark;" value="' + DashboardState.startDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">End Date & Time</span>' +
            '      <input type="datetime-local" id="customEndDateInput" class="custom-date-input" style="color-scheme: dark;" value="' + DashboardState.endDate + '" />' +
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
            '  <button id="customExportBtn" class="custom-view-toggle-btn" title="Export to Excel">Export Excel</button>' +
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

        var exportBtn = document.getElementById('customExportBtn');
        if (exportBtn) {
            exportBtn.onclick = exportToExcel;
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
function updateTruncationBanner(truncated) {
    var wrapper = document.querySelector('.custom-dashboard-wrapper');
    if (!wrapper) return;
    var banner = document.getElementById('historyTruncationBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'historyTruncationBanner';
        banner.style.cssText = 'background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: #f59e0b; padding: 10px 14px; border-radius: 8px; margin: 0 0 12px 0; font-size: 13px; line-height: 1.5;';
        wrapper.insertBefore(banner, wrapper.firstChild);
    }
    if (truncated) {
        banner.style.display = 'block';
        banner.textContent = 'Perhatian: jumlah alarm history melebihi batas maksimum sehingga data downtime mungkin tidak lengkap untuk periode ini. Perkecil rentang tanggal untuk hasil yang akurat.';
    } else {
        banner.style.display = 'none';
    }
}

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

                if (resultData && resultData.summary) {
                    DashboardState.summaryData = resultData.summary;
                    updateTruncationBanner(!!resultData.summary.historyTruncated);
                }

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

    var currentReg = DashboardState.selectedRegion;
    var currentVen = DashboardState.selectedVendor;

    var regions = {};
    var vendors = {};

    // Prioritize master region list from server response if available
    if (DashboardState.summaryData && DashboardState.summaryData.availableRegions && DashboardState.summaryData.availableRegions.length > 0) {
        for (var ar = 0; ar < DashboardState.summaryData.availableRegions.length; ar++) {
            regions[DashboardState.summaryData.availableRegions[ar]] = true;
        }
    } else {
        for (var i = 0; i < DashboardState.allSites.length; i++) {
            var s = DashboardState.allSites[i];
            if (s.regionLabel && s.regionLabel !== '-') regions[s.regionLabel] = true;
        }
    }

    // Prioritize master vendor list from server response if available
    if (DashboardState.summaryData && DashboardState.summaryData.availableVendors && DashboardState.summaryData.availableVendors.length > 0) {
        for (var av = 0; av < DashboardState.summaryData.availableVendors.length; av++) {
            vendors[DashboardState.summaryData.availableVendors[av]] = true;
        }
    } else {
        for (var j = 0; j < DashboardState.allSites.length; j++) {
            var vSite = DashboardState.allSites[j];
            if (vSite.vendorLabel && vSite.vendorLabel !== '-') vendors[vSite.vendorLabel] = true;
        }
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
                '    <div class="custom-site-grid-main">' +
                '      <div class="custom-site-grid-name" style="font-weight: 700; color: #f4f4f5; font-size: 15px;" title="' + (gSite.siteName || '') + '">' + gSite.siteName + '</div>' +
                '      <div style="font-size: 11px; color: #38bdf8; font-weight: 600; font-family: monospace;">ID: ' + (gSite.siteId || '-') + '</div>' +
                '      <div class="custom-site-grid-meta" style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">' + (gSite.totalAlarms || 0) + ' alarms down • <span style="color: #a1a1aa;">' + gRegion + '</span> • <span style="color: #60a5fa; font-weight: 600;">' + gVendor + '</span></div>' +
                '    </div>' +
                '    <div class="custom-site-grid-badge" style="font-size: 16px; font-weight: 700; color: ' + gColor + '; background: #27272a; padding: 2px 8px; border-radius: 4px;">' + gPct + '%</div>' +
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

// ============================================================================
// EXPORT TO EXCEL (pure JS XLSX generator, no external library)
// ============================================================================
var XLSX_COLUMNS = [6.5, 22, 15, 15, 12, 14, 14, 14, 14];

function xlsxEscapeXml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\u00A0/g, '&nbsp;');
}

function xlsxColName(i) {
    var s = '';
    i++;
    while (i > 0) {
        var rem = (i - 1) % 26;
        s = String.fromCharCode(65 + rem) + s;
        i = Math.floor((i - 1) / 26);
    }
    return s;
}

function xlsxUtf8Encode(str) {
    if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(str);
    var out = [];
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        if (c < 128) out.push(c);
        else if (c < 2048) out.push(192 | (c >> 6), 128 | (c & 63));
        else out.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
    return new Uint8Array(out);
}

var XLSX_CRC_TABLE = (function () {
    var t = [];
    for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        t[n] = c >>> 0;
    }
    return t;
})();

function xlsxCrc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = XLSX_CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function xlsxWriteU16(view, off, v) { view.setUint16(off, v, true); }
function xlsxWriteU32(view, off, v) { view.setUint32(off, v, true); }

// Build a store-only ZIP archive. files: [{name, data:Uint8Array}]
function xlsxZipStore(files) {
    var chunks = [];
    var central = [];
    var offset = 0;
    for (var i = 0; i < files.length; i++) {
        var nameB = xlsxUtf8Encode(files[i].name);
        var data = files[i].data;
        var crc = xlsxCrc32(data);
        var size = data.length;

        var lh = new DataView(new ArrayBuffer(30));
        xlsxWriteU32(lh, 0, 0x04034b50);
        xlsxWriteU16(lh, 4, 20);
        xlsxWriteU16(lh, 6, 0x0800); // UTF-8 flag
        xlsxWriteU16(lh, 8, 0);      // store (no compression)
        xlsxWriteU16(lh, 10, 0);
        xlsxWriteU16(lh, 12, 0x21);  // DOS date 1980-01-01
        xlsxWriteU32(lh, 14, crc);
        xlsxWriteU32(lh, 18, size);
        xlsxWriteU32(lh, 22, size);
        xlsxWriteU16(lh, 26, nameB.length);
        xlsxWriteU16(lh, 28, 0);
        var lhBytes = new Uint8Array(lh.buffer);
        chunks.push(lhBytes, nameB, data);

        var ch = new DataView(new ArrayBuffer(46));
        xlsxWriteU32(ch, 0, 0x02014b50);
        xlsxWriteU16(ch, 4, 20);
        xlsxWriteU16(ch, 6, 20);
        xlsxWriteU16(ch, 8, 0x0800);
        xlsxWriteU16(ch, 10, 0);
        xlsxWriteU16(ch, 12, 0);
        xlsxWriteU16(ch, 14, 0x21);
        xlsxWriteU32(ch, 16, crc);
        xlsxWriteU32(ch, 20, size);
        xlsxWriteU32(ch, 24, size);
        xlsxWriteU16(ch, 28, nameB.length);
        xlsxWriteU16(ch, 30, 0);
        xlsxWriteU16(ch, 32, 0);
        xlsxWriteU16(ch, 34, 0);
        xlsxWriteU16(ch, 36, 0);
        xlsxWriteU32(ch, 38, 0);
        xlsxWriteU32(ch, 42, offset);
        var chBytes = new Uint8Array(ch.buffer);
        central.push(chBytes, nameB);

        offset += lhBytes.length + nameB.length + data.length;
    }

    var centralSize = 0;
    for (var j = 0; j < central.length; j++) centralSize += central[j].length;

    var eocd = new DataView(new ArrayBuffer(22));
    xlsxWriteU32(eocd, 0, 0x06054b50);
    xlsxWriteU16(eocd, 4, 0);
    xlsxWriteU16(eocd, 6, 0);
    xlsxWriteU16(eocd, 8, files.length);
    xlsxWriteU16(eocd, 10, files.length);
    xlsxWriteU32(eocd, 12, centralSize);
    xlsxWriteU32(eocd, 16, offset);
    xlsxWriteU16(eocd, 20, 0);

    var total = offset + centralSize + 22;
    var out = new Uint8Array(total);
    var pos = 0;
    var all = chunks.concat(central);
    for (var k = 0; k < all.length; k++) { out.set(all[k], pos); pos += all[k].length; }
    out.set(new Uint8Array(eocd.buffer), pos);
    return out;
}

// spec: { title, generated, filter, timeRange, footer, headers:[..], rows:[[{v,t,s}]] }
//   t: 'n' numeric | 's' string; s: style key
function xlsxBuildWorkbook(spec) {
    var headers = spec.headers || [];
    var lastCol = xlsxColName(headers.length - 1);
    var styleMap = { title: 1, meta: 2, h: 3, l: 4, c: 5, n: 6, r: 7, g: 8, p: 9 };

    var rowsXml = '';

    function addRow(rowNum, cells, height) {
        var attrs = ' r="' + rowNum + '"';
        if (height) attrs += ' ht="' + height + '" customHeight="1"';
        var cellsXml = '';
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            var ref = xlsxColName(i) + rowNum;
            var st = styleMap[cell.s] || 4;
            if (cell.t === 'n') {
                cellsXml += '<c r="' + ref + '" s="' + st + '" t="n"><v>' + cell.v + '</v></c>';
            } else {
                cellsXml += '<c r="' + ref + '" s="' + st + '" t="inlineStr"><is><t>' + xlsxEscapeXml(cell.v) + '</t></is></c>';
            }
        }
        rowsXml += '<row' + attrs + '>' + cellsXml + '</row>';
    }

    // Row 1: merged title
    addRow(1, [{ v: spec.title, s: 'title' }], 30);
    // Row 2: generated
    addRow(2, [{ v: spec.generated, s: 'meta' }], 18);
    // Row 3: filter
    addRow(3, [{ v: spec.filter, s: 'meta' }], 18);
    // Row 4: time range
    addRow(4, [{ v: spec.timeRange, s: 'meta' }], 18);
    // Row 5: spacer
    addRow(5, [], 12);
    // Row 6: header
    var headerCells = [];
    for (var hh = 0; hh < headers.length; hh++) headerCells.push({ v: headers[hh], s: 'h' });
    addRow(6, headerCells, 24);

    // Data rows
    var dataStartRow = 7;
    for (var r = 0; r < spec.rows.length; r++) {
        addRow(dataStartRow + r, spec.rows[r]);
    }

    // Footer row
    var footerRow = dataStartRow + spec.rows.length;
    addRow(footerRow, [{ v: spec.footer, s: 'meta' }], 18);

    var merges = [
        'A1:' + lastCol + '1',
        'A2:' + lastCol + '2',
        'A3:' + lastCol + '3',
        'A4:' + lastCol + '4',
        'A6:' + lastCol + '6',
        'A' + footerRow + ':' + lastCol + footerRow
    ];

    var colsXml = '';
    for (var w = 0; w < XLSX_COLUMNS.length; w++) {
        colsXml += '<col min="' + (w + 1) + '" max="' + (w + 1) + '" width="' + XLSX_COLUMNS[w] + '" customWidth="1"/>';
    }

    var sheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        '<dimension ref="A1:' + lastCol + footerRow + '"/>' +
        '<sheetViews><sheetView tabSelected="1" workbookViewId="0">' +
        '<pane ySplit="6" topLeftCell="A' + dataStartRow + '" activePane="bottomLeft" state="frozen"/>' +
        '<selection pane="bottomLeft" activeCell="G' + dataStartRow + '" sqref="G' + dataStartRow + '"/>' +
        '</sheetView></sheetViews>' +
        '<sheetFormatPr defaultRowHeight="15"/>' +
        '<sheetData>' + rowsXml + '</sheetData>' +
        '<mergeCells count="' + merges.length + '">' +
        merges.map(function (m) { return '<mergeCell ref="' + m + '"/>'; }).join('') +
        '</mergeCells>' +
        '<cols>' + colsXml + '</cols>' +
        '</worksheet>';

    var stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        '<numFmts count="0"/>' +
        '<fonts count="7">' +
        '<font><sz val="11"/><name val="Calibri"/></font>' +
        '<font><b/><sz val="14"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>' +
        '<font><i/><sz val="10"/><color rgb="FF5F5E5A"/><name val="Arial"/></font>' +
        '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>' +
        '<font><sz val="11"/><name val="Arial"/></font>' +
        '<font><b/><sz val="11"/><color rgb="FFB3261E"/><name val="Arial"/></font>' +
        '<font><b/><sz val="11"/><color rgb="FF1E7A3E"/><name val="Arial"/></font>' +
        '</fonts>' +
        '<fills count="3"><fill><patternFill patternType="none"/></fill>' +
        '<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/></patternFill></fill>' +
        '<fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F1"/></patternFill></fill></fills>' +
        '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>' +
        '<border><left style="thin"><color rgb="FF9CC3E5"/></left><right style="thin"><color rgb="FF9CC3E5"/></right><top style="thin"><color rgb="FF9CC3E5"/></top><bottom style="thin"><color rgb="FF9CC3E5"/></bottom><diagonal/></border></borders>' +
        '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
        '<cellXfs count="10">' +
        '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
        '<xf numFmtId="0" fontId="1" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
        '<xf numFmtId="0" fontId="3" fillId="1" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>' +
        '<xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="0" fontId="5" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="0" fontId="6" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '<xf numFmtId="10" fontId="4" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"><alignment horizontal="center" vertical="center"/></xf>' +
        '</cellXfs>' +
        '</styleSheet>';

    var workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
        '<sheets><sheet name="Alarm Downtime by Site" sheetId="1" r:id="rId1"/></sheets>' +
        '</workbook>';

    var relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
        '</Relationships>';

    var wbRelsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
        '</Relationships>';

    var contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
        '<Default Extension="xml" ContentType="application/xml"/>' +
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
        '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
        '</Types>';

    var files = [
        { name: '[Content_Types].xml', data: xlsxUtf8Encode(contentTypesXml) },
        { name: '_rels/.rels', data: xlsxUtf8Encode(relsXml) },
        { name: 'xl/workbook.xml', data: xlsxUtf8Encode(workbookXml) },
        { name: 'xl/_rels/workbook.xml.rels', data: xlsxUtf8Encode(wbRelsXml) },
        { name: 'xl/styles.xml', data: xlsxUtf8Encode(stylesXml) },
        { name: 'xl/worksheets/sheet1.xml', data: xlsxUtf8Encode(sheetXml) }
    ];

    return xlsxZipStore(files);
}

// Format "2026-08-04T00:00" -> "04 Aug 2026, 00:00:00"
function xlsxFormatTs(ts) {
    if (!ts) return '';
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var parts = String(ts).split('T');
    var dateParts = (parts[0] || '').split('-');
    var timePart = parts[1] || '00:00';
    if (timePart.length === 5) timePart += ':00';
    var y = dateParts[0] || '';
    var m = parseInt(dateParts[1], 10) || 1;
    var d = dateParts[2] || '';
    return d + ' ' + (monthNames[m - 1] || '') + ' ' + y + ', ' + timePart;
}

function xlsxPad2(n) { return (n < 10 ? '0' : '') + n; }

// Build spec.rows from site objects
function xlsxBuildRows(sites) {
    var rows = [];
    for (var i = 0; i < sites.length; i++) {
        var s = sites[i];
        var pct = parseFloat(s.availRatePct || '100.0');
        if (isNaN(pct)) pct = 100.0;
        rows.push([
            { v: i + 1, t: 'n', s: 'n' },
            { v: s.siteName || '', s: 'l' },
            { v: s.siteId || '-', s: 'l' },
            { v: s.regionLabel || '-', s: 'l' },
            { v: s.vendorLabel || '-', s: 'c' },
            { v: s.totalAlarms || 0, t: 'n', s: 'n' },
            { v: s.downtimeFormatted || '0m', s: 'r' },
            { v: s.availableFormatted || '0m', s: 'g' },
            { v: Math.round(pct * 10000) / 1000000, t: 'n', s: 'p' }
        ]);
    }
    return rows;
}

// Main export handler
function exportToExcel() {
    var exportBtn = document.getElementById('customExportBtn');
    var originalText = exportBtn ? exportBtn.textContent : 'Export Excel';

    function fail(msg) {
        console.error('[Export Error]:', msg);
        if (exportBtn) {
            exportBtn.textContent = originalText;
            exportBtn.disabled = false;
        }
        if (typeof alert === 'function') alert('Export failed: ' + msg);
    }

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        fail('MessageProcessor not available');
        return;
    }

    if (exportBtn) {
        exportBtn.textContent = 'Exporting...';
        exportBtn.disabled = true;
    }

    var now = new Date();
    var generated = 'Generated: ' + now.getFullYear() + '-' + xlsxPad2(now.getMonth() + 1) + '-' + xlsxPad2(now.getDate()) +
        ' ' + xlsxPad2(now.getHours()) + ':' + xlsxPad2(now.getMinutes());

    var filterParts = [];
    if (DashboardState.selectedRegion) filterParts.push(DashboardState.selectedRegion);
    if (DashboardState.selectedVendor) filterParts.push(DashboardState.selectedVendor);
    if (DashboardState.searchQuery) filterParts.push('"' + DashboardState.searchQuery + '"');
    var filterLabel = filterParts.length ? 'Filter : ' + filterParts.join(', ') : 'Filter : All';

    var timeRange;
    if (DashboardState.isLast24hMode) {
        var q24 = getLast24HoursDates();
        timeRange = 'Time range: ' + xlsxFormatTs(q24.startDate) + ' \u2013 ' + xlsxFormatTs(q24.endDate);
    } else if (DashboardState.isTodayMode) {
        timeRange = 'Time range: Today (00:00 \u2013 Now)';
    } else if (DashboardState.isAllTimeMode) {
        timeRange = 'Time range: All Time';
    } else {
        timeRange = 'Time range: ' + xlsxFormatTs(DashboardState.startDate) + ' \u2013 ' + xlsxFormatTs(DashboardState.endDate);
    }

    MessageProcessor.process({
        serviceId: SERVICE_ENDPOINT_LIST,
        data: {
            startDate: DashboardState.startDate,
            endDate: DashboardState.endDate,
            region: DashboardState.selectedRegion || '',
            vendor: DashboardState.selectedVendor || '',
            searchQuery: DashboardState.searchQuery || '',
            page: 1,
            pageSize: 10000
        },
        success: function (res) {
            try {
                var resultData = (res && res.result) || (res && res.data) || res;
                var sites = (resultData && resultData.sites) || DashboardState.allSites || [];

                var spec = {
                    title: 'Alarm Downtime by Site \u2014 Export',
                    generated: generated,
                    filter: filterLabel,
                    timeRange: timeRange,
                    footer: 'Total: ' + (resultData && resultData.pagination ? resultData.pagination.totalSites : sites.length) +
                        ' sites \u2022 ' + (DashboardState.summary ? DashboardState.summary.totalAlarmsDown : 0) + ' alarms down',
                    headers: ['No', 'Site name', 'Site ID', 'Region', 'Vendor', 'Alarm count', 'Downtime', 'Available', 'Availability %'],
                    rows: xlsxBuildRows(sites)
                };

                var bytes = xlsxBuildWorkbook(spec);
                var filename = 'Alarm_Downtime_by_Site_' + now.getFullYear() + '-' + xlsxPad2(now.getMonth() + 1) + '-' + xlsxPad2(now.getDate()) + '.xlsx';
                var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    URL.revokeObjectURL(url);
                    a.remove();
                }, 1500);

                if (exportBtn) {
                    exportBtn.textContent = originalText;
                    exportBtn.disabled = false;
                }
            } catch (e) {
                fail(e.message || e);
            }
        },
        error: function (err) {
            fail(err && err.message ? err.message : 'service error');
        }
    });
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

/**
 * Huawei OWS Alarm Monitoring Dashboard - Pure UI Presenter (script.js)
 */



// OWS Function Service Python Endpoint (olt_alarm__get_py)
var SERVICE_ENDPOINT = "/adc-service/rest/v1/services/gde_dashboard/olt_alarm_dashboard/olt_alarm__get_py";
var SERVICE_ENDPOINT_LIST = "/adc-service/rest/v1/services/gde_dashboard/olt_alarm_dashboard/olt_alarm__get_py";

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
        dateLabel = "Active: Today (00:00 - Now)";
    } else if (DashboardState.isAllTimeMode) {
        dateLabel = "Active: All Time (Live & History)";
    } else if (DashboardState.startDate && DashboardState.endDate) {
        dateLabel = "Active: " + DashboardState.startDate.replace("T", " ") + " - " + DashboardState.endDate.replace("T", " ");
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
                var sEl = document.getElementById('customStartDateInput');
                var eEl = document.getElementById('customEndDateInput');
                var startVal = sEl ? sEl.value : '';
                var endVal = eEl ? eEl.value : '';

                if (startVal && endVal) {
                    if (startVal > endVal) {
                        alert('Start Date cannot be greater than End Date!');
                        return;
                    }
                    DashboardState.isAllTimeMode = false;
                    DashboardState.isTodayMode = false;
                    DashboardState.startDate = startVal;
                    DashboardState.endDate = endVal;
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
            // alarmGet.js di-cache OWS -> tidak digunakan untuk update KPI card.
            // KPI card diupdate eksklusif dari alarmBySiteGet.js (fetchTablePage)
            // agar selalu reflect filter region/vendor yang aktif.
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

function unwrapOWSResult(res) {
    if (!res) return {};
    var cur = res;

    // Handle OWS Python service string wrapper: res.response = "{'success': True, ...}" or JSON string
    if (typeof cur === 'string') {
        try {
            cur = JSON.parse(cur);
        } catch (e) {
            try {
                // Handle python repr dictionary (single quotes, True, False, None)
                var jsonified = cur
                    .replace(/'/g, '"')
                    .replace(/:\s*True\b/g, ': true')
                    .replace(/:\s*False\b/g, ': false')
                    .replace(/:\s*None\b/g, ': null');
                cur = JSON.parse(jsonified);
            } catch (e2) {
                console.error('[unwrapOWSResult] Failed to parse string response:', e2);
            }
        }
    }

    if (cur && typeof cur === 'object' && typeof cur.response === 'string') {
        try {
            cur = JSON.parse(cur.response);
        } catch (e) {
            try {
                var jsonified = cur.response
                    .replace(/'/g, '"')
                    .replace(/:\s*True\b/g, ': true')
                    .replace(/:\s*False\b/g, ': false')
                    .replace(/:\s*None\b/g, ': null');
                cur = JSON.parse(jsonified);
            } catch (e2) {
                console.error('[unwrapOWSResult] Failed to parse cur.response string:', e2);
            }
        }
    }

    while (cur && typeof cur === 'object') {
        if (cur.sites !== undefined || cur.summary !== undefined) {
            return cur;
        }
        if (cur.result && typeof cur.result === 'object') {
            cur = cur.result;
        } else if (cur.response && typeof cur.response === 'object') {
            cur = cur.response;
        } else if (cur.data && typeof cur.data === 'object') {
            cur = cur.data;
        } else {
            break;
        }
    }
    return cur || {};
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
                console.log('[OWS Service Raw Response]:', res);
                var resultData = unwrapOWSResult(res);
                console.log('[OWS Service Unwrapped Data]:', resultData);

                if (resultData && resultData.summary) {
                    DashboardState.summaryData = resultData.summary;
                    DashboardState.summary = resultData.summary;
                    renderKPIStats();
                    updateTruncationBanner(!!resultData.summary.historyTruncated);
                }

                if (resultData && resultData.pagination) {
                    DashboardState.pagination.currentPage = resultData.pagination.currentPage || 1;
                    DashboardState.pagination.pageSize = resultData.pagination.pageSize || 20;
                    DashboardState.pagination.totalSites = resultData.pagination.totalSites || 0;
                    DashboardState.pagination.totalPages = resultData.pagination.totalPages || 1;
                }

                var trendData = resultData.dailyTrend || [];
                renderDailyTrendChart(trendData);
                renderWeeklyTrendChart(trendData);

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

// Main fetch - loads both summary and table from alarm_moni_alarmgetpy
function fetchDashboardData() {
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
        var avgAvailPctStr = summary.avgAvailabilityPct || '-';
        if (avgAvailPctStr === '-' || avgAvailPctStr === '') {
            statAvail.innerText = '-';
            statAvail.style.color = '#71717a'; // Abu-abu netral jika tidak ada data
        } else {
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

// ==========================================
// ECHARTS LOADER & TREND CHARTS (DAILY & WEEKLY)
// ==========================================
var EChartsDailyTrendInstance = null;
var EChartsWeeklyTrendInstance = null;

function ensureEChartsLoaded(callback) {
    if (typeof echarts !== 'undefined') {
        callback();
        return;
    }

    var existingScript = document.getElementById('owsInternalEchartsScript');
    if (existingScript) {
        if (typeof echarts !== 'undefined') {
            callback();
            return;
        }
        var pollCount = 0;
        var checkLoaded = setInterval(function () {
            pollCount++;
            if (typeof echarts !== 'undefined') {
                clearInterval(checkLoaded);
                callback();
            } else if (pollCount > 50) {
                clearInterval(checkLoaded);
            }
        }, 100);
        return;
    }

    var script = document.createElement('script');
    script.id = 'owsInternalEchartsScript';
    script.src = '/adc-static/echarts/echarts.min.js';
    script.onload = function () { callback(); };
    script.onerror = function () {
        var fallbackScript = document.createElement('script');
        fallbackScript.id = 'owsFallbackEchartsScript';
        fallbackScript.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
        fallbackScript.onload = function () { callback(); };
        document.head.appendChild(fallbackScript);
    };

    document.head.appendChild(script);
}

function renderDailyTrendChart(dailyData) {
    var wrapper = document.getElementById('customDailyChartCanvasWrapper');
    if (!wrapper) return;

    if (typeof echarts === 'undefined') {
        ensureEChartsLoaded(function () {
            renderDailyTrendChart(dailyData);
        });
        return;
    }

    if (EChartsDailyTrendInstance) {
        EChartsDailyTrendInstance.dispose();
        EChartsDailyTrendInstance = null;
    }

    if (!dailyData || dailyData.length === 0) {
        wrapper.innerHTML = '<div style="color: #a1a1aa; padding: 48px; text-align: center;">No daily trend data available for selected date range.</div>';
        return;
    }

    wrapper.innerHTML = '';
    var chartDom = document.createElement('div');
    chartDom.id = 'customLiveEChartsContainer';
    chartDom.style.width = '100%';
    chartDom.style.height = '320px';
    wrapper.appendChild(chartDom);

    var categories = [];
    var totalSitesData = [];
    var avgAvailData = [];

    for (var i = 0; i < dailyData.length; i++) {
        var item = dailyData[i];
        var dParts = item.date.split('-');
        var shortDate = dParts.length === 3 ? (parseInt(dParts[1], 10) + '/' + parseInt(dParts[2], 10) + '/' + dParts[0]) : item.date;

        categories.push(shortDate);
        totalSitesData.push(item.total_sites || 0);
        avgAvailData.push(item.avg_availability !== null ? item.avg_availability : null);
    }

    var isLongRange = categories.length > 12;
    var defaultVisibleCount = 12;
    var zoomStartValue = isLongRange ? Math.max(0, categories.length - defaultVisibleCount) : 0;
    var zoomEndValue = categories.length - 1;

    EChartsDailyTrendInstance = echarts.init(chartDom);

    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#18181b',
            borderColor: '#27272a',
            borderWidth: 1,
            textStyle: { color: '#f4f4f5', fontFamily: 'Inter, sans-serif', fontSize: 12 },
            axisPointer: {
                type: 'cross',
                crossStyle: { color: '#71717a' },
                lineStyle: { color: '#3f3f46' }
            },
            formatter: function (params) {
                if (!params || params.length === 0) return '';
                var html = '<div style="font-weight: 600; margin-bottom: 6px; color: #f4f4f5;">' + params[0].name + '</div>';
                for (var p = 0; p < params.length; p++) {
                    var s = params[p];
                    var dotColor = s.color;
                    var valStr = s.seriesName.indexOf('Average') !== -1 ? (s.value !== null ? s.value + '%' : '-') : (s.value !== null ? s.value.toLocaleString() + ' sites' : '-');
                    html += '<div style="display: flex; align-items: center; gap: 6px; font-size: 11px; margin-top: 3px;">' +
                        '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:' + dotColor + ';"></span>' +
                        '<span style="color: #a1a1aa;">' + s.seriesName + ':</span>' +
                        '<span style="font-weight: 600; color: #f4f4f5; margin-left: auto;">' + valStr + '</span>' +
                        '</div>';
                }
                return html;
            }
        },
        grid: {
            top: 40,
            left: 55,
            right: 55,
            bottom: isLongRange ? 52 : 30,
            containLabel: false
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0,
                zoomOnMouseWheel: false,
                moveOnMouseWheel: true,
                moveOnMouseMove: true,
                startValue: zoomStartValue,
                endValue: zoomEndValue
            },
            {
                type: 'slider',
                xAxisIndex: 0,
                show: isLongRange,
                height: 16,
                bottom: 8,
                borderColor: '#27272a',
                backgroundColor: '#18181b',
                fillerColor: 'rgba(59, 130, 246, 0.25)',
                showDetail: false,
                handleSize: '100%',
                handleStyle: {
                    color: '#3b82f6',
                    borderColor: '#60a5fa'
                },
                moveHandleStyle: {
                    color: '#3b82f6'
                },
                brushSelect: false,
                startValue: zoomStartValue,
                endValue: zoomEndValue
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: categories,
                axisPointer: { type: 'shadow' },
                axisLine: { lineStyle: { color: '#27272a' } },
                axisTick: { show: false },
                axisLabel: {
                    color: '#a1a1aa',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                position: 'left',
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
                axisLabel: {
                    color: '#a1a1aa',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    formatter: function (v) { return v.toLocaleString(); }
                }
            },
            {
                type: 'value',
                position: 'right',
                min: 0,
                max: 100,
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: '#a1a1aa',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: 'Total Count of BTS ID',
                type: 'bar',
                yAxisIndex: 0,
                data: totalSitesData,
                itemStyle: {
                    color: '#3b82f6',
                    borderRadius: [3, 3, 0, 0]
                },
                barMaxWidth: 40,
                label: {
                    show: true,
                    position: 'insideBottom',
                    distance: 8,
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    fontSize: 11,
                    formatter: function (params) {
                        return params.value > 0 ? params.value.toLocaleString() : '';
                    }
                }
            },
            {
                name: 'Average of availability',
                type: 'line',
                yAxisIndex: 1,
                data: avgAvailData,
                smooth: false,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#f97316',
                    borderColor: '#18181b',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#f97316',
                    width: 2.5
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 6,
                    color: '#f4f4f5',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    fontSize: 11,
                    formatter: function (params) {
                        return params.value !== null ? params.value.toFixed(2) : '';
                    }
                }
            }
        ]
    };

    EChartsDailyTrendInstance.setOption(option);
}

function getIsoWeekNumber(d) {
    var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function getThuWedWeekInfo(d) {
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var day = date.getDay();
    var diffToThu = (day >= 4) ? (day - 4) : (day + 3);
    var thuDate = new Date(date);
    thuDate.setDate(date.getDate() - diffToThu);

    var wedDate = new Date(thuDate);
    wedDate.setDate(thuDate.getDate() + 6);

    var isoWeek = getIsoWeekNumber(thuDate);
    return {
        weekNum: isoWeek,
        thuDate: thuDate,
        wedDate: wedDate
    };
}

function formatDateShort(d) {
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    return dd + '/' + mm;
}

function renderWeeklyTrendChart(dailyData) {
    var wrapper = document.getElementById('customWeeklyChartCanvasWrapper');
    if (!wrapper) return;

    if (typeof echarts === 'undefined') {
        ensureEChartsLoaded(function () {
            renderWeeklyTrendChart(dailyData);
        });
        return;
    }

    if (EChartsWeeklyTrendInstance) {
        EChartsWeeklyTrendInstance.dispose();
        EChartsWeeklyTrendInstance = null;
    }

    if (!dailyData || dailyData.length === 0) {
        wrapper.innerHTML = '<div style="color: #a1a1aa; padding: 48px; text-align: center;">No weekly trend data available.</div>';
        return;
    }

    var weekGroups = {};
    var weekOrder = [];

    for (var i = 0; i < dailyData.length; i++) {
        var item = dailyData[i];
        if (!item.date) continue;

        var dParts = item.date.split('-');
        if (dParts.length < 3) continue;
        var dt = new Date(parseInt(dParts[0], 10), parseInt(dParts[1], 10) - 1, parseInt(dParts[2], 10));

        var wInfo = getThuWedWeekInfo(dt);
        var wKey = 'W' + wInfo.weekNum;

        if (!weekGroups[wKey]) {
            weekGroups[wKey] = {
                weekLabel: wKey,
                thuDate: wInfo.thuDate,
                wedDate: wInfo.wedDate,
                sumAvail: 0,
                countAvail: 0,
                maxSites: 0
            };
            weekOrder.push(wKey);
        }

        var group = weekGroups[wKey];
        if (item.total_sites > group.maxSites) {
            group.maxSites = item.total_sites;
        }
        if (item.avg_availability !== null && item.avg_availability !== undefined) {
            group.sumAvail += item.avg_availability;
            group.countAvail++;
        }
    }

    var categories = [];
    var totalSitesData = [];
    var avgAvailData = [];

    for (var w = 0; w < weekOrder.length; w++) {
        var key = weekOrder[w];
        var g = weekGroups[key];

        var sShort = formatDateShort(g.thuDate);
        var eShort = formatDateShort(g.wedDate);

        var fullLabel = g.weekLabel + ' (' + sShort + ' - ' + eShort + ')';
        categories.push(fullLabel);

        totalSitesData.push(g.maxSites);
        var avgW = g.countAvail > 0 ? parseFloat((g.sumAvail / g.countAvail).toFixed(2)) : null;
        avgAvailData.push(avgW);
    }

    var isLongWeekly = categories.length > 8;
    var defaultVisibleWeeks = 8;
    var zoomStartWeek = isLongWeekly ? Math.max(0, categories.length - defaultVisibleWeeks) : 0;
    var zoomEndWeek = categories.length - 1;

    wrapper.innerHTML = '';
    var chartDom = document.createElement('div');
    chartDom.id = 'customLiveWeeklyEChartsContainer';
    chartDom.style.width = '100%';
    chartDom.style.height = '320px';
    wrapper.appendChild(chartDom);

    EChartsWeeklyTrendInstance = echarts.init(chartDom);

    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#18181b',
            borderColor: '#27272a',
            borderWidth: 1,
            textStyle: { color: '#f4f4f5', fontFamily: 'Inter, sans-serif', fontSize: 12 },
            axisPointer: {
                type: 'cross',
                crossStyle: { color: '#71717a' },
                lineStyle: { color: '#3f3f46' }
            },
            formatter: function (params) {
                if (!params || params.length === 0) return '';
                var html = '<div style="font-weight: 600; margin-bottom: 6px; color: #f4f4f5;">' + params[0].name + '</div>';
                for (var p = 0; p < params.length; p++) {
                    var s = params[p];
                    var dotColor = s.color;
                    var valStr = s.seriesName.indexOf('Average') !== -1 ? (s.value !== null ? s.value + '%' : '-') : (s.value !== null ? s.value.toLocaleString() + ' sites' : '-');
                    html += '<div style="display: flex; align-items: center; gap: 6px; font-size: 11px; margin-top: 3px;">' +
                        '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:' + dotColor + ';"></span>' +
                        '<span style="color: #a1a1aa;">' + s.seriesName + ':</span>' +
                        '<span style="font-weight: 600; color: #f4f4f5; margin-left: auto;">' + valStr + '</span>' +
                        '</div>';
                }
                return html;
            }
        },
        grid: {
            top: 40,
            left: 55,
            right: 55,
            bottom: isLongWeekly ? 52 : 30,
            containLabel: false
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0,
                zoomOnMouseWheel: false,
                moveOnMouseWheel: true,
                moveOnMouseMove: true,
                startValue: zoomStartWeek,
                endValue: zoomEndWeek
            },
            {
                type: 'slider',
                xAxisIndex: 0,
                show: isLongWeekly,
                height: 16,
                bottom: 8,
                borderColor: '#27272a',
                backgroundColor: '#18181b',
                fillerColor: 'rgba(59, 130, 246, 0.25)',
                showDetail: false,
                handleSize: '100%',
                handleStyle: {
                    color: '#3b82f6',
                    borderColor: '#60a5fa'
                },
                moveHandleStyle: {
                    color: '#3b82f6'
                },
                brushSelect: false,
                startValue: zoomStartWeek,
                endValue: zoomEndWeek
            }
        ],
        xAxis: [
            {
                type: 'category',
                data: categories,
                axisPointer: { type: 'shadow' },
                axisLine: { lineStyle: { color: '#27272a' } },
                axisTick: { show: false },
                axisLabel: {
                    color: '#a1a1aa',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                position: 'left',
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.05)' } },
                axisLabel: {
                    color: '#a1a1aa',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    formatter: function (v) { return v.toLocaleString(); }
                }
            },
            {
                type: 'value',
                position: 'right',
                min: 0,
                max: 100,
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    color: '#a1a1aa',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: 'Total Count of BTS ID',
                type: 'bar',
                yAxisIndex: 0,
                data: totalSitesData,
                itemStyle: {
                    color: '#3b82f6',
                    borderRadius: [3, 3, 0, 0]
                },
                barMaxWidth: 40,
                label: {
                    show: true,
                    position: 'insideBottom',
                    distance: 8,
                    color: '#ffffff',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    fontSize: 11,
                    formatter: function (params) {
                        return params.value > 0 ? params.value.toLocaleString() : '';
                    }
                }
            },
            {
                name: 'Average of availability',
                type: 'line',
                yAxisIndex: 1,
                data: avgAvailData,
                smooth: false,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#f97316',
                    borderColor: '#18181b',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#f97316',
                    width: 2.5
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 6,
                    color: '#f4f4f5',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 'bold',
                    fontSize: 11,
                    formatter: function (params) {
                        return params.value !== null ? params.value.toFixed(2) : '';
                    }
                }
            }
        ]
    };

    EChartsWeeklyTrendInstance.setOption(option);
}

window.addEventListener('resize', function () {
    if (EChartsDailyTrendInstance) EChartsDailyTrendInstance.resize();
    if (EChartsWeeklyTrendInstance) EChartsWeeklyTrendInstance.resize();
});

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
    // Data sudah di-slice server (max 20 items) - langsung pakai DashboardState.allSites
    var list = DashboardState.allSites || [];
    var pag = DashboardState.pagination;
    var totalItems = pag.totalSites || list.length;
    var totalPages = pag.totalPages || 1;
    var pageItems = list; // already sliced by server
    // startIdx untuk nomor baris global (misal page 3: baris mulai dari 41)
    var startIdx = (pag.currentPage - 1) * pag.pageSize;

    var html = '' +
        '<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #27272a; background: #18181b;">' +
        '  <span style="font-size: 13px; font-weight: 600; color: #f4f4f5;">ALARMS DOWN BY OLT DEVICE <span style="font-size: 11px; font-weight: normal; color: #a1a1aa;">(Sorted by Latest Occur Time)</span></span>' +
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
            var gDevName = gSite.deviceName || gSite.siteName || '-';
            var gLocName = gSite.siteName && gSite.siteName !== gDevName ? gSite.siteName : (gSite.siteId || '-');

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
                '      <div class="custom-site-grid-name" style="font-weight: 700; color: #f4f4f5; font-size: 15px; font-family: monospace;" title="' + gDevName + '">' + gDevName + '</div>' +
                '      <div style="font-size: 11px; color: #38bdf8; font-weight: 600;">Site: ' + gLocName + ' (' + (gSite.siteId || '-') + ')</div>' +
                '      <div class="custom-site-grid-meta" style="font-size: 11px; color: #a1a1aa; margin-top: 2px;">' + (gSite.totalAlarms || 0) + ' alarms down | <span style="color: #a1a1aa;">' + gRegion + '</span> | <span style="color: #60a5fa; font-weight: 600;">' + gVendor + '</span></div>' +
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
            '      <th style="width: 45px; text-align: center;">NO</th>' +
            '      <th>DEVICE ID</th>' +
            '      <th>DEVICE NAME</th>' +
            '      <th>EMS NAME</th>' +
            '      <th>SITE ID</th>' +
            '      <th>REGION</th>' +
            '      <th>TOTAL OUTAGE</th>' +
            '      <th>UPTIME</th>' +
            '      <th>AVAILABILITY</th>' +
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
            var rowNo = startIdx + i + 1;
            var globalIndex = i;
            var rLabel = site.regionLabel || '-';
            var devName = site.deviceName || '-';
            var devId = site.deviceId || devName || '-';
            var emsName = site.emsName || '-';
            var siteId = site.siteId || '-';
            var siteName = site.siteName || '-';

            html += '' +
                '<tr class="custom-table-row" data-site-index="' + globalIndex + '" style="cursor: pointer;">' +
                '  <td style="text-align: center; color: #71717a; font-weight: 600;">' + rowNo + '</td>' +
                '  <td>' +
                '    <div style="color: #38bdf8; font-family: monospace; font-size: 11.5px; font-weight: 600;">' + devId + '</div>' +
                '  </td>' +
                '  <td>' +
                '    <div style="font-weight: 600; color: #f4f4f5; font-family: monospace; font-size: 13px;">' + devName + '</div>' +
                '    <div style="font-size: 11px; color: #a1a1aa;">' + (site.totalAlarms || 0) + ' alarms down</div>' +
                '  </td>' +
                '  <td>' +
                '    <span style="background: #18181b; color: #a1a1aa; border: 1px solid #27272a; padding: 2px 7px; border-radius: 4px; font-size: 11px; font-weight: 500;">' + emsName + '</span>' +
                '  </td>' +
                '  <td>' +
                '    <span style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.28); padding: 2px 7px; border-radius: 4px; font-size: 11px; font-family: monospace; font-weight: 600;">' + siteId + '</span>' +
                '  </td>' +
                '  <td style="color: #e4e4e7; font-weight: 500; font-size: 12px;">' + rLabel + '</td>' +
                '  <td style="color: ' + (site.isDown ? '#ef4444' : '#71717a') + '; font-weight: 600;">' + (site.downtimeFormatted || '0m') + '</td>' +
                '  <td style="color: #10b981; font-weight: 600;">' + (site.availableFormatted || '0m') + '</td>' +
                '  <td style="font-weight: 700; color: ' + pctColor + ';">' + pct + '%</td>' +
                '  <td style="color: #a1a1aa; font-size: 11.5px;">' + (site.lastOccurrenceStr || '-') + '</td>' +
                '</tr>';
        }

    html += '  </tbody></table>';
    }

    // RENDER AUTO PAGINATION CONTROLS (server-side)
    var startIdx = (pag.currentPage - 1) * pag.pageSize + 1;
    var endIdx = Math.min(pag.currentPage * pag.pageSize, totalItems);
    html += '<div style="display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; background: #18181b; border-top: 1px solid #27272a; font-size: 12px; color: #a1a1aa;">';
    html += '  <div>Total <b style="color: #f4f4f5;">' + totalItems + '</b> OLT devices | Page <b style="color: #f4f4f5;">' + pag.currentPage + '</b> of <b style="color: #f4f4f5;">' + totalPages + '</b></div>';
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

    // Attach Row / Grid Click for Site Detail Modal - index relative to current page
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
        '      <div class="custom-modal-subtitle">OLT Device Detail | <span style="color: #38bdf8; font-family: monospace;">' + (siteData.deviceId || '-') + '</span></div>' +
        '      <div class="custom-modal-title" style="font-family: monospace;">' + (siteData.deviceName || siteData.siteName) + '</div>' +
        '      <div style="font-size: 13px; color: #a1a1aa; margin-top: 2px;"> Site: ' + siteData.siteName + ' (' + (siteData.siteId || '-') + ') | EMS: <b style="color: #e4e4e7;">' + (siteData.emsName || '-') + '</b></div>' +
        '      <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px; flex-wrap: wrap;">' +
        '        <div class="custom-modal-date">' + DashboardState.startDate + ' - ' + DashboardState.endDate + '</div>' +
        '        <div style="font-size: 12px; color: #34d399; font-weight: 500; background: rgba(16, 185, 129, 0.12); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.3);"> On-Air: ' + (siteData.onAirStr || '-') + '</div>' +
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

    // Related Tickets container (Scrollable Framed Table)
    modalHtml += '<div class="custom-modal-tickets-section" style="margin-top: 18px; background: #141416; border: 1px solid #27272a; border-radius: 8px; padding: 12px 14px;">';
    modalHtml += '<div class="custom-modal-tickets-title" style="font-size: 12px; font-weight: 700; color: #a1a1aa; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">RELATED TICKETS <span class="custom-modal-tickets-count" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;">' + ticketsList.length + '</span></div>';

    if (ticketsList.length === 0) {
        modalHtml += '<div class="custom-modal-tickets-empty" style="padding: 14px; font-size: 12px; color: #71717a; text-align: center; background: #18181b; border: 1px dashed #27272a; border-radius: 6px;">No related tickets available for this site.</div>';
    } else {
        modalHtml += '' +
            '<div class="custom-modal-table-container" style="max-height: 200px; overflow-y: auto; overflow-x: auto; border: 1px solid #27272a; border-radius: 6px; background: #09090b;">' +
            '  <table class="custom-table" style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 0;">' +
            '    <thead style="position: sticky; top: 0; z-index: 2;">' +
            '      <tr style="background: #18181b; border-bottom: 1px solid #27272a;">' +
            '        <th style="padding: 7px 10px; font-weight: 600; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.04em;">TICKET ID</th>' +
            '        <th style="padding: 7px 10px; text-align: center; font-weight: 600; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.04em;">STATUS</th>' +
            '        <th style="padding: 7px 10px; font-weight: 600; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.04em;">ROOT CAUSE</th>' +
            '        <th style="padding: 7px 10px; font-weight: 600; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.04em;">SUB RC</th>' +
            '        <th style="padding: 7px 10px; font-weight: 600; font-size: 11px; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.04em;">TICKET TYPE</th>' +
            '        <th style="padding: 7px 10px; text-align: right; font-weight: 600; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.04em;">CREATED</th>' +
            '      </tr>' +
            '    </thead>' +
            '    <tbody>';

        for (var tk = 0; tk < ticketsList.length; tk++) {
            var ticket = ticketsList[tk];
            var bsLabel = ticket.businessstatusLabel || '-';
            var ticketTypendVal = ticket.ticketType || '-';

            modalHtml += '' +
                '<tr style="border-bottom: 1px solid #1f1f23; transition: background-color 0.15s ease;" onmouseover="this.style.backgroundColor=\'#18181b\'" onmouseout="this.style.backgroundColor=\'transparent\'">' +
                '  <td style="padding: 7px 12px; font-family: monospace; color: #38bdf8; font-weight: 600; white-space: nowrap;">' + ticket.ticketId + '</td>' +
                '  <td style="padding: 7px 12px; text-align: center; color: #d4d4d8; white-space: nowrap;">' + bsLabel + '</td>' +
                '  <td style="padding: 7px 12px; color: #e4e4e7; white-space: nowrap;">' + (ticket.rootCause || '-') + '</td>' +
                '  <td style="padding: 7px 12px; color: #a1a1aa; white-space: nowrap;">' + (ticket.subRootCause || '-') + '</td>' +
                '  <td style="padding: 7px 12px; color: #38bdf8; font-weight: 500; white-space: nowrap;">' + ticketTypendVal + '</td>' +
                '  <td style="padding: 7px 12px; text-align: right; color: #71717a; font-size: 11px; white-space: nowrap;">' + (ticket.createtimeStr || '-') + '</td>' +
                '</tr>';
        }
        modalHtml += '    </tbody></table></div>';
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
    var hasFetched = false;
    function tryInit() {
        renderFilterPanel();
        if (!hasFetched && document.getElementById('alarmTableContainer')) {
            hasFetched = true;
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

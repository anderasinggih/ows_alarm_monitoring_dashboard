/**
 * FWA Live Availability & Outage Monitoring - Pure UI Presenter (script.js)
 * Clean, production-grade architecture without dead code or AI clichés.
 */

// OWS Function Service Python Endpoint
var SERVICE_ENDPOINT = "/adc-service/rest/v1/services/gde_dashboard/alarm_monitoring_dashboard/alarm_moni_alarmgetpy";

function formatDateTimeLocal(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    var hh = String(d.getHours()).padStart(2, '0');
    var mi = String(d.getMinutes()).padStart(2, '0');
    return yyyy + "-" + mm + "-" + dd + "T" + hh + ":" + mi;
}

function getThisMonthDates() {
    var now = new Date();
    var startMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
    var endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    return {
        startDate: formatDateTimeLocal(startMonth),
        endDate: formatDateTimeLocal(endToday)
    };
}

// Global Dashboard State
var DashboardState = {
    loading: false,
    viewMode: 'list', // 'list' or 'grid'
    dailyChartType: 'line', // 'line' or 'bar'
    weeklyChartType: 'line', // 'line' or 'bar'
    dailyTrend: [],
    isThisMonthMode: true,
    allSites: [],
    searchQuery: '',
    selectedRegion: '',
    selectedVendor: '',
    kpiFilterMode: '', // '', 'active_down', 'sites_affected'
    searchDebounceTimeout: null,
    startDate: getThisMonthDates().startDate,
    endDate: getThisMonthDates().endDate,
    pagination: {
        currentPage: 1,
        pageSize: 20,
        totalSites: 0,
        totalPages: 1
    },
    summary: {
        totalAlarmsDown: 0,
        sitesAffected: 0,
        activeDownSites: 0,
        avgAvailabilityPct: "100.00",
        mostAffectedSite: "-",
        mostAffectedSiteDowntime: "0m"
    }
};

/**
 * Returns a smooth gradient color based on availability percentage:
 * 0% -> Red (#ef4444)
 * 50% -> Amber / Yellow (#f59e0b)
 * 100% -> Green (#10b981)
 */
function getAvailabilityGradientColor(val) {
    var num = parseFloat(val);
    if (isNaN(num)) return '#a1a1aa';
    if (num < 0) num = 0;
    if (num > 100) num = 100;

    // Red: rgb(239, 68, 68) -> #ef4444
    // Amber: rgb(245, 158, 11) -> #f59e0b
    // Green: rgb(16, 185, 129) -> #10b981
    var r, g, b;
    if (num <= 50) {
        var t = num / 50.0;
        r = Math.round(239 + (245 - 239) * t);
        g = Math.round(68 + (158 - 68) * t);
        b = Math.round(68 + (11 - 68) * t);
    } else {
        var t2 = (num - 50.0) / 50.0;
        r = Math.round(245 + (16 - 245) * t2);
        g = Math.round(158 + (185 - 158) * t2);
        b = Math.round(11 + (129 - 11) * t2);
    }
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function getActiveFilterLabel() {
    var html = '';
    var dateLabel = DashboardState.isThisMonthMode 
        ? ("This Month (" + DashboardState.startDate.split("T")[0] + " to " + DashboardState.endDate.split("T")[0] + ")") 
        : (DashboardState.startDate.replace("T", " ") + " to " + DashboardState.endDate.replace("T", " "));
    
    html += '<span class="custom-active-filter-badge">Window: ' + dateLabel + '</span>';

    if (DashboardState.selectedRegion) {
        html += '<span class="custom-active-filter-badge">Region: ' + DashboardState.selectedRegion + '</span>';
    }
    if (DashboardState.selectedVendor) {
        html += '<span class="custom-active-filter-badge">Vendor: ' + DashboardState.selectedVendor + '</span>';
    }
    if (DashboardState.searchQuery) {
        html += '<span class="custom-active-filter-badge">Search: "' + DashboardState.searchQuery + '"</span>';
    }
    if (DashboardState.kpiFilterMode === 'active_down') {
        html += '<span class="custom-active-filter-badge custom-filter-tag-critical">Filter: Currently Down</span>';
    } else if (DashboardState.kpiFilterMode === 'sites_affected') {
        html += '<span class="custom-active-filter-badge custom-filter-tag-warning">Filter: Impacted Only</span>';
    }

    return html;
}

function updateActiveBadge() {
    var b = document.getElementById('customActiveFilterBadge');
    if (b) b.innerHTML = getActiveFilterLabel();
}

// Inject Filter Card Panel via JS
function renderFilterPanel() {
    var filterPlaceholder = document.getElementById('customFilterPanelPlaceholder');
    if (filterPlaceholder && !document.getElementById('customStartDateInput')) {
        var html = '' +
            '<div class="custom-filter-card">' +
            '  <div class="custom-filter-title-row">' +
            '    <div class="custom-filter-title">Filter & Search</div>' +
            '    <div id="customActiveFilterBadge" class="custom-filter-tags-row">' + getActiveFilterLabel() + '</div>' +
            '  </div>' +
            '  <div class="custom-filter-row" style="display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-end;">' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Window Start</span>' +
            '      <input type="datetime-local" id="customStartDateInput" class="custom-date-input" style="color-scheme: dark;" value="' + DashboardState.startDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Window End</span>' +
            '      <input type="datetime-local" id="customEndDateInput" class="custom-date-input" style="color-scheme: dark;" value="' + DashboardState.endDate + '" />' +
            '    </div>' +
            '    <div class="custom-filter-actions">' +
            '      <button id="customApplyDateBtn" class="custom-btn-apply" type="button">Apply</button>' +
            '      <button id="customResetDateBtn" class="custom-btn-reset" type="button">Reset</button>' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Region</span>' +
            '      <select id="customRegionSelect" class="custom-select-input" style="min-width: 130px; cursor: pointer;">' +
            '        <option value="">All Regions</option>' +
            '      </select>' +
            '    </div>' +
            '    <div class="custom-filter-group">' +
            '      <span class="custom-filter-label">Vendor</span>' +
            '      <select id="customVendorSelect" class="custom-select-input" style="min-width: 130px; cursor: pointer;">' +
            '        <option value="">All Vendors</option>' +
            '      </select>' +
            '    </div>' +
            '    <div class="custom-search-container" style="flex: 1; min-width: 180px;">' +
            '      <span class="custom-filter-label">Quick Search</span>' +
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
                        alert('Window start time cannot exceed window end time.');
                        return;
                    }
                    DashboardState.isThisMonthMode = false;
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
                DashboardState.isThisMonthMode = true;
                var qMonth = getThisMonthDates();
                DashboardState.startDate = qMonth.startDate;
                DashboardState.endDate = qMonth.endDate;
                DashboardState.searchQuery = '';
                DashboardState.selectedRegion = '';
                DashboardState.selectedVendor = '';
                DashboardState.kpiFilterMode = '';
                DashboardState.pagination.currentPage = 1;

                var sInput = document.getElementById('customStartDateInput');
                var eInput = document.getElementById('customEndDateInput');
                if (sInput) sInput.value = qMonth.startDate;
                if (eInput) eInput.value = qMonth.endDate;

                var searchInput = document.getElementById('customSearchInput');
                if (searchInput) searchInput.value = '';

                var regSelect = document.getElementById('customRegionSelect');
                if (regSelect) regSelect.value = '';

                var venSelect = document.getElementById('customVendorSelect');
                if (venSelect) venSelect.value = '';

                updateKpiCardHighlight();
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
                }, 300);
            });
        }

        // KPI Card Click Filter Interactions
        var sitesAffectedCard = document.getElementById('customKpiCardSitesAffected');
        var activeDownCard = document.getElementById('customKpiCardActiveDown');
        var totalAlarmsCard = document.getElementById('customKpiCardTotalAlarms');

        if (sitesAffectedCard) {
            sitesAffectedCard.onclick = function () {
                DashboardState.kpiFilterMode = (DashboardState.kpiFilterMode === 'sites_affected') ? '' : 'sites_affected';
                updateKpiCardHighlight();
                DashboardState.pagination.currentPage = 1;
                updateActiveBadge();
                fetchDashboardData();
            };
        }

        function toggleActiveDownFilter() {
            DashboardState.kpiFilterMode = (DashboardState.kpiFilterMode === 'active_down') ? '' : 'active_down';
            updateKpiCardHighlight();
            DashboardState.pagination.currentPage = 1;
            updateActiveBadge();
            fetchDashboardData();
        }

        if (activeDownCard) activeDownCard.onclick = toggleActiveDownFilter;
        if (totalAlarmsCard) totalAlarmsCard.onclick = toggleActiveDownFilter;
    }
    return true;
}

function updateKpiCardHighlight() {
    var sitesAffectedCard = document.getElementById('customKpiCardSitesAffected');
    var activeDownCard = document.getElementById('customKpiCardActiveDown');
    var totalAlarmsCard = document.getElementById('customKpiCardTotalAlarms');

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

function unwrapOWSResult(res) {
    if (!res) return {};
    var cur = res;

    if (typeof cur === 'string') {
        try {
            cur = JSON.parse(cur);
        } catch (e) {
            try {
                var jsonified = cur
                    .replace(/'/g, '"')
                    .replace(/:\s*True\b/g, ': true')
                    .replace(/:\s*False\b/g, ': false')
                    .replace(/:\s*None\b/g, ': null');
                cur = JSON.parse(jsonified);
            } catch (e2) {}
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
            } catch (e2) {}
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

function fetchDashboardData() {
    var tableContainer = document.getElementById('alarmTableContainer');
    if (tableContainer) {
        tableContainer.innerHTML = '<div class="custom-state-notice">Connecting to OWS services and querying network telemetry...</div>';
    }

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        console.error('[OWS Error] MessageProcessor API runtime is unavailable.');
        if (tableContainer) {
            tableContainer.innerHTML = '<div class="custom-state-notice" style="color: #f43f5e;">OWS MessageProcessor runtime error.</div>';
        }
        return;
    }

    MessageProcessor.process({
        serviceId: SERVICE_ENDPOINT,
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
                var resultData = unwrapOWSResult(res);

                if (resultData && resultData.summary) {
                    DashboardState.summary = resultData.summary;
                    renderKPIStats();
                }

                if (resultData && resultData.pagination) {
                    DashboardState.pagination.currentPage = resultData.pagination.currentPage || 1;
                    DashboardState.pagination.pageSize = resultData.pagination.pageSize || 20;
                    DashboardState.pagination.totalSites = resultData.pagination.totalSites || 0;
                    DashboardState.pagination.totalPages = resultData.pagination.totalPages || 1;
                }

                var trendData = resultData.dailyTrend || [];
                DashboardState.dailyTrend = trendData;
                renderDailyTrendChart(trendData);
                renderWeeklyTrendChart(trendData);

                if (resultData && resultData.sites !== undefined) {
                    var fetchedSites = resultData.sites || [];
                    DashboardState.allSites = fetchedSites;
                    populateFilterDropdowns();
                    renderTable();
                } else {
                    if (tableContainer) {
                        tableContainer.innerHTML = '<div class="custom-state-notice" style="color: #f43f5e;">Unable to load records: Empty payload returned by server.</div>';
                    }
                }
            } catch (e) {
                console.error('[OWS Presenter Error]:', e);
            }
        },
        error: function (err) {
            console.error('[OWS Service Invocation Error]:', err);
            if (tableContainer) {
                tableContainer.innerHTML = '<div class="custom-state-notice" style="color: #f43f5e;">Failed to fetch data from backend service.</div>';
            }
        }
    });
}

function renderKPIStats() {
    var statTotal = document.getElementById('statTotalAlarms');
    var statSites = document.getElementById('statSitesAffected');
    var statActiveDown = document.getElementById('statActiveDownSites');
    var statAvail = document.getElementById('statAvgAvail');
    var statMost = document.getElementById('statMostAffected');
    var statMostDt = document.getElementById('statMostAffectedDowntime');

    var summary = DashboardState.summary || {};

    if (statTotal) statTotal.innerText = Number(summary.totalAlarmsDown || 0).toLocaleString();
    if (statSites) statSites.innerText = Number(summary.sitesAffected || 0).toLocaleString();
    if (statActiveDown) statActiveDown.innerText = Number(summary.activeDownSites || 0).toLocaleString();

    if (statAvail) {
        var avgAvailPctStr = summary.avgAvailabilityPct || '-';
        if (avgAvailPctStr === '-' || avgAvailPctStr === '') {
            statAvail.innerText = '-';
            statAvail.style.color = '#71717a';
        } else {
            statAvail.innerText = avgAvailPctStr + "%";
            statAvail.style.color = getAvailabilityGradientColor(avgAvailPctStr);
        }
    }

    if (statMost) statMost.innerText = summary.mostAffectedSite || '-';
    if (statMostDt) {
        var dtStr = summary.mostAffectedSiteDowntime || '';
        if (dtStr && dtStr !== '0m' && dtStr !== '0s' && summary.mostAffectedSite !== '-') {
            statMostDt.innerText = dtStr + ' total outage';
        } else {
            statMostDt.innerText = 'No downtime';
        }
    }
}

// ECharts Trend Renderers (Daily & Weekly)
var EChartsDailyTrendInstance = null;
var EChartsWeeklyTrendInstance = null;

function updateDailyChartLegendUI(isBar) {
    var btsInd = document.getElementById('customDailyLegendBts');
    var availInd = document.getElementById('customDailyLegendAvail');
    var lineBtn = document.getElementById('customDailyChartTypeLineBtn');
    var barBtn = document.getElementById('customDailyChartTypeBarBtn');

    if (btsInd) {
        btsInd.className = isBar ? 'custom-legend-indicator custom-indicator-bar-blue' : 'custom-legend-indicator custom-indicator-line-blue';
    }
    if (availInd) {
        availInd.className = isBar ? 'custom-legend-indicator custom-indicator-line' : 'custom-legend-indicator custom-indicator-line';
    }
    if (lineBtn && barBtn) {
        if (isBar) {
            lineBtn.classList.remove('custom-active');
            barBtn.classList.add('custom-active');
        } else {
            lineBtn.classList.add('custom-active');
            barBtn.classList.remove('custom-active');
        }
    }
}

function updateWeeklyChartLegendUI(isBar) {
    var btsInd = document.getElementById('customWeeklyLegendBts');
    var availInd = document.getElementById('customWeeklyLegendAvail');
    var lineBtn = document.getElementById('customWeeklyChartTypeLineBtn');
    var barBtn = document.getElementById('customWeeklyChartTypeBarBtn');

    if (btsInd) {
        btsInd.className = isBar ? 'custom-legend-indicator custom-indicator-bar-blue' : 'custom-legend-indicator custom-indicator-line-blue';
    }
    if (availInd) {
        availInd.className = isBar ? 'custom-legend-indicator custom-indicator-line' : 'custom-legend-indicator custom-indicator-line';
    }
    if (lineBtn && barBtn) {
        if (isBar) {
            lineBtn.classList.remove('custom-active');
            barBtn.classList.add('custom-active');
        } else {
            lineBtn.classList.add('custom-active');
            barBtn.classList.remove('custom-active');
        }
    }
}

function bindChartTypeToggleEvents() {
    var dailyWrapper = document.getElementById('customDailyChartToggleWrapper');
    if (dailyWrapper && !document.getElementById('customDailyChartTypeLineBtn')) {
        dailyWrapper.innerHTML = '' +
            '<button id="customDailyChartTypeLineBtn" class="custom-view-toggle-btn ' + (DashboardState.dailyChartType === 'line' ? 'custom-active' : '') + '" type="button">Line</button>' +
            '<button id="customDailyChartTypeBarBtn" class="custom-view-toggle-btn ' + (DashboardState.dailyChartType === 'bar' ? 'custom-active' : '') + '" type="button">Bar</button>';
    }

    var weeklyWrapper = document.getElementById('customWeeklyChartToggleWrapper');
    if (weeklyWrapper && !document.getElementById('customWeeklyChartTypeLineBtn')) {
        weeklyWrapper.innerHTML = '' +
            '<button id="customWeeklyChartTypeLineBtn" class="custom-view-toggle-btn ' + (DashboardState.weeklyChartType === 'line' ? 'custom-active' : '') + '" type="button">Line</button>' +
            '<button id="customWeeklyChartTypeBarBtn" class="custom-view-toggle-btn ' + (DashboardState.weeklyChartType === 'bar' ? 'custom-active' : '') + '" type="button">Bar</button>';
    }

    var dailyLineBtn = document.getElementById('customDailyChartTypeLineBtn');
    var dailyBarBtn = document.getElementById('customDailyChartTypeBarBtn');
    var weeklyLineBtn = document.getElementById('customWeeklyChartTypeLineBtn');
    var weeklyBarBtn = document.getElementById('customWeeklyChartTypeBarBtn');

    if (dailyLineBtn) {
        dailyLineBtn.onclick = function () {
            if (DashboardState.dailyChartType === 'line') return;
            DashboardState.dailyChartType = 'line';
            renderDailyTrendChart(DashboardState.dailyTrend);
        };
    }
    if (dailyBarBtn) {
        dailyBarBtn.onclick = function () {
            if (DashboardState.dailyChartType === 'bar') return;
            DashboardState.dailyChartType = 'bar';
            renderDailyTrendChart(DashboardState.dailyTrend);
        };
    }
    if (weeklyLineBtn) {
        weeklyLineBtn.onclick = function () {
            if (DashboardState.weeklyChartType === 'line') return;
            DashboardState.weeklyChartType = 'line';
            renderWeeklyTrendChart(DashboardState.dailyTrend);
        };
    }
    if (weeklyBarBtn) {
        weeklyBarBtn.onclick = function () {
            if (DashboardState.weeklyChartType === 'bar') return;
            DashboardState.weeklyChartType = 'bar';
            renderWeeklyTrendChart(DashboardState.dailyTrend);
        };
    }
}

function ensureEChartsLoaded(callback) {
    if (typeof echarts !== 'undefined') {
        callback();
        return;
    }

    var existingScript = document.getElementById('owsInternalEchartsScript');
    if (existingScript) {
        var checkLoaded = setInterval(function () {
            if (typeof echarts !== 'undefined') {
                clearInterval(checkLoaded);
                callback();
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
        fallbackScript.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
        fallbackScript.onload = function () { callback(); };
        document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
}

function renderDailyTrendChart(dailyData) {
    bindChartTypeToggleEvents();
    var wrapper = document.getElementById('customDailyChartCanvasWrapper');
    if (!wrapper) return;

    if (typeof echarts === 'undefined') {
        ensureEChartsLoaded(function () { renderDailyTrendChart(dailyData); });
        return;
    }

    if (EChartsDailyTrendInstance) {
        EChartsDailyTrendInstance.dispose();
        EChartsDailyTrendInstance = null;
    }

    if (!dailyData || dailyData.length === 0) {
        wrapper.innerHTML = '<div class="custom-state-notice">No daily availability data available for selected window.</div>';
        return;
    }

    var dates = [];
    var totalSitesData = [];
    var avgAvailData = [];

    for (var i = 0; i < dailyData.length; i++) {
        var item = dailyData[i];
        dates.push(item.date || '-');
        totalSitesData.push(item.total_sites || 0);
        avgAvailData.push(item.avg_availability !== undefined && item.avg_availability !== null ? item.avg_availability : null);
    }

    var isBarMode = (DashboardState.dailyChartType === 'bar');
    updateDailyChartLegendUI(isBarMode);

    wrapper.innerHTML = '';
    var chartDom = document.createElement('div');
    chartDom.style.width = '100%';
    chartDom.style.height = '290px';
    wrapper.appendChild(chartDom);

    EChartsDailyTrendInstance = echarts.init(chartDom);

    var defaultStart = dates.length > 30 ? Math.max(0, Math.floor((1 - (30 / dates.length)) * 100)) : 0;

    function calcDailyLabelStep(startPct, endPct) {
        var visibleCount = Math.max(1, Math.round(dates.length * (Math.max(1, endPct - startPct) / 100)));
        if (visibleCount <= 25) return 1;
        if (visibleCount <= 50) return 2;
        if (visibleCount <= 90) return 4;
        if (visibleCount <= 160) return 7;
        if (visibleCount <= 250) return 14;
        return 30;
    }

    function buildDailySeries(step) {
        var seriesActiveSites = [];
        var seriesAvgAvail = [];

        for (var idx = 0; idx < dates.length; idx++) {
            var isSampled = (step <= 1 || (idx % step === 0));

            var valSites = totalSitesData[idx];
            seriesActiveSites.push({
                value: valSites,
                label: (isBarMode && isSampled) ? {
                    show: true,
                    position: 'insideBottom',
                    distance: 10,
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    formatter: function (p) {
                        return p.value ? p.value.toLocaleString() : '';
                    }
                } : { show: false }
            });

            var valAvail = avgAvailData[idx];
            seriesAvgAvail.push({
                value: valAvail,
                symbol: isBarMode ? (isSampled ? 'circle' : 'none') : 'circle',
                symbolSize: isBarMode ? (isSampled ? 5 : 0) : 4,
                label: (isBarMode && isSampled) ? {
                    show: true,
                    position: 'top',
                    distance: 7,
                    color: '#10b981',
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: 'rgba(9, 9, 11, 0.85)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    borderWidth: 1,
                    borderRadius: 4,
                    padding: [2, 5],
                    formatter: function (p) {
                        return p.value !== null && p.value !== undefined ? p.value + '%' : '';
                    }
                } : { show: false }
            });
        }

        return [
            {
                name: 'Active BTS Count',
                type: isBarMode ? 'bar' : 'line',
                yAxisIndex: 0,
                data: seriesActiveSites,
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                showSymbol: false,
                barMaxWidth: 38,
                itemStyle: isBarMode ? {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#38bdf8' },
                        { offset: 1, color: '#0284c7' }
                    ]),
                    borderRadius: [4, 4, 0, 0]
                } : { color: '#38bdf8' },
                lineStyle: { color: '#38bdf8', width: 1.75 },
                areaStyle: isBarMode ? null : {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(56, 189, 248, 0.28)' },
                        { offset: 0.8, color: 'rgba(56, 189, 248, 0.04)' },
                        { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }
                    ])
                }
            },
            {
                name: 'Average Availability',
                type: 'line',
                yAxisIndex: 1,
                data: seriesAvgAvail,
                smooth: true,
                showSymbol: isBarMode ? true : false,
                itemStyle: { color: '#10b981' },
                lineStyle: { color: '#10b981', width: 2 },
                areaStyle: isBarMode ? null : {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.22)' },
                        { offset: 0.8, color: 'rgba(16, 185, 129, 0.03)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
                    ])
                }
            }
        ];
    }

    var currentDailyStep = calcDailyLabelStep(defaultStart, 100);

    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#18181b',
            borderColor: '#27272a',
            borderWidth: 1,
            textStyle: { color: '#f4f4f5', fontSize: 11.5 },
            formatter: function (params) {
                var header = '<div style="font-weight: 600; margin-bottom: 6px; color: #a1a1aa;">' + params[0].name + '</div>';
                var lines = params.map(function (p) {
                    var unit = p.seriesName.includes('Availability') ? '%' : ' sites';
                    return '<div style="display: flex; justify-content: space-between; gap: 16px; margin-top: 2px;">' +
                           '<span>' + p.marker + ' ' + p.seriesName + '</span>' +
                           '<b style="font-family: ui-monospace, SFMono-Regular, monospace; color: #fafafa;">' + (p.value !== null ? p.value + unit : '-') + '</b>' +
                           '</div>';
                }).join('');
                return header + lines;
            }
        },
        grid: {
            top: 25,
            bottom: dates.length > 30 ? 45 : 30,
            left: 55,
            right: 55
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: { lineStyle: { color: '#27272a' } },
            axisTick: { show: false },
            axisLabel: { color: '#a1a1aa', fontSize: 10.5 }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Sites',
                splitLine: { lineStyle: { color: '#27272a', type: 'dashed' } },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#a1a1aa', fontSize: 10.5 }
            },
            {
                type: 'value',
                name: 'Availability %',
                min: 80,
                max: 100,
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#a1a1aa', fontSize: 10.5, formatter: '{value}%' }
            }
        ],
        series: buildDailySeries(currentDailyStep),
        dataZoom: [
            {
                type: 'slider',
                show: dates.length > 30,
                xAxisIndex: 0,
                height: 14,
                bottom: 8,
                borderColor: '#222227',
                backgroundColor: '#121215',
                fillerColor: 'rgba(56, 189, 248, 0.15)',
                handleStyle: {
                    color: '#38bdf8',
                    borderColor: '#38bdf8'
                },
                moveHandleStyle: {
                    color: '#27272a'
                },
                textStyle: {
                    color: '#71717a',
                    fontSize: 10
                },
                brushSelect: false,
                start: defaultStart,
                end: 100
            },
            {
                type: 'inside',
                xAxisIndex: 0,
                zoomOnMouseWheel: true,
                moveOnMouseMove: true,
                moveOnMouseWheel: true
            }
        ]
    };

    EChartsDailyTrendInstance.setOption(option);

    if (isBarMode) {
        var dailyZoomDebounce = null;
        EChartsDailyTrendInstance.on('datazoom', function (params) {
            clearTimeout(dailyZoomDebounce);
            dailyZoomDebounce = setTimeout(function () {
                var s = 0;
                var e = 100;
                if (params.batch && params.batch.length > 0) {
                    s = params.batch[0].start !== undefined ? params.batch[0].start : 0;
                    e = params.batch[0].end !== undefined ? params.batch[0].end : 100;
                } else if (params.start !== undefined) {
                    s = params.start;
                    e = params.end;
                }
                var newStep = calcDailyLabelStep(s, e);
                if (newStep !== currentDailyStep) {
                    currentDailyStep = newStep;
                    EChartsDailyTrendInstance.setOption({
                        series: buildDailySeries(currentDailyStep)
                    });
                }
            }, 80);
        });
    }
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

    return {
        weekNum: getIsoWeekNumber(thuDate),
        thuDate: thuDate,
        wedDate: wedDate
    };
}

function formatDateShort(d) {
    return d.getDate() + '/' + (d.getMonth() + 1);
}

function renderWeeklyTrendChart(dailyData) {
    bindChartTypeToggleEvents();
    var wrapper = document.getElementById('customWeeklyChartCanvasWrapper');
    if (!wrapper) return;

    if (typeof echarts === 'undefined') {
        ensureEChartsLoaded(function () { renderWeeklyTrendChart(dailyData); });
        return;
    }

    if (EChartsWeeklyTrendInstance) {
        EChartsWeeklyTrendInstance.dispose();
        EChartsWeeklyTrendInstance = null;
    }

    if (!dailyData || dailyData.length === 0) {
        wrapper.innerHTML = '<div class="custom-state-notice">No weekly cycle data available.</div>';
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
        if (item.total_sites > group.maxSites) group.maxSites = item.total_sites;
        if (item.avg_availability !== null && item.avg_availability !== undefined) {
            group.sumAvail += item.avg_availability;
            group.countAvail++;
        }
    }

    var categories = [];
    var totalSitesData = [];
    var avgAvailData = [];

    for (var w = 0; w < weekOrder.length; w++) {
        var g = weekGroups[weekOrder[w]];
        categories.push(g.weekLabel + ' (' + formatDateShort(g.thuDate) + ' - ' + formatDateShort(g.wedDate) + ')');
        totalSitesData.push(g.maxSites);
        avgAvailData.push(g.countAvail > 0 ? parseFloat((g.sumAvail / g.countAvail).toFixed(2)) : null);
    }

    var isBarMode = (DashboardState.weeklyChartType === 'bar');
    updateWeeklyChartLegendUI(isBarMode);

    wrapper.innerHTML = '';
    var chartDom = document.createElement('div');
    chartDom.style.width = '100%';
    chartDom.style.height = '290px';
    wrapper.appendChild(chartDom);

    EChartsWeeklyTrendInstance = echarts.init(chartDom);

    var defaultWeeklyStart = categories.length > 12 ? Math.max(0, Math.floor((1 - (12 / categories.length)) * 100)) : 0;

    function calcWeeklyLabelStep(startPct, endPct) {
        var visibleCount = Math.max(1, Math.round(categories.length * (Math.max(1, endPct - startPct) / 100)));
        if (visibleCount <= 14) return 1;
        if (visibleCount <= 28) return 2;
        if (visibleCount <= 52) return 4;
        return 8;
    }

    function buildWeeklySeries(step) {
        var seriesActiveSites = [];
        var seriesAvgAvail = [];

        for (var idx = 0; idx < categories.length; idx++) {
            var isSampled = (step <= 1 || (idx % step === 0));

            var valSites = totalSitesData[idx];
            seriesActiveSites.push({
                value: valSites,
                label: (isBarMode && isSampled) ? {
                    show: true,
                    position: 'insideBottom',
                    distance: 10,
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                    formatter: function (p) {
                        return p.value ? p.value.toLocaleString() : '';
                    }
                } : { show: false }
            });

            var valAvail = avgAvailData[idx];
            seriesAvgAvail.push({
                value: valAvail,
                symbol: isBarMode ? (isSampled ? 'circle' : 'none') : 'circle',
                symbolSize: isBarMode ? (isSampled ? 5 : 0) : 5,
                label: (isBarMode && isSampled) ? {
                    show: true,
                    position: 'top',
                    distance: 7,
                    color: '#10b981',
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: 'rgba(9, 9, 11, 0.85)',
                    borderColor: 'rgba(16, 185, 129, 0.4)',
                    borderWidth: 1,
                    borderRadius: 4,
                    padding: [2, 5],
                    formatter: function (p) {
                        return p.value !== null && p.value !== undefined ? p.value + '%' : '';
                    }
                } : { show: false }
            });
        }

        return [
            {
                name: 'Active BTS Count',
                type: isBarMode ? 'bar' : 'line',
                yAxisIndex: 0,
                data: seriesActiveSites,
                smooth: true,
                symbol: 'circle',
                symbolSize: 5,
                showSymbol: false,
                barMaxWidth: 38,
                itemStyle: isBarMode ? {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#38bdf8' },
                        { offset: 1, color: '#0284c7' }
                    ]),
                    borderRadius: [4, 4, 0, 0]
                } : { color: '#38bdf8' },
                lineStyle: { color: '#38bdf8', width: 1.75 },
                areaStyle: isBarMode ? null : {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(56, 189, 248, 0.28)' },
                        { offset: 0.8, color: 'rgba(56, 189, 248, 0.04)' },
                        { offset: 1, color: 'rgba(56, 189, 248, 0.0)' }
                    ])
                }
            },
            {
                name: 'Average Availability',
                type: 'line',
                yAxisIndex: 1,
                data: seriesAvgAvail,
                smooth: true,
                showSymbol: isBarMode ? true : false,
                itemStyle: { color: '#10b981' },
                lineStyle: { color: '#10b981', width: 2 },
                areaStyle: isBarMode ? null : {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(16, 185, 129, 0.22)' },
                        { offset: 0.8, color: 'rgba(16, 185, 129, 0.03)' },
                        { offset: 1, color: 'rgba(16, 185, 129, 0.0)' }
                    ])
                }
            }
        ];
    }

    var currentWeeklyStep = calcWeeklyLabelStep(defaultWeeklyStart, 100);

    var option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#18181b',
            borderColor: '#27272a',
            borderWidth: 1,
            textStyle: { color: '#f4f4f5', fontSize: 11.5 }
        },
        grid: {
            top: 25,
            bottom: categories.length > 12 ? 45 : 30,
            left: 55,
            right: 55
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLine: { lineStyle: { color: '#27272a' } },
            axisTick: { show: false },
            axisLabel: { color: '#a1a1aa', fontSize: 10.5 }
        },
        yAxis: [
            {
                type: 'value',
                name: 'Sites',
                splitLine: { lineStyle: { color: '#27272a', type: 'dashed' } },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#a1a1aa', fontSize: 10.5 }
            },
            {
                type: 'value',
                name: 'Availability %',
                min: 80,
                max: 100,
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { color: '#a1a1aa', fontSize: 10.5, formatter: '{value}%' }
            }
        ],
        series: buildWeeklySeries(currentWeeklyStep),
        dataZoom: [
            {
                type: 'slider',
                show: categories.length > 12,
                xAxisIndex: 0,
                height: 14,
                bottom: 8,
                borderColor: '#222227',
                backgroundColor: '#121215',
                fillerColor: 'rgba(56, 189, 248, 0.15)',
                handleStyle: {
                    color: '#38bdf8',
                    borderColor: '#38bdf8'
                },
                moveHandleStyle: {
                    color: '#27272a'
                },
                textStyle: {
                    color: '#71717a',
                    fontSize: 10
                },
                brushSelect: false,
                start: defaultWeeklyStart,
                end: 100
            },
            {
                type: 'inside',
                xAxisIndex: 0,
                zoomOnMouseWheel: true,
                moveOnMouseMove: true,
                moveOnMouseWheel: true
            }
        ]
    };

    EChartsWeeklyTrendInstance.setOption(option);

    if (isBarMode) {
        var weeklyZoomDebounce = null;
        EChartsWeeklyTrendInstance.on('datazoom', function (params) {
            clearTimeout(weeklyZoomDebounce);
            weeklyZoomDebounce = setTimeout(function () {
                var s = 0;
                var e = 100;
                if (params.batch && params.batch.length > 0) {
                    s = params.batch[0].start !== undefined ? params.batch[0].start : 0;
                    e = params.batch[0].end !== undefined ? params.batch[0].end : 100;
                } else if (params.start !== undefined) {
                    s = params.start;
                    e = params.end;
                }
                var newStep = calcWeeklyLabelStep(s, e);
                if (newStep !== currentWeeklyStep) {
                    currentWeeklyStep = newStep;
                    EChartsWeeklyTrendInstance.setOption({
                        series: buildWeeklySeries(currentWeeklyStep)
                    });
                }
            }, 80);
        });
    }
}

window.addEventListener('resize', function () {
    if (EChartsDailyTrendInstance) EChartsDailyTrendInstance.resize();
    if (EChartsWeeklyTrendInstance) EChartsWeeklyTrendInstance.resize();
});

// Dropdown filter population
function populateFilterDropdowns() {
    var regSelect = document.getElementById('customRegionSelect');
    var venSelect = document.getElementById('customVendorSelect');
    if (!regSelect || !venSelect) return;

    var currentReg = DashboardState.selectedRegion;
    var currentVen = DashboardState.selectedVendor;
    var regions = {};
    var vendors = {};

    if (DashboardState.summary.availableRegions && DashboardState.summary.availableRegions.length > 0) {
        DashboardState.summary.availableRegions.forEach(function (r) { regions[r] = true; });
    } else {
        DashboardState.allSites.forEach(function (s) {
            if (s.regionLabel && s.regionLabel !== '-') regions[s.regionLabel] = true;
        });
    }

    if (DashboardState.summary.availableVendors && DashboardState.summary.availableVendors.length > 0) {
        DashboardState.summary.availableVendors.forEach(function (v) { vendors[v] = true; });
    } else {
        DashboardState.allSites.forEach(function (s) {
            if (s.vendorLabel && s.vendorLabel !== '-') vendors[s.vendorLabel] = true;
        });
    }

    var regHtml = '<option value="">All Regions</option>';
    Object.keys(regions).sort().forEach(function (r) {
        regHtml += '<option value="' + r + '" ' + (r === currentReg ? 'selected' : '') + '>' + r + '</option>';
    });
    regSelect.innerHTML = regHtml;

    var venHtml = '<option value="">All Vendors</option>';
    Object.keys(vendors).sort().forEach(function (v) {
        venHtml += '<option value="' + v + '" ' + (v === currentVen ? 'selected' : '') + '>' + v + '</option>';
    });
    venSelect.innerHTML = venHtml;
}

// Render Table (List View & Grid View)
function renderTable() {
    var tableContainer = document.getElementById('alarmTableContainer');
    if (!tableContainer) return;

    var pageItems = DashboardState.allSites || [];
    var pag = DashboardState.pagination;
    var totalItems = pag.totalSites || pageItems.length;
    var totalPages = pag.totalPages || 1;
    var startIdx = (pag.currentPage - 1) * pag.pageSize;

    var html = '' +
        '<div class="custom-panel-table-header">' +
        '  <div>' +
        '    <span class="custom-panel-table-title">Site Availability & Fault Records</span>' +
        '    <span class="custom-panel-table-subtitle">(Sorted by incident priority)</span>' +
        '  </div>' +
        '  <div class="custom-view-toggle-group">' +
        '    <button id="customListViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'list' ? 'custom-active' : '') + '">List</button>' +
        '    <button id="customGridViewBtn" class="custom-view-toggle-btn ' + (DashboardState.viewMode === 'grid' ? 'custom-active' : '') + '">Grid</button>' +
        '  </div>' +
        '</div>';

    if (DashboardState.viewMode === 'grid') {
        html += '<div class="custom-sites-grid-container">';
        for (var g = 0; g < pageItems.length; g++) {
            var gSite = pageItems[g];
            var gPct = gSite.availRatePct || "100.00";
            var gColor = getAvailabilityGradientColor(gPct);

            html += '' +
                '<div class="custom-site-grid-card custom-table-row" data-site-index="' + g + '">' +
                '  <div class="custom-site-grid-header">' +
                '    <div style="min-width: 0; flex: 1;">' +
                '      <div class="custom-site-grid-name" title="' + gSite.siteName + '">' + gSite.siteName + '</div>' +
                '      <div class="custom-site-grid-meta">' +
                '        <span class="custom-site-id-badge">' + (gSite.siteId || '-') + '</span>' +
                '        <span>' + (gSite.regionLabel || '-') + '</span>' +
                '      </div>' +
                '    </div>' +
                '    <div class="custom-avail-badge" style="color: ' + gColor + ';">' + gPct + '%</div>' +
                '  </div>' +
                '  <div class="custom-avail-bar-wrapper">' +
                '    <div class="custom-avail-bar-inner" style="width: ' + gPct + '%; background-color: ' + gColor + ';"></div>' +
                '  </div>' +
                '  <div class="custom-site-grid-footer">' +
                '    <div>Down: <b style="color: ' + (gSite.isDown ? '#ef4444' : '#f4f4f5') + ';">' + (gSite.downtimeFormatted || '0m') + '</b></div>' +
                '    <div>Avail: <b style="color: ' + gColor + ';">' + (gSite.availableFormatted || '0m') + '</b></div>' +
                '  </div>' +
                '</div>';
        }
        html += '</div>';
    } else {
        html += '' +
            '<table class="custom-table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th style="width: 45px; text-align: center;">No</th>' +
            '      <th>Site Name</th>' +
            '      <th>Site ID</th>' +
            '      <th>Region</th>' +
            '      <th>Vendor</th>' +
            '      <th>Total Outage</th>' +
            '      <th>Uptime</th>' +
            '      <th>Availability</th>' +
            '      <th>Last Occurrence</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>';

        for (var i = 0; i < pageItems.length; i++) {
            var site = pageItems[i];
            var pct = site.availRatePct || "100.00";
            var pctColor = getAvailabilityGradientColor(pct);

            var rowNo = startIdx + i + 1;

            html += '' +
                '<tr class="custom-table-row" data-site-index="' + i + '">' +
                '  <td style="text-align: center; color: #71717a; font-size: 11.5px;">' + rowNo + '</td>' +
                '  <td>' +
                '    <div style="font-weight: 600; color: #ededf0;">' + site.siteName + '</div>' +
                '    <div style="font-size: 11px; color: #71717a;">' + (site.totalAlarms || 0) + ' faults recorded</div>' +
                '  </td>' +
                '  <td><span class="custom-site-id-badge">' + (site.siteId || '-') + '</span></td>' +
                '  <td style="color: #7d8590; font-size: 12px;">' + (site.regionLabel || '-') + '</td>' +
                '  <td style="color: #7d8590; font-size: 12px;">' + (site.vendorLabel || '-') + '</td>' +
                '  <td style="color: ' + (site.isDown ? '#f43f5e' : '#ededf0') + '; font-weight: 600;">' + (site.downtimeFormatted || '0m') + '</td>' +
                '  <td style="color: #10b981; font-weight: 500;">' + (site.availableFormatted || '0m') + '</td>' +
                '  <td style="font-weight: 700; color: ' + pctColor + ';">' + pct + '%</td>' +
                '  <td style="color: #82828e; font-size: 11.5px;">' + (site.lastOccurrenceStr || '-') + '</td>' +
                '</tr>';
        }
        html += '  </tbody></table>';
    }

    // Pagination controls
    html += '' +
        '<div class="custom-pagination-bar">' +
        '  <div>Total <b style="color: #ededf0;">' + totalItems.toLocaleString() + '</b> monitored sites | Page <b style="color: #ededf0;">' + pag.currentPage + '</b> of <b style="color: #ededf0;">' + totalPages + '</b></div>' +
        '  <div class="custom-pagination-actions">' +
        '    <span>Rows:</span>' +
        '    <select id="customPageSizeSelect" class="custom-page-size-select">';
    [10, 20, 50].forEach(function (size) {
        html += '<option value="' + size + '" ' + (pag.pageSize === size ? 'selected' : '') + '>' + size + '</option>';
    });
    html += '</select>' +
        '    <button id="customPrevPageBtn" class="custom-pag-btn" ' + (pag.currentPage === 1 ? 'disabled' : '') + '>Previous</button>' +
        '    <button id="customNextPageBtn" class="custom-pag-btn" ' + (pag.currentPage === totalPages ? 'disabled' : '') + '>Next</button>' +
        '  </div>' +
        '</div>';

    tableContainer.innerHTML = html;

    // View toggle listeners
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

    // Row Click Listener for Detail Modal
    var rows = tableContainer.querySelectorAll('.custom-table-row');
    rows.forEach(function (row) {
        row.addEventListener('click', function () {
            var idx = parseInt(this.getAttribute('data-site-index'), 10);
            if (!isNaN(idx) && DashboardState.allSites[idx]) {
                openSiteDetailModal(DashboardState.allSites[idx]);
            }
        });
    });

    // Pagination Click Listeners
    var sizeSelect = document.getElementById('customPageSizeSelect');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function () {
            pag.pageSize = parseInt(this.value, 10) || 20;
            pag.currentPage = 1;
            fetchDashboardData();
        });
    }

    var prevBtn = document.getElementById('customPrevPageBtn');
    if (prevBtn && pag.currentPage > 1) {
        prevBtn.addEventListener('click', function () {
            pag.currentPage--;
            fetchDashboardData();
        });
    }

    var nextBtn = document.getElementById('customNextPageBtn');
    if (nextBtn && pag.currentPage < totalPages) {
        nextBtn.addEventListener('click', function () {
            pag.currentPage++;
            fetchDashboardData();
        });
    }
}

// Site Detail Modal
function openSiteDetailModal(siteData) {
    var modalContainer = document.getElementById('customSiteDetailModal');
    if (!modalContainer) return;

    var alarmsList = siteData.alarms || [];
    var ticketsList = siteData.tickets || [];

    var availPctVal = siteData.availRatePct || '100.00';
    var availColor = getAvailabilityGradientColor(availPctVal);

    var modalHtml = '' +
        '<div class="custom-modal-dialog">' +
        '  <div class="custom-modal-header">' +
        '    <div>' +
        '      <div class="custom-modal-tag">Site Diagnostic Detail</div>' +
        '      <h2 class="custom-modal-title">' + siteData.siteName + '</h2>' +
        '      <div class="custom-modal-meta">' +
        '        <span>ID: <b style="color: #38bdf8;">' + (siteData.siteId || '-') + '</b></span>' +
        '        <span>•</span>' +
        '        <span>Region: <b style="color: #f4f4f5;">' + (siteData.regionLabel || '-') + '</b></span>' +
        '        <span>•</span>' +
        '        <span>Vendor: <b style="color: #f4f4f5;">' + (siteData.vendorLabel || '-') + '</b></span>' +
        '        <span>•</span>' +
        '        <span class="custom-onair-tag">On-Air: ' + (siteData.onAirStr || '-') + '</span>' +
        '      </div>' +
        '    </div>' +
        '    <button id="customCloseModalBtn" class="custom-modal-close-btn" title="Close (Esc)" aria-label="Close">&#10005;</button>' +
        '  </div>' +
        '' +
        '  <div class="custom-modal-metrics">' +
        '    <div class="custom-modal-metric-item">' +
        '      <span class="custom-metric-label">Total Outage Duration</span>' +
        '      <span class="custom-metric-val" style="color: #ef4444;">' + (siteData.downtimeFormatted || '0m') + '</span>' +
        '    </div>' +
        '    <div class="custom-modal-metric-item">' +
        '      <span class="custom-metric-label">Operational Uptime</span>' +
        '      <span class="custom-metric-val" style="color: #10b981;">' + (siteData.availableFormatted || '0m') + '</span>' +
        '    </div>' +
        '    <div class="custom-modal-metric-item">' +
        '      <span class="custom-metric-label">Availability Rate</span>' +
        '      <span class="custom-metric-val" style="color: ' + availColor + ';">' + availPctVal + '%</span>' +
        '      <div class="custom-modal-progress-bar">' +
        '        <div class="custom-modal-progress-fill" style="width: ' + availPctVal + '%; background-color: ' + availColor + ';"></div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '' +
        '  <div class="custom-modal-tabs-header">' +
        '    <button class="custom-modal-tab-btn custom-tab-active" data-tab-target="tabAlarms">' +
        '      <span>Alarm Events</span>' +
        '      <span class="custom-modal-tab-badge">' + alarmsList.length + '</span>' +
        '    </button>' +
        '    <button class="custom-modal-tab-btn" data-tab-target="tabTickets">' +
        '      <span>Associated Trouble Tickets</span>' +
        '      <span class="custom-modal-tab-badge">' + ticketsList.length + '</span>' +
        '    </button>' +
        '  </div>' +
        '' +
        '  <div id="tabAlarms" class="custom-modal-tab-pane custom-pane-active">';

    if (alarmsList.length === 0) {
        modalHtml += '<div class="custom-modal-empty-notice">No discrete alarms recorded in this operational window.</div>';
    } else {
        modalHtml += '<div class="custom-modal-table-container">' +
            '<table class="custom-table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th>Alarm Description</th>' +
            '      <th style="text-align: center; white-space: nowrap;">First Occurred</th>' +
            '      <th style="text-align: center; white-space: nowrap;">Cleared Time</th>' +
            '      <th style="text-align: right; white-space: nowrap;">Fault Duration</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>';
        alarmsList.forEach(function (alarm) {
            modalHtml += '' +
                '<tr>' +
                '  <td style="color: #f4f4f5; font-weight: 500;">' + alarm.alarmName + '</td>' +
                '  <td style="text-align: center; color: #a1a1aa; font-variant-numeric: tabular-nums;">' + alarm.occurStr + '</td>' +
                '  <td style="text-align: center; color: #a1a1aa; font-variant-numeric: tabular-nums;">' + alarm.clearStr + '</td>' +
                '  <td style="text-align: right; color: #f4f4f5; font-weight: 600; font-variant-numeric: tabular-nums;">' + alarm.durationFormatted + '</td>' +
                '</tr>';
        });
        modalHtml += '</tbody></table></div>';
    }
    modalHtml += '  </div>';

    // Tab 2: Trouble Tickets Pane
    modalHtml += '  <div id="tabTickets" class="custom-modal-tab-pane">';
    if (ticketsList.length === 0) {
        modalHtml += '<div class="custom-modal-empty-notice">No correlated trouble tickets found for this site.</div>';
    } else {
        modalHtml += '<div class="custom-modal-table-container">' +
            '<table class="custom-table">' +
            '  <thead>' +
            '    <tr>' +
            '      <th style="white-space: nowrap; min-width: 170px;">Ticket ID</th>' +
            '      <th style="white-space: nowrap;">Status</th>' +
            '      <th>Root Cause</th>' +
            '      <th>Sub Root Cause</th>' +
            '      <th>Type</th>' +
            '      <th style="text-align: right; white-space: nowrap; min-width: 150px;">Created</th>' +
            '    </tr>' +
            '  </thead>' +
            '  <tbody>';

        ticketsList.forEach(function (tk) {
            modalHtml += '' +
                '<tr>' +
                '  <td style="white-space: nowrap;"><span class="custom-site-id-badge">' + (tk.ticketId || '-') + '</span></td>' +
                '  <td style="white-space: nowrap;">' + (tk.businessstatusLabel || '-') + '</td>' +
                '  <td>' + (tk.rootCause || '-') + '</td>' +
                '  <td>' + (tk.subRootCause || '-') + '</td>' +
                '  <td>' + (tk.ticketType || '-') + '</td>' +
                '  <td style="text-align: right; white-space: nowrap; color: #a1a1aa; font-variant-numeric: tabular-nums;">' + (tk.createtimeStr || '-') + '</td>' +
                '</tr>';
        });
        modalHtml += '</tbody></table></div>';
    }
    modalHtml += '  </div>';

    modalHtml += '' +
        '  <div class="custom-modal-footer">' +
        '    <span>' + alarmsList.length + ' alarms • ' + ticketsList.length + ' tickets</span>' +
        '    <span style="font-size: 11px; color: #71717a;">Press <kbd style="background: #1a1a1e; border: 1px solid #282830; padding: 1px 4px; border-radius: 3px; font-family: monospace;">Esc</kbd> or click backdrop to close</span>' +
        '  </div>' +
        '</div>';

    modalContainer.innerHTML = modalHtml;
    modalContainer.style.setProperty('display', 'flex', 'important');

    // Wire Tab Switcher
    var tabButtons = modalContainer.querySelectorAll('.custom-modal-tab-btn');
    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = this.getAttribute('data-tab-target');
            tabButtons.forEach(function (b) { b.classList.remove('custom-tab-active'); });
            var panes = modalContainer.querySelectorAll('.custom-modal-tab-pane');
            panes.forEach(function (p) { p.classList.remove('custom-pane-active'); });

            this.classList.add('custom-tab-active');
            var targetPane = document.getElementById(targetId);
            if (targetPane) targetPane.classList.add('custom-pane-active');
        });
    });

    function closeModal() {
        modalContainer.style.setProperty('display', 'none', 'important');
        modalContainer.innerHTML = '';
        window.removeEventListener('keydown', handleEscKey);
    }

    function handleEscKey(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeModal();
        }
    }

    var closeBtn = document.getElementById('customCloseModalBtn');
    if (closeBtn) closeBtn.onclick = closeModal;
    modalContainer.onclick = function (e) {
        if (e.target === modalContainer) closeModal();
    };
    window.addEventListener('keydown', handleEscKey);
}

// Lifecycle Initializer
(function initDashboardLifecycle() {
    function tryInit() {
        bindChartTypeToggleEvents();
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

    // Auto-refresh interval (5 minutes)
    setInterval(function () {
        if (!DashboardState.loading) fetchDashboardData();
    }, 300000);

    // Fallback retries in case OWS runtime renders DOM container with slight delay
    setTimeout(tryInit, 50);
    setTimeout(tryInit, 300);
    setTimeout(tryInit, 1000);
})();

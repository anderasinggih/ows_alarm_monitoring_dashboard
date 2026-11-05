var SERVICE_ENDPOINT = "/adc-service/rest/v1/services/gde_dashboard/olt_availability_dashboard/olt_avail_siteavail_summary_sc";

var safeJsonParse = function (str) { try { return JSON.parse(str); } catch (e) { return str; } };

function formatDateLocal(d) {
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var dd = String(d.getDate());
    if (dd.length < 2) dd = "0" + dd;
    return yyyy + "-" + mm + "-" + dd;
}

function getDefaultDateRange() {
    var today = new Date();
    var todayStr = formatDateLocal(today);
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1);
    if (mm.length < 2) mm = "0" + mm;
    var startOfMonth = yyyy + "-" + mm + "-01";
    return { startDate: startOfMonth, endDate: todayStr };
}

function formatMinutes(totalMin) {
    if (!totalMin || totalMin <= 0) return '0m';
    var h = Math.floor(totalMin / 60);
    var m = Math.round(totalMin % 60);
    if (h > 0 && m > 0) return h + 'h ' + m + 'm';
    if (h > 0) return h + 'h';
    return m + 'm';
}

function getAvailColor(pct) {
    if (pct === null || pct === undefined || isNaN(pct)) return '#71717a';
    var val = Math.max(0, Math.min(100, parseFloat(pct))) / 100;

    var r, g, b;
    if (val < 0.5) {
        var t = val / 0.5;
        r = Math.round(239 + (234 - 239) * t);
        g = Math.round(68 + (179 - 68) * t);
        b = Math.round(68 + (8 - 68) * t);
    } else {
        var t2 = (val - 0.5) / 0.5;
        r = Math.round(234 + (52 - 234) * t2);
        g = Math.round(179 + (211 - 179) * t2);
        b = Math.round(8 + (153 - 8) * t2);
    }

    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

var defaults = getDefaultDateRange();
var DashboardState = {
    startDate: defaults.startDate,
    endDate: defaults.endDate,
    selectedRegion: '',
    selectedVendor: '',
    searchQuery: '',
    searchDebounceTimer: null,
    pagination: {
        currentPage: 1,
        pageSize: 20,
        totalSites: 0,
        totalPages: 1
    }
};

function getActiveBadgeHtml() {
    var html = '<span class="custom-local-active-filter-badge">Active: ' + DashboardState.startDate + ' – ' + DashboardState.endDate + '</span>';
    if (DashboardState.selectedRegion) {
        html += '<span class="custom-local-active-filter-badge">Region: ' + DashboardState.selectedRegion + '</span>';
    }
    if (DashboardState.selectedVendor) {
        html += '<span class="custom-local-active-filter-badge">Vendor: ' + DashboardState.selectedVendor + '</span>';
    }
    if (DashboardState.searchQuery) {
        html += '<span class="custom-local-active-filter-badge">Search: "' + DashboardState.searchQuery + '"</span>';
    }
    return html;
}

function updateActiveBadge() {
    var el = document.getElementById('localActiveFilterBadge');
    if (el) el.innerHTML = getActiveBadgeHtml();
}

function renderFilterPanel() {
    var placeholder = document.getElementById('localFilterPanelPlaceholder');
    if (!placeholder || document.getElementById('localStartDateInput')) return;

    var html =
        '<div class="custom-local-filter-card">' +
        '  <div class="custom-local-filter-title-row">' +
        '    <div class="custom-local-filter-title">Date Range & Filters</div>' +
        '    <div id="localActiveFilterBadge" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">' + getActiveBadgeHtml() + '</div>' +
        '  </div>' +
        '  <div class="custom-local-filter-row">' +
        '    <div class="custom-local-filter-group">' +
        '      <span class="custom-local-filter-label">Start Date</span>' +
        '      <input type="date" id="localStartDateInput" class="custom-local-date-input" value="' + DashboardState.startDate + '" />' +
        '    </div>' +
        '    <div class="custom-local-filter-group">' +
        '      <span class="custom-local-filter-label">End Date</span>' +
        '      <input type="date" id="localEndDateInput" class="custom-local-date-input" value="' + DashboardState.endDate + '" />' +
        '    </div>' +
        '    <div class="custom-local-filter-actions">' +
        '      <button id="localApplyBtn" class="custom-local-btn-apply">Apply Filter</button>' +
        '      <button id="localResetBtn" class="custom-local-btn-reset">Reset</button>' +
        '    </div>' +
        '    <div class="custom-local-filter-group">' +
        '      <span class="custom-local-filter-label">Region</span>' +
        '      <select id="localRegionSelect" class="custom-local-date-input" style="min-width: 140px; cursor: pointer;">' +
        '        <option value="">All Regions</option>' +
        '      </select>' +
        '    </div>' +
        '    <div class="custom-local-filter-group">' +
        '      <span class="custom-local-filter-label">Vendor</span>' +
        '      <select id="localVendorSelect" class="custom-local-date-input" style="min-width: 130px; cursor: pointer;">' +
        '        <option value="">All Vendors</option>' +
        '      </select>' +
        '    </div>' +
        '    <div class="custom-local-search-container">' +
        '      <span class="custom-local-filter-label">Search Site</span>' +
        '      <input type="text" id="localSearchInput" class="custom-local-search-input" placeholder="Search site name or site ID..." />' +
        '    </div>' +
        '  </div>' +
        '</div>';

    placeholder.innerHTML = html;

    document.getElementById('localApplyBtn').addEventListener('click', function () {
        var s = document.getElementById('localStartDateInput').value;
        var e = document.getElementById('localEndDateInput').value;
        if (s && e) {
            if (s > e) {
                alert('Start Date cannot be greater than End Date!');
                return;
            }
            DashboardState.startDate = s;
            DashboardState.endDate = e;
            DashboardState.pagination.currentPage = 1;
            updateActiveBadge();
            fetchData();
        }
    });

    document.getElementById('localResetBtn').addEventListener('click', function () {
        var d = getDefaultDateRange();
        DashboardState.startDate = d.startDate;
        DashboardState.endDate = d.endDate;
        DashboardState.selectedRegion = '';
        DashboardState.selectedVendor = '';
        DashboardState.searchQuery = '';
        DashboardState.pagination.currentPage = 1;

        document.getElementById('localStartDateInput').value = d.startDate;
        document.getElementById('localEndDateInput').value = d.endDate;
        document.getElementById('localRegionSelect').value = '';
        document.getElementById('localVendorSelect').value = '';
        document.getElementById('localSearchInput').value = '';

        updateActiveBadge();
        fetchData();
    });

    document.getElementById('localRegionSelect').addEventListener('change', function () {
        DashboardState.selectedRegion = this.value;
        DashboardState.pagination.currentPage = 1;
        updateActiveBadge();
        fetchData();
    });

    document.getElementById('localVendorSelect').addEventListener('change', function () {
        DashboardState.selectedVendor = this.value;
        DashboardState.pagination.currentPage = 1;
        updateActiveBadge();
        fetchData();
    });

    document.getElementById('localSearchInput').addEventListener('input', function () {
        var val = this.value;
        if (DashboardState.searchDebounceTimer) clearTimeout(DashboardState.searchDebounceTimer);
        DashboardState.searchDebounceTimer = setTimeout(function () {
            DashboardState.searchQuery = val;
            DashboardState.pagination.currentPage = 1;
            updateActiveBadge();
            fetchData();
        }, 300);
    });
}

function populateDropdowns(availableRegions, availableVendors) {
    var regSel = document.getElementById('localRegionSelect');
    var venSel = document.getElementById('localVendorSelect');
    if (!regSel || !venSel) return;

    var prevRegion = DashboardState.selectedRegion;
    var prevVendor = DashboardState.selectedVendor;

    regSel.innerHTML = '<option value="">All Regions</option>';
    for (var i = 0; i < availableRegions.length; i++) {
        var o = document.createElement('option');
        o.value = availableRegions[i];
        o.textContent = availableRegions[i];
        if (availableRegions[i] === prevRegion) o.selected = true;
        regSel.appendChild(o);
    }

    venSel.innerHTML = '<option value="">All Vendors</option>';
    for (var j = 0; j < availableVendors.length; j++) {
        var ov = document.createElement('option');
        ov.value = availableVendors[j];
        ov.textContent = availableVendors[j];
        if (availableVendors[j] === prevVendor) ov.selected = true;
        venSel.appendChild(ov);
    }
}

function renderRegionSummary(regList, hasData) {
    var container = document.getElementById('localRegionSummaryContainer');
    if (!container) return;

    if (!regList || regList.length === 0) {
        container.innerHTML = '<div style="color: #a1a1aa; padding: 24px; text-align: center;">No regional data available.</div>';
        return;
    }

    var rowsHtml = '';
    for (var i = 0; i < regList.length; i++) {
        var r = regList[i];
        var availPct = (hasData && r.avgAvailabilityPct !== null) ? parseFloat(r.avgAvailabilityPct) : null;
        var availColor = getAvailColor(availPct);
        var availLabel = availPct !== null ? availPct.toFixed(1) + '%' : '-';

        var barFill = availPct !== null
            ? '<div class="custom-local-avail-bar-bg"><div class="custom-local-avail-bar-fill" style="width:' + availPct + '%; background-color:' + availColor + ';"></div></div>'
            : '<div class="custom-local-avail-bar-bg"></div>';

        var downtimeStr = (hasData && r.downtime_minutes > 0) ? formatMinutes(r.downtime_minutes) : '-';
        var availableStr = (hasData && r.available_minutes > 0) ? formatMinutes(r.available_minutes) : '-';
        var affSitesStr = (hasData && r.sitesWithDowntime > 0) ? r.sitesWithDowntime : '0';

        rowsHtml +=
            '<tr>' +
            '<td style="font-weight: 600; color: #f4f4f5;">' + r.region_name + '</td>' +
            '<td style="color: #a1a1aa;">' + r.totalSites + '</td>' +
            '<td style="color: #f87171; font-weight: 500;">' + affSitesStr + '</td>' +
            '<td style="color: #f87171;">' + downtimeStr + '</td>' +
            '<td style="color: #34d399;">' + availableStr + '</td>' +
            '<td>' +
            '  <div class="custom-local-avail-bar-wrapper">' +
            '    ' + barFill +
            '    <span class="custom-local-avail-label" style="color: ' + availColor + ';">' + availLabel + '</span>' +
            '  </div>' +
            '</td>' +
            '</tr>';
    }

    container.innerHTML =
        '<table class="custom-local-table">' +
        '  <thead><tr>' +
        '    <th>REGION</th><th>TOTAL SITES</th><th>AFFECTED SITES</th>' +
        '    <th>TOTAL DOWNTIME</th><th>AVAILABLE TIME</th><th>AVG AVAILABILITY</th>' +
        '  </tr></thead>' +
        '  <tbody>' + rowsHtml + '</tbody>' +
        '</table>';
}

function renderKPI(summary) {
    var totalSites = document.getElementById('localStatTotalSites');
    var normalSites = document.getElementById('localStatNormalSites');
    var avgAvail = document.getElementById('localStatAvgAvail');
    var sitesAff = document.getElementById('localStatSitesAffected');
    var mostAffected = document.getElementById('localStatMostAffected');
    var mostDowntime = document.getElementById('localStatMostAffectedDowntime');

    var totCount = summary.totalSites || 0;
    var hasData = summary.hasData === true;

    if (totalSites) totalSites.innerText = totCount;

    if (normalSites) {
        if (!hasData || summary.sitesWithDowntime === null) {
            normalSites.innerText = '-';
            normalSites.style.color = '#71717a';
        } else {
            var normCount = Math.max(0, totCount - summary.sitesWithDowntime);
            normalSites.innerText = normCount;
            normalSites.style.color = '#34d399';
        }
    }

    if (sitesAff) {
        if (!hasData || summary.sitesWithDowntime === null) {
            sitesAff.innerText = '-';
            sitesAff.style.color = '#71717a';
        } else {
            sitesAff.innerText = summary.sitesWithDowntime;
            sitesAff.style.color = '#f87171';
        }
    }

    if (avgAvail) {
        var pct = summary.avgAvailabilityPct;
        if (!hasData || pct === null || pct === undefined) {
            avgAvail.innerText = '-';
            avgAvail.style.color = '#71717a';
        } else {
            avgAvail.innerText = pct.toFixed(1) + '%';
            avgAvail.style.color = getAvailColor(pct);
        }
    }

    if (mostAffected) {
        if (!hasData || !summary.mostAffectedSite || summary.mostAffectedSite === '-') {
            mostAffected.innerText = '-';
        } else {
        mostAffected.innerText = summary.mostAffectedSite;
        }
    }

    if (mostDowntime) {
        if (!hasData || !summary.mostAffectedSite || summary.mostAffectedSite === '-') {
            mostDowntime.innerText = '-';
        } else {
            var dtStr = summary.mostAffectedSiteDowntime > 0 ? (formatMinutes(summary.mostAffectedSiteDowntime) + ' downtime') : '0m downtime';
            if (summary.mostAffectedSiteAvail !== null && summary.mostAffectedSiteAvail !== undefined) {
                var aVal = parseFloat(summary.mostAffectedSiteAvail);
                var aCol = getAvailColor(aVal);
                mostDowntime.innerHTML = '<span style="color:' + aCol + '; font-weight:600; margin-right:6px;">' + aVal.toFixed(1) + '%</span> <span style="color:#a1a1aa;">(' + dtStr + ')</span>';
            } else {
                mostDowntime.innerText = dtStr;
            }
        }
    }
}

function renderTable(sites, pagination) {
    var container = document.getElementById('localTableContainer');
    if (!container) return;

    if (!sites || sites.length === 0) {
        container.innerHTML = '<div style="color: #a1a1aa; padding: 36px; text-align: center;">No site availability records found for the selected filters.</div>';
        return;
    }

    var startIdx = ((pagination.currentPage || 1) - 1) * (pagination.pageSize || 20);
    var rowsHtml = '';

    for (var i = 0; i < sites.length; i++) {
        var s = sites[i];
        var no = startIdx + i + 1;

        var availPct = s.site_availability !== null && s.site_availability !== undefined
            ? parseFloat(s.site_availability)
            : null;
        var availColor = getAvailColor(availPct);
        var availStr = availPct !== null ? availPct.toFixed(1) + '%' : '-';

        var downtimeStr = s.downtime_minutes > 0 ? formatMinutes(s.downtime_minutes) : '-';
        var availableStr = s.available_minutes !== null ? formatMinutes(s.available_minutes) : '-';

        var barFill = availPct !== null
            ? '<div class="custom-local-avail-bar-bg"><div class="custom-local-avail-bar-fill" style="width:' + availPct + '%; background-color:' + availColor + ';"></div></div>'
            : '<div class="custom-local-avail-bar-bg"></div>';

        rowsHtml +=
            '<tr class="custom-local-clickable-row" data-site-id="' + (s.site_id || '') + '">' +
            '<td style="color: #71717a; font-weight: 500;">' + no + '</td>' +
            '<td style="font-weight: 600; color: #f4f4f5;">' + (s.site_name || '-') + '</td>' +
            '<td style="color: #a1a1aa; font-family: monospace;">' + (s.site_id || '-') + '</td>' +
            '<td><span class="custom-local-badge-region">' + (s.region_name || '-') + '</span></td>' +
            '<td><span class="custom-local-badge-vendor">' + (s.vendor_name || '-') + '</span></td>' +
            '<td>' +
            '  <div class="custom-local-avail-bar-wrapper">' +
            '    ' + barFill +
            '    <span class="custom-local-avail-label" style="color: ' + availColor + ';">' + availStr + '</span>' +
            '  </div>' +
            '</td>' +
            '<td style="color: ' + (s.downtime_minutes > 0 ? '#f87171' : '#71717a') + ';">' + downtimeStr + '</td>' +
            '<td style="color: #34d399;">' + availableStr + '</td>' +
            '</tr>';
    }

    var totalSites = pagination.totalSites || sites.length;
    var totalPages = pagination.totalPages || 1;
    var curPage = pagination.currentPage || 1;

    var startRange = totalSites > 0 ? startIdx + 1 : 0;
    var endRange = Math.min(startIdx + (pagination.pageSize || 20), totalSites);

    var paginationHtml =
        '<div class="custom-local-pagination-container">' +
        '  <div style="display: flex; align-items: center; gap: 12px;">' +
        '    <span>Showing <strong style="color: #f4f4f5;">' + startRange + '–' + endRange + '</strong> of <strong style="color: #f4f4f5;">' + totalSites + '</strong> sites</span>' +
        '    <select id="localPageSizeSelect" class="custom-local-date-input" style="width: auto; padding: 4px 8px; font-size: 12px;">' +
        '      <option value="10"' + (pagination.pageSize === 10 ? ' selected' : '') + '>10 / page</option>' +
        '      <option value="20"' + (pagination.pageSize === 20 ? ' selected' : '') + '>20 / page</option>' +
        '      <option value="50"' + (pagination.pageSize === 50 ? ' selected' : '') + '>50 / page</option>' +
        '      <option value="100"' + (pagination.pageSize === 100 ? ' selected' : '') + '>100 / page</option>' +
        '    </select>' +
        '  </div>' +
        '  <div class="custom-local-pagination-controls">' +
        '    <button class="custom-local-pagination-btn" id="localPrevBtn"' + (curPage <= 1 ? ' disabled' : '') + '>Previous</button>' +
        '    <span class="custom-local-page-info">Page ' + curPage + ' of ' + totalPages + '</span>' +
        '    <button class="custom-local-pagination-btn" id="localNextBtn"' + (curPage >= totalPages ? ' disabled' : '') + '>Next</button>' +
        '  </div>' +
        '</div>';

    container.innerHTML =
        '<table class="custom-local-table">' +
        '  <thead><tr>' +
        '    <th>NO</th><th>SITE NAME</th><th>SITE ID</th><th>REGION</th><th>VENDOR</th>' +
        '    <th>AVAILABILITY</th><th>DOWNTIME</th><th>AVAILABLE TIME</th>' +
        '  </tr></thead>' +
        '  <tbody>' + rowsHtml + '</tbody>' +
        '</table>' +
        paginationHtml;

    var prevBtn = document.getElementById('localPrevBtn');
    var nextBtn = document.getElementById('localNextBtn');
    var rowsSel = document.getElementById('localPageSizeSelect');

    if (prevBtn) prevBtn.addEventListener('click', function () {
        if (DashboardState.pagination.currentPage <= 1) return;
        DashboardState.pagination.currentPage--;
        fetchData();
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
        if (DashboardState.pagination.currentPage >= DashboardState.pagination.totalPages) return;
        DashboardState.pagination.currentPage++;
        fetchData();
    });
    if (rowsSel) rowsSel.addEventListener('change', function () {
        DashboardState.pagination.pageSize = parseInt(this.value, 10);
        DashboardState.pagination.currentPage = 1;
        fetchData();
    });

    var tableRows = container.querySelectorAll('.custom-local-clickable-row');
    for (var r = 0; r < tableRows.length; r++) {
        tableRows[r].addEventListener('click', function () {
            var siteId = this.getAttribute('data-site-id');
            var selectedSite = null;
            for (var k = 0; k < sites.length; k++) {
                if (sites[k].site_id === siteId) {
                    selectedSite = sites[k];
                    break;
                }
            }
            if (selectedSite) {
                showSiteDetailModal(selectedSite);
            }
        });
    }
}

function showSiteDetailModal(site) {
    var modalContainer = document.getElementById('customLocalSiteDetailModal');
    if (!modalContainer) return;

    var availPct = site.site_availability !== null && site.site_availability !== undefined
        ? parseFloat(site.site_availability)
        : null;
    var availColor = getAvailColor(availPct);
    var availStr = availPct !== null ? availPct.toFixed(1) + '%' : '-';
    var downtimeStr = site.downtime_minutes > 0 ? formatMinutes(site.downtime_minutes) : '0m';
    var availableStr = site.available_minutes !== null ? formatMinutes(site.available_minutes) : '-';

    var onAirTimeStr = site.on_air_time ? site.on_air_time : 'N/A';
    var regionStr = site.region_name ? site.region_name : '-';
    var vendorStr = site.vendor_name ? site.vendor_name : '-';

    var modalHtml =
        '<div class="custom-local-modal-card">' +
        '  <div class="custom-local-modal-header">' +
        '    <div>' +
        '      <div class="custom-local-modal-subtitle">Site Detail</div>' +
        '      <div class="custom-local-modal-title">' + (site.site_name || site.site_id || '-') + '</div>' +
        '    </div>' +
        '    <button class="custom-local-modal-close-icon" id="localModalCloseX">✕</button>' +
        '  </div>' +
        '  <div class="custom-local-modal-meta-row">' +
        '    <span>' + DashboardState.startDate + ' — ' + DashboardState.endDate + '</span>' +
        '    <span>•</span>' +
        '    <span>Region: ' + regionStr + '</span>' +
        '    <span>•</span>' +
        '    <span class="custom-local-badge-vendor">' + vendorStr + '</span>' +
        '    <span class="custom-local-onair-badge">On-Air: ' + onAirTimeStr + '</span>' +
        '  </div>' +
        '  <div class="custom-local-modal-divider"></div>' +
        '  <div class="custom-local-modal-metrics-grid">' +
        '    <div class="custom-local-modal-metric-block">' +
        '      <span class="custom-local-modal-metric-label">Downtime</span>' +
        '      <span class="custom-local-modal-metric-val" style="color: #f87171;">' + downtimeStr + '</span>' +
        '    </div>' +
        '    <div class="custom-local-modal-metric-block">' +
        '      <span class="custom-local-modal-metric-label">Available</span>' +
        '      <span class="custom-local-modal-metric-val" style="color: #34d399;">' + availableStr + '</span>' +
        '    </div>' +
        '    <div class="custom-local-modal-metric-block">' +
        '      <span class="custom-local-modal-metric-label">Availability</span>' +
        '      <span class="custom-local-modal-metric-val" style="color: ' + availColor + ';">' + availStr + '</span>' +
        '    </div>' +
        '  </div>' +
        '  <div class="custom-local-modal-footer">' +
        '    <button class="custom-local-btn-reset" id="localModalCloseBtn">Close</button>' +
        '  </div>' +
        '</div>';

    modalContainer.innerHTML = modalHtml;
    modalContainer.style.setProperty('display', 'flex', 'important');

    var closeX = document.getElementById('localModalCloseX');
    var closeBtn = document.getElementById('localModalCloseBtn');
    if (closeX) closeX.addEventListener('click', closeSiteDetailModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSiteDetailModal);
}

function closeSiteDetailModal() {
    var modalContainer = document.getElementById('customLocalSiteDetailModal');
    if (modalContainer) {
        modalContainer.style.setProperty('display', 'none', 'important');
    }
}

var EChartsDailyTrendInstance = null;

function ensureEChartsLoaded(callback) {
    if (typeof echarts !== 'undefined') {
        callback();
        return;
    }
    var existingScript = document.getElementById('owsInternalEchartsScript');
    if (existingScript) {
        existingScript.addEventListener('load', callback);
        return;
    }

    var script = document.createElement('script');
    script.id = 'owsInternalEchartsScript';
    var ctxPath = (typeof staticContextPath !== 'undefined' && staticContextPath) ? staticContextPath : '/adc-static';
    var prefix = (typeof jslibPrefix !== 'undefined' && jslibPrefix) ? jslibPrefix : 'jslib';
    var tenant = (typeof tenant_id !== 'undefined' && tenant_id) ? tenant_id : '30f8';
    script.src = ctxPath + '/' + prefix + '/' + tenant + '/CN_GSC_ID_Surge_Noc_Dashboard/Dashboard/echarts/0.0.1/echarts.min.js';
    script.onload = function () {
        callback();
    };
    script.onerror = function () {
    };
    document.head.appendChild(script);
}

function renderDailyTrendChart(dailyData) {
    var wrapper = document.getElementById('localChartCanvasWrapper');
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
    chartDom.id = 'customLocalEChartsContainer';
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

    // Hitung default window zoom agar chart tidak mepet jika rentang panjang (misal 1 bulan)
    var isLongRange = categories.length > 12;
    var defaultVisibleCount = 12; // jumlah bar yang nyaman terlihat sekaligus
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
                name: '',
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
                name: '',
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
                name: 'Total Count of OLT',
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

    window.addEventListener('resize', function () {
        if (EChartsDailyTrendInstance) {
            EChartsDailyTrendInstance.resize();
        }
    });
}

var EChartsWeeklyTrendInstance = null;

function getIsoWeekNumber(d) {
    var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

function getThuWedWeekInfo(d) {
    var date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 4 = Thu, 5 = Fri, 6 = Sat

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
    var wrapper = document.getElementById('localWeeklyChartCanvasWrapper');
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

    // Hitung zoom untuk weekly trend jika jumlah minggu banyak
    var isLongWeekly = categories.length > 8;
    var defaultVisibleWeeks = 8;
    var zoomStartWeek = isLongWeekly ? Math.max(0, categories.length - defaultVisibleWeeks) : 0;
    var zoomEndWeek = categories.length - 1;

    wrapper.innerHTML = '';
    var chartDom = document.createElement('div');
    chartDom.id = 'customLocalWeeklyEChartsContainer';
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
                name: 'Total Count of OLT',
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

    window.addEventListener('resize', function () {
        if (EChartsWeeklyTrendInstance) {
            EChartsWeeklyTrendInstance.resize();
        }
    });
}

function fetchData() {
    var container = document.getElementById('localTableContainer');
    if (container) container.innerHTML = '<div style="color: #a1a1aa; padding: 36px; text-align: center;">Loading availability data...</div>';

    if (typeof MessageProcessor === 'undefined' || !MessageProcessor.process) {
        if (container) {
            container.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">[OWS Error] MessageProcessor runtime API not found.</div>';
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
            if (resultData.dailyTrend) {
                renderDailyTrendChart(resultData.dailyTrend);
                renderWeeklyTrendChart(resultData.dailyTrend);
            }
            if (resultData.regionSummary) {
                renderRegionSummary(resultData.regionSummary, resultData.summary ? resultData.summary.hasData : false);
            }
            if (resultData.pagination) {
                DashboardState.pagination.currentPage = resultData.pagination.currentPage || 1;
                DashboardState.pagination.pageSize = resultData.pagination.pageSize || 20;
                DashboardState.pagination.totalSites = resultData.pagination.totalSites || 0;
                DashboardState.pagination.totalPages = resultData.pagination.totalPages || 1;
            }
            if (resultData.availableRegions || resultData.availableVendors) {
                populateDropdowns(resultData.availableRegions || [], resultData.availableVendors || []);
            }
            renderTable(resultData.sites || [], DashboardState.pagination);
        },
        error: function (err) {
            if (container) container.innerHTML = '<div style="color: #ef4444; padding: 24px; text-align: center;">Failed to load data from OWS service.</div>';
        }
    });
}

function initDashboard() {
    renderFilterPanel();
    fetchData();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initDashboard, 1);
} else {
    document.addEventListener('DOMContentLoaded', initDashboard);
}

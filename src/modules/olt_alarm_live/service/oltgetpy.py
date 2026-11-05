#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
OWS Python Function Service - OLT Alarm & Site Availability Backend
Service Path: /adc-service/rest/v1/services/gde_dashboard/olt_alarm_dashboard/olt_alarm__get_py
Entry Function: handler
Compatible with frontend: src/modules/olt_alarm_live/page/script.js

Key Logic Extracted from Netdrone OLT Reference:
1. CMDB OLT Sites:
   - Filter device EMS keycode IN ('FWA_Fiberhome_UMC2-A', 'FTTH_Huawei_NCE_FAN', 'FTTH_Comnect_OLT', 'Nokia_FTTH', 'Yinet (FTTH OLT)')
   - Device capacity > 10, Site active = 1
2. OLT Down Alarms:
   - sitedownfault = '9'
   - severity != '0'
   - al.total_impacted_subscribers > 10
   - ae.outageflag = 0
3. Trouble Ticket:
   - tickettype IN ('Single OLT Down', 'Massive OLT Down')
   - severity.label IN ('Emergency', 'Critical', 'Major')
   - title not like '%DRY RUN%'
4. Initial RCA:
   - 'Power issue' if alarmname in ('GNB power cut off notification', 'Input power-off') or diagnosesummary == 'Power issue'
   - 'ACC DOWN' if diagnosesummary == 'ACC DOWN'
   - 'ISP' if alarmsource contains 'ISP'
   - 'Transmission Issue' otherwise
"""

import json
import logging
import math
from datetime import datetime, timezone, timedelta
from adc_sdk.context import Context
from adc_sdk.api import ServiceInvoker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WIB_OFFSET_HOURS = 7


def query_tql(tql_query: str, limit: int = 5000, current_page: int = 1) -> list:
    """
    Query OWS TQL via ServiceInvoker with page-aware payload.
    """
    payload = {
        "tql": tql_query,
        "limit": limit,
        "currentPage": current_page,
        "pageSize": limit,
        "query_type": "NORMAL"
    }

    endpoints = [
        "/adc-model/rest/v1/model-instances/query-by-tql",
        "/adc-model/rest/v2/model-instances/query-by-tql",
        "/rest/v1/tql/query",
        "/tql/query",
        "/adc-service/rest/v1/tql/query"
    ]

    for ep in endpoints:
        try:
            res = ServiceInvoker.post(ep, payload)
            if not res:
                continue

            if isinstance(res, dict):
                data_block = res.get("result") if "result" in res else res.get("data")
                if isinstance(data_block, dict):
                    rows = data_block.get("_values") or data_block.get("results") or data_block.get("rows") or data_block.get("data") or data_block.get("list")
                    if isinstance(rows, list):
                        return rows
                elif isinstance(data_block, list):
                    return data_block

                if "_values" in res and isinstance(res["_values"], list):
                    return res["_values"]
                if "results" in res and isinstance(res["results"], list):
                    return res["results"]
                if "rows" in res and isinstance(res["rows"], list):
                    return res["rows"]
                if "data" in res and isinstance(res["data"], list):
                    return res["data"]
            elif isinstance(res, list):
                return res
        except Exception:
            continue

    return []


def query_all_paged(tql_query: str, batch_size: int = 5000, max_rows: int = 60000, max_pages: int = 15) -> list:
    """
    Guaranteed OWS TQL pagination using 'start <offset> limit <batch_size>' syntax.
    """
    clean_query = tql_query.strip().rstrip(";")
    all_rows = []
    offset = 0
    pages_done = 0

    while len(all_rows) < max_rows and pages_done < max_pages:
        if " start " in clean_query.lower() or " limit " in clean_query.lower():
            rows = query_tql(clean_query, limit=batch_size)
            if rows:
                all_rows.extend(rows)
            break

        paged_query = f"{clean_query} start {offset} limit {batch_size}"
        rows = query_tql(paged_query, limit=batch_size)

        if not rows:
            if offset == 0:
                rows = query_tql(clean_query, limit=batch_size)
                if rows:
                    all_rows.extend(rows)
            break

        all_rows.extend(rows)
        pages_done += 1

        if len(rows) < batch_size:
            break

        offset += batch_size

    return all_rows


def parse_timestamp(val) -> int:
    """
    Parse date/time input to epoch milliseconds (UTC+7 / WIB safe).
    Supports integer/float epoch ms, seconds, ISO strings, YYYY-MM-DD HH:MM:SS.
    Does NOT use datetime.strptime (prohibited in some sandboxes).
    """
    if val is None or val == "" or val == "None":
        return 0

    if isinstance(val, (int, float)):
        v = int(val)
        if v > 100000000000:
            return v
        if v > 100000000:
            return v * 1000
        return 0

    val_str = str(val).strip()
    if not val_str:
        return 0

    if val_str.isdigit():
        v = int(val_str)
        if v > 100000000000:
            return v
        if v > 100000000:
            return v * 1000
        return 0

    try:
        f_val = float(val_str)
        v = int(f_val)
        if v > 100000000000:
            return v
        if v > 100000000:
            return v * 1000
    except ValueError:
        pass

    clean_str = val_str.replace("T", " ").replace("Z", "").replace("/", "-")
    if "." in clean_str:
        clean_str = clean_str.split(".")[0]

    parts = clean_str.split(" ")
    date_part = parts[0]
    time_part = parts[1] if len(parts) > 1 else "00:00:00"

    date_sub = date_part.split("-")
    time_sub = time_part.split(":")

    if len(date_sub) == 3:
        try:
            year = int(date_sub[0])
            month = int(date_sub[1])
            day = int(date_sub[2])

            hour = int(time_sub[0]) if len(time_sub) > 0 else 0
            minute = int(time_sub[1]) if len(time_sub) > 1 else 0
            second = int(time_sub[2]) if len(time_sub) > 2 else 0

            tz_wib = timezone(timedelta(hours=WIB_OFFSET_HOURS))
            dt = datetime(year, month, day, hour, minute, second, tzinfo=tz_wib)
            return int(dt.timestamp() * 1000)
        except Exception:
            return 0

    return 0


def format_duration(ms: float) -> str:
    """Formats milliseconds into readable duration string (e.g. '2h 15m' or '45s')."""
    if not ms or ms <= 0:
        return "0m"
    total_sec = math.floor(ms / 1000)
    hours = total_sec // 3600
    mins = (total_sec % 3600) // 60
    secs = total_sec % 60
    if hours > 0:
        return f"{hours}h {mins}m"
    if mins > 0:
        return f"{mins}m {secs}s"
    return f"{secs}s"


def format_time_only(ms: int) -> str:
    """Formats epoch milliseconds to 'YYYY-MM-DD HH:MM:SS' in WIB."""
    if not ms or ms <= 0:
        return "-"
    tz_wib = timezone(timedelta(hours=WIB_OFFSET_HOURS))
    dt = datetime.fromtimestamp(ms / 1000.0, tz=tz_wib)
    return f"{dt.year:04d}-{dt.month:02d}-{dt.day:02d} {dt.hour:02d}:{dt.minute:02d}:{dt.second:02d}"


def merge_overlapping_intervals(intervals: list) -> list:
    """Merges overlapping downtime intervals into unified periods."""
    if not intervals:
        return []
    sorted_int = sorted(intervals, key=lambda x: x["start"])
    merged = [sorted_int[0]]
    for current in sorted_int[1:]:
        last = merged[-1]
        if current["start"] <= last["end"]:
            if current["end"] > last["end"]:
                last["end"] = current["end"]
        else:
            merged.append(current)
    return merged


def build_tql_list(values: list) -> str:
    """Creates a comma-separated SQL/TQL string list with safe escaping."""
    output = []
    seen = set()
    for v in values:
        if not v:
            continue
        s = str(v).strip()
        if not s or s in seen:
            continue
        seen.add(s)
        safe_s = s.replace("'", "''")
        output.append(f"'{safe_s}'")
    return ",".join(output)


def extract_params(event: dict) -> dict:
    """Recursively extracts request parameters from OWS event wrapping."""
    if not isinstance(event, dict):
        return {}
    if "input_params" in event and isinstance(event["input_params"], dict):
        return event["input_params"]
    if "input_node" in event and isinstance(event["input_node"], dict):
        inp = event["input_node"].get("input") or event["input_node"].get("data")
        if isinstance(inp, dict):
            return inp
    if "input" in event and isinstance(event["input"], dict):
        return event["input"]
    if "body" in event:
        body = event["body"]
        if isinstance(body, dict):
            return body
        if isinstance(body, str):
            try:
                parsed = json.loads(body)
                if isinstance(parsed, dict):
                    return parsed
            except Exception:
                pass
    if "data" in event and isinstance(event["data"], dict):
        return event["data"]
    if "_values" in event and isinstance(event["_values"], list) and event["_values"]:
        first = event["_values"][0]
        if isinstance(first, dict):
            return extract_params(first)
    return event


def classify_initial_rca(diagnose_summary: str, alarm_source: str, alarm_name: str) -> str:
    """Initial RCA classification matching Netdrone OLT logic."""
    alm_lower = (alarm_name or "").lower()
    if "power cut off" in alm_lower or "power-off" in alm_lower or alarm_name in ("GNB power cut off notification", "Input power-off"):
        return "Power issue"
    if diagnose_summary in ("Power issue", "ACC DOWN"):
        return diagnose_summary
    if alarm_source and "ISP" in alarm_source.upper():
        return "ISP"
    return "Transmission Issue"


def _process_handler(event: dict, context: Context = None) -> dict:
    """Core logic for OLT Alarm & Site Availability calculation."""
    params = extract_params(event)
    print(f"[Python OLT Service] Extracted params: {params}", flush=True)

    start_date_str = str(params.get("startDate") or params.get("start_time") or "").strip()
    end_date_str = str(params.get("endDate") or params.get("end_time") or "").strip()
    selected_region = str(params.get("region") or "").strip().lower()
    selected_vendor = str(params.get("vendor") or "").strip().lower()
    search_query = str(params.get("searchQuery") or "").strip().lower()

    req_page = int(params.get("page") or params.get("currentPage") or 1)
    req_page_size = int(params.get("pageSize") or params.get("limit") or 20)
    if req_page < 1:
        req_page = 1
    if req_page_size < 1:
        req_page_size = 20

    # 1. Time Window Calculation (WIB)
    tz_wib = timezone(timedelta(hours=WIB_OFFSET_HOURS))
    now_dt = datetime.now(tz=tz_wib)
    now_ms = int(now_dt.timestamp() * 1000)

    today_start_dt = now_dt.replace(hour=0, minute=0, second=0, microsecond=0)
    today_end_dt = now_dt.replace(hour=23, minute=59, second=59, microsecond=999000)
    today_start_ms = int(today_start_dt.timestamp() * 1000)
    today_end_ms = int(today_end_dt.timestamp() * 1000)

    window_start_ms = parse_timestamp(start_date_str) if (start_date_str and start_date_str != "None") else today_start_ms
    window_end_ms = parse_timestamp(end_date_str) if (end_date_str and end_date_str != "None") else today_end_ms

    if window_start_ms == 0:
        window_start_ms = today_start_ms
    if window_end_ms == 0:
        window_end_ms = today_end_ms
    if window_start_ms > window_end_ms:
        window_start_ms, window_end_ms = window_end_ms, window_start_ms

    total_window_ms = max(1, window_end_ms - window_start_ms)
    start_iso = format_time_only(window_start_ms)
    end_iso = format_time_only(window_end_ms)
    print(f"[Python OLT Service] Time window: {start_iso} to {end_iso} (start_ms={window_start_ms}, end_ms={window_end_ms})", flush=True)

    # 2. Query Metadata Maps (Regions & Vendors)
    vendor_rows = query_tql('SELECT id, optionlabel FROM "/Bpm/msup_options/msup_options_vendor"', 200)
    if not vendor_rows:
        vendor_rows = query_tql('SELECT id, vendor_name FROM "/datahub/cmdb/cmdb_vendor"', 500)
    vendor_map = {str(v.get("id")): str(v.get("optionlabel") or v.get("vendor_name") or "-") for v in vendor_rows if v.get("id")}

    region_rows = query_tql('SELECT id, optionlabel FROM "/Bpm/msup_options/msup_options_region"', 200)
    if not region_rows:
        region_rows = query_tql('SELECT id, region_name FROM "/datahub/cmdb/cmdb_region" WHERE active = \'1\' OR active = true', 500)
    region_map = {str(r.get("id")): str(r.get("optionlabel") or r.get("region_name") or "-") for r in region_rows if r.get("id")}
    print(f"[Python OLT Service] Loaded {len(vendor_map)} vendors, {len(region_map)} regions", flush=True)

    # 3. Query CMDB OLT Devices (Device-Centric)
    # Each OLT is a device (device_name / node), located at a site
    cmdb_olt_tql = (
        'SELECT DISTINCT '
        'device.device_name, device.device_id, device.device_name as node, device.device_type_name, device.device_ip, '
        'device.site_id as device_site_fk, ems.ems_name, ems.keycode as ems_keycode, '
        'site.site_id, site.site_name, site.is_hub, site.is_vip, site.on_air_time, '
        'region.region_name as region, vendor.vendor_name as vendor '
        'FROM "/datahub/cmdb/cmdb_device" as device '
        'INNER JOIN "/datahub/cmdb/cmdb_ems" as ems ON device.ems_id = ems.id '
        'LEFT JOIN "/datahub/cmdb/cmdb_site" as site ON device.site_id = site.id '
        'LEFT JOIN "/datahub/cmdb/cmdb_region" as region ON site.region_name = region.id '
        'LEFT JOIN "/datahub/cmdb/cmdb_vendor" as vendor ON site.vendor = vendor.id '
        'WHERE (device.active = 1 OR device.active = true) '
        'AND ems.ems_name IN (\'FTTH_Huawei_NCE_FAN\',\'Nokia_FTTH\',\'FTTH_Comnect_OLT\',\'Yinet (FTTH OLT)\',\'FWA_Fiberhome_UMC2-A\') '
        'ORDER BY device.device_name ASC'
    )

    print(f"[Python OLT Service] Querying CMDB OLT devices with EMS filter (auto-paged)...", flush=True)
    cmdb_device_rows = query_all_paged(cmdb_olt_tql, batch_size=5000, max_rows=50000)

    # Fallback if EMS join returns 0
    if not cmdb_device_rows:
        print("[Python OLT Service] Fallback querying all CMDB devices...", flush=True)
        cmdb_fallback = (
            'SELECT DISTINCT '
            'device.device_name, device.device_id, device.device_name as node, site.site_id, site.site_name, '
            'region.region_name as region, vendor.vendor_name as vendor, site.on_air_time '
            'FROM "/datahub/cmdb/cmdb_device" as device '
            'LEFT JOIN "/datahub/cmdb/cmdb_site" as site ON device.site_id = site.id '
            'LEFT JOIN "/datahub/cmdb/cmdb_region" as region ON site.region_name = region.id '
            'LEFT JOIN "/datahub/cmdb/cmdb_vendor" as vendor ON site.vendor = vendor.id '
            'WHERE (device.active = 1 OR device.active = true) '
            'ORDER BY device.device_name ASC'
        )
        cmdb_device_rows = query_all_paged(cmdb_fallback, batch_size=5000, max_rows=50000)

    print(f"[Python OLT Service] Total CMDB OLT devices fetched: {len(cmdb_device_rows)} devices", flush=True)

    # 4. Build Device Interval Mapping (Key = OLT Device Name / Node)
    site_interval_map = {}
    device_id_to_key = {}
    olt_device_names = []

    for row in cmdb_device_rows:
        dev_name = str(row.get("device_name") or row.get("node") or "").strip()
        dev_id = str(row.get("device_id") or "").strip()
        ems_name = str(row.get("ems_name") or row.get("ems_keycode") or "-").strip()
        site_name = str(row.get("site_name") or "").strip()
        site_id = str(row.get("site_id") or "-").strip()
        if not dev_name:
            continue

        primary_key = dev_name

        vendor_val = str(row.get("vendor") or "")
        vendor_label = vendor_map.get(vendor_val, vendor_val or "-")

        region_val = str(row.get("region") or row.get("region_name") or "")
        region_label = region_map.get(region_val, region_val or "-")

        # In-memory filter
        if selected_region and selected_region not in (region_label.lower(), region_val.lower()):
            continue
        if selected_vendor and selected_vendor not in (vendor_label.lower(), vendor_val.lower()):
            continue
        if search_query:
            if not any(search_query in x for x in (dev_name.lower(), dev_id.lower(), site_name.lower(), site_id.lower(), region_label.lower(), vendor_label.lower())):
                continue

        on_air_str = str(row.get("on_air_time") or "")
        on_air_ms = parse_timestamp(on_air_str)
        if on_air_ms > 0 and window_end_ms > 0 and on_air_ms > window_end_ms:
            continue

        olt_device_names.append(dev_name)

        # Normalize helper for device names (handles unicode dashes and extra spaces)
        clean_name = dev_name.replace("–", "-").replace("—", "-").strip()
        device_id_to_key[dev_name] = primary_key
        device_id_to_key[dev_name.upper()] = primary_key
        device_id_to_key[dev_name.lower()] = primary_key
        device_id_to_key[clean_name] = primary_key
        device_id_to_key[clean_name.upper()] = primary_key
        device_id_to_key[clean_name.lower()] = primary_key

        site_interval_map[primary_key] = {
            "deviceName": dev_name,
            "deviceId": dev_id or dev_name,
            "emsName": ems_name,
            "siteName": site_name or site_id or dev_name,
            "siteId": site_id,
            "regionLabel": region_label,
            "vendorLabel": vendor_label,
            "onAirMs": on_air_ms,
            "onAirStr": on_air_str,
            "totalAlarms": 0,
            "activeAlarms": 0,
            "intervals": [],
            "alarms": [],
            "latestOccurMs": 0,
            "firstOccurMs": 0
        }

    def resolve_device_key(rec):
        # Strictly match by device_name only (Alarm node / alarmsource / devicename == CMDB device_name)
        raw_val = str(rec.get("devicename") or rec.get("node") or rec.get("alarmsource") or rec.get("device_name") or "").strip()
        if not raw_val:
            return None
        if raw_val in device_id_to_key:
            return device_id_to_key[raw_val]
        norm = raw_val.replace("–", "-").replace("—", "-").strip()
        if norm in device_id_to_key:
            return device_id_to_key[norm]
        if norm.upper() in device_id_to_key:
            return device_id_to_key[norm.upper()]
        return None

    # 5. Query OLT Down Alarms (Live & History)
    # Primary condition: sitedownfault = '9' AND severity != '0'
    total_alarm_count = 0
    rca_breakdown = {"Power issue": 0, "ACC DOWN": 0, "ISP": 0, "Transmission Issue": 0}
    duration_breakdown = {"below_1h": 0, "1_4h": 0, "4_8h": 0, "8_24h": 0, "above_24h": 0}

    if site_interval_map:
        # 5.1 Live OLT Alarms
        live_tql = (
            'SELECT al.sitecode, al.identifier, al.alarmname, al.node, al.node as alarmsource, al.devicename, al.firstoccurrence, '
            'al.lastoccurrence, al.cleartime, al.severity, al.sitedownfault, al.diagnosesummary '
            'FROM "/AlarmBase/ICT_AlarmPush/ap_alarm_live" as al '
            'WHERE al.alarmname IS NOT NULL '
            'AND (al.sitedownfault = \'9\' OR al.sitedownfault = 9) AND al.severity != \'0\' '
            'ORDER BY al.firstoccurrence DESC'
        )
        live_rows = query_all_paged(live_tql, batch_size=5000, max_pages=10)
        print(f"[Python OLT Service] Total live OLT alarms fetched: {len(live_rows)} rows", flush=True)

        for alm in live_rows:
            target_key = resolve_device_key(alm)
            if not target_key or target_key not in site_interval_map:
                continue

            target_site = site_interval_map[target_key]
            occur_ms = parse_timestamp(alm.get("firstoccurrence"))
            if occur_ms <= 0 or occur_ms > window_end_ms:
                continue

            clear_ms = parse_timestamp(alm.get("cleartime"))
            is_active = (clear_ms == 0)

            total_alarm_count += 1
            target_site["totalAlarms"] += 1
            if is_active:
                target_site["activeAlarms"] += 1

            eff_start = max(occur_ms, window_start_ms)
            eff_end = min(now_ms, window_end_ms) if is_active else min(clear_ms, window_end_ms)
            alm_name = str(alm.get("alarmname") or "OLT Down Alarm").strip()
            alm_source = str(alm.get("alarmsource") or "").strip()
            diag_sum = str(alm.get("diagnosesummary") or "").strip()

            rca = classify_initial_rca(diag_sum, alm_source, alm_name)
            rca_breakdown[rca] = rca_breakdown.get(rca, 0) + 1

            if target_site["firstOccurMs"] == 0 or occur_ms < target_site["firstOccurMs"]:
                target_site["firstOccurMs"] = occur_ms
            if occur_ms > target_site["latestOccurMs"]:
                target_site["latestOccurMs"] = occur_ms

            if eff_end > eff_start:
                target_site["intervals"].append({"start": eff_start, "end": eff_end})

            dur_ms = max(0, eff_end - eff_start)
            target_site["alarms"].append({
                "alarmName": alm_name,
                "alarmSource": alm_source,
                "rca": rca,
                "occurMs": occur_ms,
                "clearMs": 0 if is_active else clear_ms,
                "occurStr": format_time_only(occur_ms),
                "clearStr": "Active (Now)" if is_active else format_time_only(clear_ms),
                "durationFormatted": format_duration(dur_ms)
            })

        # 5.2 History OLT Alarms (Matching FWA query structure)
        hist_tql = (
            'SELECT al.sitecode, al.identifier, al.alarmname, al.node, al.node as alarmsource, al.devicename, al.firstoccurrence, '
            'al.lastoccurrence, al.cleartime, al.severity, al.sitedownfault, al.diagnosesummary '
            'FROM "/AlarmBase/ICT_History_Query/ict_hq_es_history" as al '
            'WHERE al.alarmname IS NOT NULL '
            'AND (al.sitedownfault = \'9\' OR al.sitedownfault = 9) AND al.severity != \'0\' '
            f'AND al.firstoccurrence <= {window_end_ms} '
            f'AND (al.cleartime >= {window_start_ms} OR al.cleartime = 0 OR al.cleartime IS NULL) '
            'ORDER BY al.firstoccurrence DESC'
        )
        hist_rows = query_all_paged(hist_tql, batch_size=5000, max_pages=15)
        print(f"[Python OLT Service] Total history OLT alarms fetched: {len(hist_rows)} rows", flush=True)

        for alm in hist_rows:
            target_key = resolve_device_key(alm)
            if not target_key or target_key not in site_interval_map:
                continue

            target_site = site_interval_map[target_key]
            occur_ms = parse_timestamp(alm.get("firstoccurrence"))
            if occur_ms <= 0 or occur_ms > window_end_ms:
                continue

            clear_ms = parse_timestamp(alm.get("cleartime"))
            is_cleared = (clear_ms > 0)
            end_ms = clear_ms if is_cleared else window_end_ms
            if end_ms < window_start_ms:
                continue

            eff_start = max(occur_ms, window_start_ms)
            eff_end = min(end_ms, window_end_ms)
            alm_name = str(alm.get("alarmname") or "OLT Down Alarm").strip()
            alm_source = str(alm.get("alarmsource") or "").strip()
            diag_sum = str(alm.get("diagnosesummary") or "").strip()

            rca = classify_initial_rca(diag_sum, alm_source, alm_name)
            rca_breakdown[rca] = rca_breakdown.get(rca, 0) + 1

            if eff_end > eff_start:
                total_alarm_count += 1
                target_site["totalAlarms"] += 1
                if not is_cleared:
                    target_site["activeAlarms"] += 1

                if target_site["firstOccurMs"] == 0 or occur_ms < target_site["firstOccurMs"]:
                    target_site["firstOccurMs"] = occur_ms
                if occur_ms > target_site["latestOccurMs"]:
                    target_site["latestOccurMs"] = occur_ms

                target_site["intervals"].append({"start": eff_start, "end": eff_end})
                dur_ms = max(0, eff_end - eff_start)
                target_site["alarms"].append({
                    "alarmName": alm_name,
                    "alarmSource": alm_source,
                    "rca": rca,
                    "occurMs": occur_ms,
                    "clearMs": clear_ms if is_cleared else 0,
                    "occurStr": format_time_only(occur_ms),
                    "clearStr": format_time_only(clear_ms) if is_cleared else "Active (Now)",
                    "durationFormatted": format_duration(dur_ms)
                })

    # 6. Calculate SLA Availability per OLT Site
    sites_list = []
    affected_sites_count = 0
    active_down_sites_count = 0
    total_avail_rate_sum = 0.0
    max_downtime_ms = 0
    most_affected_site_name = "-"
    most_affected_downtime_str = "0m"

    for s_name, item in site_interval_map.items():
        total_downtime_ms = 0
        if item["intervals"]:
            merged = merge_overlapping_intervals(item["intervals"])
            total_downtime_ms = sum(max(0, m["end"] - m["start"]) for m in merged)

        site_win_start = max(window_start_ms, item["onAirMs"]) if item["onAirMs"] > 0 else window_start_ms
        site_win_end = min(window_end_ms, now_ms)
        effective_win_ms = max(1, site_win_end - site_win_start)
        total_downtime_ms = min(total_downtime_ms, effective_win_ms)

        if total_downtime_ms > 0 or item["totalAlarms"] > 0:
            affected_sites_count += 1
        if item["activeAlarms"] > 0:
            active_down_sites_count += 1

            # Categorize duration for active down OLTs
            if total_downtime_ms <= 3600000:
                duration_breakdown["below_1h"] += 1
            elif total_downtime_ms <= 14400000:
                duration_breakdown["1_4h"] += 1
            elif total_downtime_ms <= 28800000:
                duration_breakdown["4_8h"] += 1
            elif total_downtime_ms <= 86400000:
                duration_breakdown["8_24h"] += 1
            else:
                duration_breakdown["above_24h"] += 1

        if total_downtime_ms > max_downtime_ms:
            max_downtime_ms = total_downtime_ms
            most_affected_site_name = s_name
            most_affected_downtime_str = format_duration(total_downtime_ms)

        available_ms = max(0, effective_win_ms - total_downtime_ms)
        avail_rate_raw = (available_ms / effective_win_ms) * 100.0
        avail_rate = round(avail_rate_raw, 1)
        total_avail_rate_sum += avail_rate_raw

        is_currently_down = (item["activeAlarms"] > 0)
        last_occ_str = format_time_only(item["latestOccurMs"]) if item["latestOccurMs"] > 0 else "-"

        sites_list.append({
            "deviceName": item["deviceName"],
            "deviceId": item.get("deviceId") or item["deviceName"],
            "emsName": item.get("emsName") or "-",
            "siteName": item["siteName"],
            "siteId": item["siteId"],
            "regionLabel": item["regionLabel"],
            "vendorLabel": item["vendorLabel"],
            "onAirMs": item["onAirMs"],
            "onAirStr": item["onAirStr"],
            "totalAlarms": item["totalAlarms"],
            "activeAlarms": item["activeAlarms"],
            "downtimeMs": total_downtime_ms,
            "availableMs": available_ms,
            "lastOccurrenceMs": item["latestOccurMs"],
            "downtimeFormatted": format_duration(total_downtime_ms),
            "availableFormatted": format_duration(available_ms),
            "availRatePct": f"{avail_rate:.1f}",
            "lastOccurrenceStr": last_occ_str,
            "isDown": is_currently_down,
            "isCurrentlyDown": is_currently_down,
            "hasHistoricalDowntime": (total_downtime_ms > 0),
            "alarms": item["alarms"],
            "tickets": []
        })

    # Sort: Active down first, then highest downtime, then total alarms, then latest occurrence
    sites_list.sort(key=lambda x: (
        1 if x["isCurrentlyDown"] else 0,
        x["downtimeMs"],
        x["totalAlarms"],
        x["lastOccurrenceMs"]
    ), reverse=True)

    # Global Availability (Harmonized with 2-decimal precision)
    global_avg_avail_pct = f"{round(total_avail_rate_sum / len(sites_list), 2):.2f}" if sites_list else "-"

    # 7. Daily Trend Calculation (In-Memory, Zero DB Query)
    daily_trend = []
    try:
        s_dt = datetime.fromtimestamp(window_start_ms / 1000.0, tz=tz_wib).replace(hour=0, minute=0, second=0, microsecond=0)
        e_dt = datetime.fromtimestamp(window_end_ms / 1000.0, tz=tz_wib).replace(hour=0, minute=0, second=0, microsecond=0)

        day_buckets = []
        cur_day = s_dt
        while cur_day <= e_dt:
            d_str = f"{cur_day.year:04d}-{cur_day.month:02d}-{cur_day.day:02d}"
            d_start = int(cur_day.timestamp() * 1000)
            d_end = int(cur_day.replace(hour=23, minute=59, second=59, microsecond=999000).timestamp() * 1000)
            day_buckets.append({
                "date": d_str,
                "start_ms": d_start,
                "end_ms": d_end
            })
            cur_day += timedelta(days=1)
            if len(day_buckets) > 366:
                break

        for bucket in day_buckets:
            b_start = bucket["start_ms"]
            b_end = min(bucket["end_ms"], now_ms)
            if b_end <= b_start:
                b_end = bucket["end_ms"]

            active_sites_count = 0
            sum_avail_pct = 0.0

            for s_name, item in site_interval_map.items():
                on_air = item.get("onAirMs", 0)
                if on_air > 0 and on_air > b_end:
                    continue

                active_sites_count += 1
                site_d_start = max(b_start, on_air) if on_air > 0 else b_start
                effective_d_ms = max(1, b_end - site_d_start)

                d_intervals = []
                for inv in item.get("intervals", []):
                    ov_s = max(inv["start"], site_d_start)
                    ov_e = min(inv["end"], b_end)
                    if ov_e > ov_s:
                        d_intervals.append({"start": ov_s, "end": ov_e})

                dt_ms = 0
                if d_intervals:
                    sorted_i = sorted(d_intervals, key=lambda x: x["start"])
                    merged_i = [sorted_i[0]]
                    for c in sorted_i[1:]:
                        last = merged_i[-1]
                        if c["start"] <= last["end"]:
                            if c["end"] > last["end"]:
                                last["end"] = c["end"]
                        else:
                            merged_i.append(c)
                    dt_ms = sum(m["end"] - m["start"] for m in merged_i)

                dt_ms = min(dt_ms, effective_d_ms)
                avail_ms = max(0, effective_d_ms - dt_ms)
                site_avail_pct = (avail_ms / effective_d_ms) * 100.0
                sum_avail_pct += site_avail_pct

            avg_avail = round(sum_avail_pct / active_sites_count, 2) if active_sites_count > 0 else 100.0
            daily_trend.append({
                "date": bucket["date"],
                "total_sites": active_sites_count,
                "avg_availability": avg_avail
            })
    except Exception as e_trend:
        print(f"[Python OLT Service] Warning: Failed to compute daily_trend: {e_trend}", flush=True)

    # 8. Pagination (Slice Paginated Sites)
    total_sites = len(sites_list)
    total_pages = math.ceil(total_sites / req_page_size) if req_page_size > 0 else 1
    start_idx = (req_page - 1) * req_page_size
    paged_sites = sites_list[start_idx:start_idx + req_page_size]

    # 9. Lazy-Enrich Trouble Tickets for Paginated Sites
    # Filter for OLT: tickettype IN ('Single OLT Down', 'Massive OLT Down')
    page_site_names = [p["siteName"] for p in paged_sites if (p["downtimeMs"] > 0 or p["totalAlarms"] > 0)]
    page_site_ids = [p["siteId"] for p in paged_sites if p.get("siteId") and p["siteId"] != "-"]
    page_dev_names = [p["deviceName"] for p in paged_sites if (p["downtimeMs"] > 0 or p["totalAlarms"] > 0)]
    all_lookup_identifiers = list(set(page_site_names + page_site_ids + page_dev_names))

    if all_lookup_identifiers:
        bs_rows = query_tql('SELECT id, optionlabel FROM "/Bpm/msup_options/msup_options_businessstatus"', 200)
        bs_map = {str(b.get("id")): str(b.get("optionlabel") or "-") for b in bs_rows if b.get("id")}

        site_names_clause = build_tql_list(all_lookup_identifiers)
        tt_tql = (
            'SELECT sitename, acc_root_cause_site_name, orderidview, sourceticketid, root_cause, sub_root_cause, businessstatus, tickettype, createtime, title '
            'FROM "/TroubleTicket/TroubleTicket/tt_troubleticket" '
            f'WHERE (sitename IN ({site_names_clause}) OR acc_root_cause_site_name IN ({site_names_clause})) '
            'AND tickettype IN (\'Single OLT Down\', \'Massive OLT Down\') '
            'AND title NOT LIKE \'%DRY RUN%\' '
            f'AND (createtime >= \'{start_iso}\' AND createtime <= \'{end_iso}\')'
        )
        tt_rows = query_tql(tt_tql, 500)

        tt_by_site = {}
        for row in tt_rows:
            s_name = str(row.get("sitename") or row.get("acc_root_cause_site_name") or "").strip()
            if not s_name:
                continue
            matched_key = device_id_to_key.get(s_name, s_name)
            bs_uuid = str(row.get("businessstatus") or "")
            tt_type_val = str(row.get("tickettype") or "").strip() or "-"

            tt_item = {
                "ticketId": str(row.get("orderidview") or row.get("sourceticketid") or "-").strip(),
                "createtimeStr": str(row.get("createtime") or "-").strip(),
                "rootCause": str(row.get("root_cause") or "-").strip(),
                "subRootCause": str(row.get("sub_root_cause") or "-").strip(),
                "ticketType": tt_type_val,
                "businessstatusLabel": bs_map.get(bs_uuid, "-")
            }
            tt_by_site.setdefault(matched_key, []).append(tt_item)

        for p in paged_sites:
            target_t_key = device_id_to_key.get(p["deviceName"]) or device_id_to_key.get(p["siteName"]) or p["siteName"]
            p["tickets"] = tt_by_site.get(target_t_key, [])

    print(f"[Python OLT Service] Calculation complete. Total OLT devices: {total_sites}, affected: {affected_sites_count}, down: {active_down_sites_count}, avg SLA: {global_avg_avail_pct}%", flush=True)

    return {
        "success": True,
        "message": "OLT Fault Alarm List loaded via Python Function Service.",
        "queryParams": {
            "startDate": start_iso[:10],
            "endDate": end_iso[:10]
        },
        "summary": {
            "totalAlarmsDown": total_alarm_count,
            "sitesAffected": affected_sites_count,
            "activeDownSites": active_down_sites_count,
            "avgAvailabilityPct": global_avg_avail_pct,
            "mostAffectedSite": most_affected_site_name,
            "mostAffectedSiteDowntime": most_affected_downtime_str,
            "availableRegions": list(region_map.values()),
            "availableVendors": list(vendor_map.values()),
            "rcaBreakdown": rca_breakdown,
            "durationBreakdown": duration_breakdown,
            "historyTruncated": False,
            "historyRowCount": total_alarm_count
        },
        "pagination": {
            "currentPage": req_page,
            "pageSize": req_page_size,
            "totalSites": total_sites,
            "totalPages": total_pages
        },
        "dailyTrend": daily_trend,
        "sites": paged_sites
    }


def handler(event: dict, context: Context = None) -> dict:
    """
    Main Entry Function for OWS Function Service (index.handler).
    """
    import traceback
    print(f"[Python OLT Service] Invoked. Event: {str(event)[:300]}", flush=True)
    try:
        return _process_handler(event, context)
    except Exception as e:
        err_detail = traceback.format_exc()
        print(f"[Python OLT Service ERROR] Exception in handler:\n{err_detail}", flush=True)
        return {
            "success": False,
            "message": f"Python Service Error: {str(e)}",
            "errorDetail": err_detail,
            "summary": {
                "totalAlarmsDown": 0,
                "sitesAffected": 0,
                "activeDownSites": 0,
                "avgAvailabilityPct": "0.0",
                "mostAffectedSite": "-",
                "mostAffectedSiteDowntime": "0m",
                "availableRegions": [],
                "availableVendors": [],
                "rcaBreakdown": {},
                "durationBreakdown": {},
                "historyTruncated": False,
                "historyRowCount": 0
            },
            "pagination": {
                "currentPage": 1,
                "pageSize": 20,
                "totalSites": 0,
                "totalPages": 1
            },
            "sites": []
        }

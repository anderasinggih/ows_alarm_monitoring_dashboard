# Dokumentasi Teknis FWA Site Alarm Monitoring Dashboard (OWS Platform)

## 📌 Ringkasan Arsitektur

Dashboard FWA Site Alarm Monitoring dibangun di atas platform Huawei OWS (GDE Studio) untuk menyajikan pemantauan alarm *real-time* sekaligus analisis *availability* (SLA) secara presisi dengan penanganan *timezone* WIB (UTC+7).

---

## 📊 1. Spesifikasi KPI Cards & Rumus TQL

| KPI Container | Hasil Contoh | Deskripsi Operasional | Rumus Agregasi Backend |
|---|---|---|---|
| **TOTAL ALARMS DOWN** | `151` | Total seluruh *event* / *record* alarm aktif (*live*) yang saat ini bernilai DOWN (belum *cleared*). | `COUNT(Live Alarm Rows)` |
| **SITES AFFECTED** | `100` | Jumlah *site* unik (*unique sitecode*) yang saat ini memiliki setidaknya $\ge 1$ alarm aktif. | `COUNT(DISTINCT sitecode)` |

### 💡 Mengapa Total Alarms Down (151) $\neq$ Sites Affected (100)?
Satu *site* dapat mengalami lebih dari 1 alarm secara bersamaan (misal: *GNB Out of Service* + *Cell Unavailable*). 
* Pada **Total Alarms Down**, terhitung **2 Alarm**.
* Pada **Sites Affected**, terhitung **1 Site**.

---

## 🔍 2. Rumus TQL (OWS Model Data Query)

### A. TQL Query Live Active Alarms (`ap_alarm_live`)
Digunakan untuk menghitung **TOTAL ALARMS DOWN** & **SITES AFFECTED**:

```sql
SELECT * FROM "/AlarmBase/ICT_AlarmPush/ap_alarm_live" 
WHERE (sitedownfault = '1' OR sitedownfault = 1) 
  AND (domain = '1001' OR domain = 1001) 
  AND sitecode IN (
      SELECT site_id FROM "/datahub/cmdb/cmdb_site" 
      WHERE access_type = 'ce1d6700-f34d-11f0-80d8-0255ac12193b' 
        AND site_stage = 'f343d1fb-e165-11f0-90da-0255ac121938'
  )
```

> **Catatan Eksekusi di RunScript Service OWS:** Karena API `query-by-tql` OWS tidak mendukung *subquery* `IN (SELECT ...)`, eksekusi backend dipecah menjadi 2 tahap:
> 1. Query Master CMDB Site FWA On-Air (`/datahub/cmdb/cmdb_site`).
> 2. Query Live Alarm (`ap_alarm_live`) dengan klausa `sitecode IN ('SITE_001', 'SITE_002', ...)`.

### B. TQL Query History Alarms (`ict_hq_es_history`)
Digunakan untuk kalkulasi **SLA Availability %** & **Historical Downtime** sesuai *Date Range* yang dipilih:

```sql
SELECT sitecode, alarmname, firstinserttime, cleartime 
FROM "/AlarmBase/ICT_History_Query/ict_hq_es_history" 
WHERE (sitedownfault = '1' OR sitedownfault = 1) 
  AND (domain = '1001' OR domain = 1001) 
  AND (firstinserttime <= 1785949199000) 
  AND (cleartime >= 1785517200000 OR cleartime = 0 OR cleartime IS NULL) 
  AND sitecode IN (
      SELECT site_id FROM "/datahub/cmdb/cmdb_site" 
      WHERE access_type = 'ce1d6700-f34d-11f0-80d8-0255ac12193b' 
        AND site_stage = 'f343d1fb-e165-11f0-90da-0255ac121938'
  )
```
*(Timestamp `1785517200000` = 1 Ags 2026 00:00:00 WIB, `1785949199000` = 5 Ags 2026 23:59:59 WIB).*

---

## ⏰ 3. Rumus Kalkulasi SLA & Timezone Handling (WIB / UTC+7)

### A. Penanganan Timezone Server OWS
Server OWS berjalan menggunakan *timezone* **UTC (GMT+0)**. Jika menggunakan `new Date().getHours()`, waktu jam 23:03 WIB akan terbaca sebagai 16:03 UTC.

Kalkulasi di `alarmGet.js` disesuaikan secara absolut ke **WIB (GMT+7)**:
```javascript
var WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
var nowMs = new Date().getTime();

// Kalkulasi tanggal & jam berjalan dalam format WIB
var wibNowMs = nowMs + (nowObj.getTimezoneOffset() * 60000) + WIB_OFFSET_MS;
var wibNowDate = new Date(wibNowMs);

var todayStartWIBMs = Date.UTC(wibYear, wibMonth, wibDay, 0, 0, 0, 0) - WIB_OFFSET_MS;
var todayEndWIBMs = Date.UTC(wibYear, wibMonth, wibDay, 23, 59, 59, 999) - WIB_OFFSET_MS;
```

### B. Rumus Downtime & Availability %
1. **Effective Window (`siteEffectiveWindowMs`):**
   $$\text{Effective Window} = \text{Window End (Jam Berjalan WIB)} - \text{Window Start (00:00 WIB)}$$
   *(Pada jam 23:03 WIB, Effective Window = 23 Jam 03 Menit).*

2. **Available Duration:**
   $$\text{Available Duration} = \text{Effective Window} - \text{Total Merged Downtime}$$

3. **Availability Percentage (%):**
   $$\text{Availability \%} = \left( \frac{\text{Available Duration}}{\text{Effective Window}} \right) \times 100\%$$

---

## 🔄 4. Interaksi Filter Date Range

* **Kartu KPI Top (`TOTAL ALARMS DOWN` & `SITES AFFECTED`):**
  Selalu menampilkan **kondisi alarm aktif real-time detik ini** (~151 alarm / ~100 site). Tidak terpengaruh oleh perubahan filter *Date Range*.
* **Tabel & Grid Detail Site (Downtime & Availability %):**
  Menampilkan **performa historis & SLA** sesuai dengan filter *Date Range* yang dipilih pengguna (misal Tgl 1–5 Agustus).

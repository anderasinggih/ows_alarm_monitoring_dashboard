# HUAWEI OWS (GDE STUDIO) GENERAL DEVELOPMENT GUIDELINES & STRICT RULES

Dokumen ini berisi standar arsitektur, panduan lingkungan runtime, aturan ketat (*strict rules*), dan optimasi umum untuk pengembangan **Custom HTML/JS/CSS Web Application** pada platform **Huawei OWS (GDE Studio / ADC Studio)**.

---

## 1. Lingkungan Eksekusi & API Runtime

### A. MessageProcessor Runtime (Strict NO Fallback / NO Mock Data)
1. **Direct MessageProcessor Usage**:
   - Di lingkungan live OWS GDE Studio, komunikasi API ke backend wajib menggunakan objek bawaan `MessageProcessor`.
2. **Strict Rules: NO Local Mock Fallback**:
   - **DILARANG HARAM** menyediakan atau menyuapi data fallback lokal (seperti CSV dummy, JSON mock lokal, atau hardcoded array) jika `MessageProcessor` tidak ditemukan atau request API mengalami kegagalan.
   - Jika di luar runtime OWS atau panggilan API gagal, biarkan mekanisme *error handling* / throw error berjalan secara resmi agar isu integrasi API dapat terdeteksi sejak dini.

---

## 2. Dynamic OWS JSON Payload Handling (SANGAT PENTING)

Payload API dari OWS GDE Studio sering kali me-return tipe data yang dibungkus (*wrapped*) dalam struktur kompleks berupa `Array of Objects` atau `Nested Objects`.

### A. Ekstraksi Field Serbaguna (`extractOWSField`)
Setiap membaca field dari item/payload API OWS (seperti text, value, status, atau ID), gunakan helper sanitasi serbaguna berikut:

```javascript
function extractOWSField(val) {
    if (val === null || val === undefined) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val) && val.length > 0) {
        var item = val[0];
        if (typeof item === 'object' && item !== null) {
            return item.text || item.value || item.name || item.label || '';
        }
        return String(item);
    }
    if (typeof val === 'object') {
        return val.text || val.value || val.local || val.utc || val.name || val.label || '';
    }
    return String(val);
}
```

### B. Safe JSON.parse Wrapper (Mencegah Crash `splPreviewer`)
Di lingkungan Studio Web OWS (`splPreviewer.js`), terdapat bug bawaan Studio di mana previewer memanggil `JSON.parse` pada variabel yang bernilai `undefined`. Tempatkan **Safe Wrapper** ini di baris pertama file JS utama:

```javascript
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
```

---

## 3. Query TQL & Interaksi API Backend

Saat melakukan query API via `MessageProcessor` ke backend OWS GDE Studio:
1. **Klausa `FROM`**: Gunakan path data model OWS yang valid (contoh: `FROM /YourDataModel/DataModel`).
2. **Format Waktu**: Gunakan format standar ISO timestamp (contoh: `YYYY-MM-DD HH:mm:ss`).
3. **Case Sensitivity**: Perhatikan bahwa nama kolom/field pada response payload JSON OWS umumnya bersifat *case-sensitive* atau dalam huruf kecil.

---

## 4. UI/UX Performance & Event Handling

### A. Input Filtering & Search Bar Debouncing
Setiap input pencarian, penyaringan (filter), atau aksi user yang memicu re-render tabel/tampilan wajib menerapkan **Debounce (300ms)** untuk menghindari *layout freeze* atau spam eksekusi pada dataset berukuran besar.

```javascript
var searchTimeout;
function onSearchInput(val) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
        // Eksekusi filter / re-render
    }, 300);
}
```

---

## 5. Checklist Umum Sebelum Deploy ke OWS GDE Studio

- [ ] Baris pertama file JS menyertakan `JSON.parse` safe wrapper.
- [ ] Penggunaan `MessageProcessor` secara murni tanpa fallback mock data lokal.
- [ ] Pengambilan field dari payload API dibungkus oleh helper `extractOWSField()`.
- [ ] Semua input pencarian/filter menggunakan teknik debouncing.

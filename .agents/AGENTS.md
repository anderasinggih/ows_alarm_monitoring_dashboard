# Project Rules for Huawei OWS Development

## General OWS Development Rules & Guidelines

- **Safe JSON.parse Wrapper**: Baris pertama JavaScript wajib menyertakan `JSON.parse` safe wrapper untuk mencegah crash `splPreviewer.js`.
- **Strict NO Mock Data / NO Fallback**: DILARANG HARAM menggunakan fallback data mock lokal (JSON/CSV dummy). Komunikasi API WAJIB HANYA menggunakan `MessageProcessor` OWS secara langsung. Jika di luar runtime OWS / gagal, biarkan error handling resmi tanpa menyuapi data palsu.
- **Dynamic Field Extraction**: Setiap membaca field dari item/payload API OWS, WAJIB gunakan `extractOWSField()` helper sanitasi.
- **Search Bar & Filter Debouncing**: Setiap input pencarian/filtering/user action yang memicu re-render WAJIB menerapkan Debounce (300ms).
- **OWS CSS Naming Rule**: Setiap selector/nama class CSS pada platform OWS Studio WAJIB diawali dengan prefix `custom-` (contoh: `.custom-dashboard-wrapper`, `.custom-avail-bar-wrapper`). DILARANG menggunakan nama class tanpa awalan `custom-` karena akan ditolak oleh validator OWS CSS Studio (Error `10010006`).
- **Clean TQL & API Calls**: Gunakan path model OWS yang valid dan format timestamp ISO standard (`YYYY-MM-DD HH:mm:ss`).

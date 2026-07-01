# Stage 3: Audit Register & Kualitas Bahasa Akademik

## Tujuan
Mengevaluasi kualitas GAYA BAHASA akademik — bukan ejaan (itu Stage 2), tapi apakah register tulisan sudah setara standar karya ilmiah terakreditasi.

## Input
- `.tmp/01-raw-extraction.txt` — teks mentah hasil ekstraksi PDF

## Instruksi Eksekusi
1. BACA teks mentah. Fokus pada GAYA, bukan ejaan.
2. Cari masalah berikut:
   - **Pleonasme**: "sangat penting sekali" → "krusial"
   - **Bahasa kasual**: "bisa" → "dapat", "kita" → "peneliti"
   - **Kalimat tanpa data/bukti**
   - **Subjektivitas**: "Menurut penulis..." → hindari
   - **Kalimat tidak efektif** (> 40 kata tanpa subordinasi jelas)
   - **Hedging akademik yang kurang**
   - **Penggunaan "akan" berlebihan**
   - **Tanda pisah panjang em-dash (—) / en-dash (–)**: indikasi tulisan AI; WAJIB ditandai
     untuk diganti koma/"yaitu"/titik/tanda hubung biasa. Rentang angka pakai `2023-2025`.
   - **Placeholder tertinggal**: `hlm. xx`, `xx`, `[TBD]`, `(tahun?)` — WAJIB ditandai.
   - **Konsistensi sitasi & vs dan**: `&` hanya di dalam kurung `(Penulis & Penulis, thn)`;
     di narasi gunakan `dan`. Tandai yang salah tempat.
3. Format laporan: tabel per bab | No | Kalimat Asli | Masalah | Saran |
4. Simpan ke `.tmp/03-audit-register.md`.

## Tool
`tools/audit_register.py`

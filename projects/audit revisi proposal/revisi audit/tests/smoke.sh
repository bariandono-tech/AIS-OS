#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# smoke.sh — Uji cepat build_revisi.js. 100% LOKAL (Node.js), NOL token LLM/API.
# Jalankan dari Bash/Git Bash:  bash tests/smoke.sh
# Butuh: node + unzip (sudah ada di Git Bash).
# ─────────────────────────────────────────────────────────────────────────
set -u
cd "$(dirname "$0")/.."            # pindah ke folder builder
ajie="outputs/analisis-anggaran-rudenim/revisi-v1"
tmp="$(mktemp -d)"
PASS=0; FAIL=0

xml() { rm -rf "$2"; mkdir -p "$2"; (cd "$2" && unzip -oq "$1" word/document.xml); }
ok() { if [ "$1" = "$2" ]; then echo "  ✅ $3"; PASS=$((PASS+1)); else echo "  ❌ $3"; FAIL=$((FAIL+1)); fi; }

echo "[1] Smoke — build thesis nyata berjalan"
node build_revisi.js "$ajie" "$tmp/a.docx" >/dev/null 2>&1; ok "$?" "0" "build sukses (exit 0)"

echo "[2] Determinisme — dua build identik"
node build_revisi.js "$ajie" "$tmp/b.docx" >/dev/null 2>&1
xml "$tmp/a.docx" "$tmp/xa"; xml "$tmp/b.docx" "$tmp/xb"
diff -q "$tmp/xa/word/document.xml" "$tmp/xb/word/document.xml" >/dev/null; ok "$?" "0" "dua build identik"

echo "[3] Generalisasi — config dummy mengubah front-matter, identitas Ajie tidak bocor"
d="$tmp/dummy"; mkdir -p "$d"
for f in bab1 bab2 bab3; do
  printf '# BAB I\n# PENDAHULUAN\n\n## 1.1  Tes\n\nIsi singkat untuk uji.\n' > "$d/05-revisi-$f.md"
done
printf 'Penulis, A. (2027). *Judul Buku*. Penerbit.\n' > "$d/05-revisi-daftar-pustaka.md"
cat > "$d/config.thesis.json" <<'JSON'
{ "jenisDokumen":"SKRIPSI","judulBaris":["JUDUL DUMMY"],"judulKalimat":"Judul Dummy",
  "penulis":{"nama":"BUDI SANTOSO","nim":"123"},
  "institusi":{"fakultas":"FAKULTAS EKONOMI","universitas":"UNIVERSITAS CONTOH","kota":"JAKARTA","tahun":"2027"},
  "persetujuan":{"judulHalaman":["LEMBAR PERSETUJUAN"],"tanggalSeminar":"1 Januari 2027",
    "penandatangan":[{"kolomLabel":"Mengetahui,","peran":"Pembimbing I,","nama":"Dr A","nidn":"1"},
                     {"kolomLabel":"Menyetujui,","peran":"Pembimbing II,","nama":"Dr B","nidn":"2"}]},
  "kataPengantar":{"paragrafPembuka":["Pembuka."],"ucapanTerimaKasih":["Pihak satu."],"paragrafPenutup":["Penutup."],
    "kota":"Jakarta","tanggal":"1 Januari 2027","penutupLabel":"Penulis,"},
  "daftarIsi":[{"label":"BAB I PENDAHULUAN","hal":"1","level":0,"bold":true}] }
JSON
node build_revisi.js "$d" "$tmp/dummy.docx" >/dev/null 2>&1
xml "$tmp/dummy.docx" "$tmp/xd"
grep -q "BUDI SANTOSO" "$tmp/xd/word/document.xml"; ok "$?" "0" "nama dummy muncul"
grep -q "AJIE" "$tmp/xd/word/document.xml"; ok "$?" "1" "nama Ajie TIDAK bocor"

echo "[4] Pedoman swappable — ganti margin mengubah dokumen"
node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('pedoman/upb.json','utf8'));d.page.margin.left=1134;fs.writeFileSync('pedoman/_smoketest.json',JSON.stringify(d));"
PEDOMAN=_smoketest node build_revisi.js "$ajie" "$tmp/swap.docx" >/dev/null 2>&1
xml "$tmp/swap.docx" "$tmp/xs"
if diff -q "$tmp/xa/word/document.xml" "$tmp/xs/word/document.xml" >/dev/null; then r=SAMA; else r=BEDA; fi
ok "$r" "BEDA" "margin beda -> dokumen berubah"
rm -f pedoman/_smoketest.json

echo "[5] Daftar Isi auto (field TOC) + BAB Heading 1"
grep -qF 'TOC \h \o' "$tmp/xa/word/document.xml"; ok "$?" "0" "field TOC ada (nomor halaman auto)"
grep -q 'w:val="Heading1"' "$tmp/xa/word/document.xml"; ok "$?" "0" "BAB pakai Heading 1 (masuk Daftar Isi)"

rm -rf "$tmp"
echo ""
echo "HASIL: $PASS lulus, $FAIL gagal"
[ "$FAIL" = "0" ] && { echo "SEMUA HIJAU ✅"; exit 0; } || { echo "ADA YANG MERAH ❌"; exit 1; }

"""
main_writing.py — Orkestrator Pipeline Writing (Stage 5 + 6)
Menjalankan revisi per-bab secara berurutan, lalu verification pass.

Penggunaan:
    python tools/main_writing.py <topik> <versi>
    
Contoh:
    python tools/main_writing.py "analisis-pengaruh-xyz" "v1"
    python tools/main_writing.py "analisis-pengaruh-xyz" "v2"
    
Prasyarat:
    - Pipeline audit (main.py) sudah pernah dijalankan
    - File audit tersedia di .tmp/
"""
import sys
import os
import time
import traceback

# Add tools directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from revisi_bab import run_revisi_bab, run_revisi_daftar_pustaka
from verification_pass import run_verification


def run_with_retry(fn, *args, max_retries=3, delay=30):
    """Retry wrapper with exponential backoff."""
    for attempt in range(1, max_retries + 1):
        try:
            result = fn(*args)
            return result
        except Exception as e:
            error_type = type(e).__name__
            if attempt < max_retries:
                wait = delay * attempt
                print(f"\n  ⚠️  Attempt {attempt}/{max_retries} GAGAL: {error_type}")
                print(f"      {str(e)[:200]}")
                print(f"      Menunggu {wait}s sebelum retry...\n")
                time.sleep(wait)
            else:
                print(f"\n  ❌ GAGAL setelah {max_retries} percobaan: {error_type}")
                print(f"      {str(e)[:300]}")
                return False


def main():
    start_time = time.time()
    project_dir = os.path.abspath(os.path.join(current_dir, ".."))
    tmp_dir = os.path.join(project_dir, ".tmp")
    outputs_dir = os.path.join(project_dir, "outputs")
    
    # Parse arguments
    if len(sys.argv) < 3:
        print("Penggunaan: python tools/main_writing.py <topik> <versi>")
        print("Contoh:     python tools/main_writing.py \"analisis-xyz\" \"v1\"")
        sys.exit(1)
    
    topik = sys.argv[1]
    versi = sys.argv[2]
    
    # Paths
    topik_dir = os.path.join(outputs_dir, topik)
    revisi_dir = os.path.join(topik_dir, f"revisi-{versi}")
    raw_text_path = os.path.join(tmp_dir, "01-raw-extraction.txt")
    
    # ─── VALIDASI PRASYARAT ────────────────────────────────
    print("=" * 60)
    print("  WRITING PIPELINE — REVISI SKRIPSI")
    print("=" * 60)
    print(f"  Topik:  {topik}")
    print(f"  Versi:  {versi}")
    print(f"  Input:  {raw_text_path}")
    print(f"  Output: {revisi_dir}")
    print("=" * 60)
    
    # Check that audit has been run
    if not os.path.exists(raw_text_path):
        print(f"\n❌ ERROR: File draf mentah tidak ditemukan: {raw_text_path}")
        print("   Pastikan Anda sudah menjalankan pipeline audit (main.py) terlebih dahulu.")
        sys.exit(1)
    
    audit_files = [f for f in os.listdir(tmp_dir) if f.startswith("0") and f.endswith(".md")]
    if len(audit_files) < 2:
        print(f"\n❌ ERROR: File audit tidak ditemukan di {tmp_dir}")
        print("   Pastikan Anda sudah menjalankan pipeline audit (main.py) terlebih dahulu.")
        sys.exit(1)
    
    print(f"\n  ✅ Draf mentah ditemukan")
    print(f"  ✅ {len(audit_files)} file audit ditemukan")
    
    # Check if this version already exists
    if os.path.exists(revisi_dir):
        print(f"\n⚠️  PERINGATAN: Folder {revisi_dir} sudah ada.")
        print("   File yang sudah ada TIDAK akan ditimpa.")
        print("   Jika ingin menjalankan ulang, hapus folder tersebut terlebih dahulu.")
        # Don't exit — just warn. New files will be written alongside existing ones.
    
    # Create revision directory
    os.makedirs(revisi_dir, exist_ok=True)
    
    # ─── STAGE 5: WRITING (Sequential) ─────────────────────
    print("\n" + "─" * 60)
    print("  STAGE 5: WRITING / REVISI PER-BAB")
    print("─" * 60)
    
    success_count = 0
    total_items = 4  # 3 babs + 1 daftar pustaka
    
    # Revise each chapter sequentially
    for bab in [1, 2, 3]:
        output_path = os.path.join(revisi_dir, f"05-revisi-bab{bab}.md")
        if os.path.exists(output_path):
            print(f"\n  ⏭️  Bab {bab} sudah ada, dilewati: {output_path}")
            success_count += 1
            continue
        
        result = run_with_retry(run_revisi_bab, raw_text_path, tmp_dir, revisi_dir, bab, output_path)
        if result:
            success_count += 1
    
    # Revise Daftar Pustaka
    dapus_path = os.path.join(revisi_dir, "05-revisi-daftar-pustaka.md")
    if os.path.exists(dapus_path):
        print(f"\n  ⏭️  Daftar Pustaka sudah ada, dilewati: {dapus_path}")
        success_count += 1
    else:
        result = run_with_retry(run_revisi_daftar_pustaka, raw_text_path, tmp_dir, revisi_dir, dapus_path)
        if result:
            success_count += 1
    
    print(f"\n  Writing selesai: {success_count}/{total_items} berhasil")
    
    if success_count < total_items:
        print(f"\n⚠️  PERINGATAN: {total_items - success_count} item gagal. Verification tetap dijalankan.")
    
    # ─── STAGE 6: VERIFICATION PASS ────────────────────────
    print("\n" + "─" * 60)
    print("  STAGE 6: VERIFICATION PASS (QA)")
    print("─" * 60)
    
    verification_path = os.path.join(revisi_dir, "06-verification-pass.md")
    run_with_retry(run_verification, tmp_dir, revisi_dir, verification_path)
    
    # ─── STAGE 7: BUILD FINAL DOCUMENT ─────────────────────
    print("\n" + "─" * 60)
    print("  STAGE 7: BUILD FINAL DOCUMENT")
    print("─" * 60)
    
    try:
        from convert_to_word import run_build_document
        run_build_document(revisi_dir)
    except Exception as e:
        print(f"\n❌ ERROR saat kompilasi dokumen akhir: {e}")
    
    # ─── SUMMARY ───────────────────────────────────────────
    elapsed = time.time() - start_time
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)
    
    print("\n" + "=" * 60)
    print(f"  ✅ WRITING PIPELINE SELESAI! Waktu: {minutes}m {seconds}s")
    print(f"  📁 Hasil revisi: {revisi_dir}")
    print("=" * 60)
    
    # List output files
    print("\n  File yang dihasilkan:")
    for f in sorted(os.listdir(revisi_dir)):
        filepath = os.path.join(revisi_dir, f)
        size = os.path.getsize(filepath)
        status = "✅" if size > 100 else "⚠️ (terlalu kecil)"
        print(f"    {status} {f} ({size:,} bytes)")
    
    print()


if __name__ == "__main__":
    main()

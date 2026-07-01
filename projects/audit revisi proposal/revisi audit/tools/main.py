"""
main.py — Orkestrator Pipeline Audit (Fase A)
Menjalankan 6 agen audit secara berurutan (PUEBI, Register, Sitasi, Struktur,
Metodologi, Koherensi), lalu menghasilkan Final Report PDF.
Fitur: retry logic (3x), skip-if-exists, error isolation per agen.

=== CARA PAKAI (mode folder job — DIREKOMENDASIKAN) ===
  python tools/main.py audits/2026-07-01_upb_proposal-budi --pedoman upb

  Struktur folder job:
    audits/<nama-job>/input/<file>.pdf   ← taruh PDF mentah di sini
    audits/<nama-job>/work/              ← proses (otomatis dibuat)
    audits/<nama-job>/Final_Audit_Report.pdf  ← hasil (otomatis)

  Tiap job punya folder work/ sendiri → audit lama TIDAK PERNAH ketiban.

=== CARA PAKAI (mode file tunggal — legacy) ===
  python tools/main.py path/ke/file.pdf
  (Menulis ke .tmp/ global. Hanya untuk uji cepat, bukan arsip.)

=== FLAG ===
  --pedoman <kampus>   Muat aturan format kampus dari pedoman/<kampus>.json
                       (mis. upb, untan). Tanpa flag = audit tanpa konteks kampus.
  --fresh              Hapus hasil proses lama di folder job sebelum jalan
                       (paksa audit ulang dari nol).
"""
import sys
import os
import glob
import time

# Add tools directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from extract_pdf import extract_text_from_pdf
from audit_puebi import run_puebi_audit
from audit_register import run_register_audit
from audit_sitasi import run_sitasi_audit
from audit_struktur import run_structure_audit
from audit_metodologi import run_metodologi_audit
from audit_koherensi import run_koherensi_audit
from generate_pdf_report import generate_pdf

PROJECT_DIR = os.path.abspath(os.path.join(current_dir, ".."))


def run_with_retry(fn, *args, max_retries=3, delay=30):
    """
    Menjalankan fungsi dengan retry logic.
    Jika gagal, tunggu `delay` detik lalu coba lagi (max 3x).
    Mengembalikan True jika berhasil, False jika gagal setelah semua retry.
    """
    for attempt in range(1, max_retries + 1):
        try:
            fn(*args)
            return True
        except Exception as e:
            error_type = type(e).__name__
            if attempt < max_retries:
                wait = delay * attempt  # exponential backoff: 30s, 60s, 90s
                print(f"\n  [!]  Attempt {attempt}/{max_retries} GAGAL: {error_type}")
                print(f"      {str(e)[:200]}")
                print(f"      Menunggu {wait}s sebelum retry...\n")
                time.sleep(wait)
            else:
                print(f"\n  [X] GAGAL setelah {max_retries} percobaan: {error_type}")
                print(f"      {str(e)[:300]}")
                print(f"      Agen ini dilewati. Pipeline melanjutkan ke agen berikutnya.\n")
                return False


def should_skip(filepath):
    """Cek apakah file sudah ada dan cukup besar (> 100 bytes)."""
    if os.path.exists(filepath) and os.path.getsize(filepath) > 100:
        return True
    return False


def parse_args(argv):
    """
    Pisahkan argumen posisional (target) dari flag.
    Return dict: {target, pedoman, fresh}.
    """
    target = None
    pedoman = None
    fresh = False
    i = 0
    while i < len(argv):
        arg = argv[i]
        if arg == "--pedoman":
            if i + 1 >= len(argv):
                sys.exit("[X] --pedoman butuh nama kampus, mis. --pedoman upb")
            pedoman = argv[i + 1]
            i += 2
        elif arg.startswith("--pedoman="):
            pedoman = arg.split("=", 1)[1]
            i += 1
        elif arg == "--fresh":
            fresh = True
            i += 1
        elif target is None:
            target = arg
            i += 1
        else:
            print(f"  [!]  Argumen tidak dikenal, diabaikan: {arg}")
            i += 1
    return {"target": target, "pedoman": pedoman, "fresh": fresh}


def apply_pedoman(pedoman_name):
    """Resolusi pedoman/<nama>.json → set env AUDIT_PEDOMAN. Return path atau None."""
    if not pedoman_name:
        print("  [!] Pedoman kampus: (tidak diset) - audit tanpa konteks format kampus.")
        return None
    pedoman_dir = os.path.join(PROJECT_DIR, "pedoman")
    pedoman_path = os.path.join(pedoman_dir, f"{pedoman_name}.json")
    if not os.path.exists(pedoman_path):
        available = [
            os.path.splitext(os.path.basename(p))[0]
            for p in glob.glob(os.path.join(pedoman_dir, "*.json"))
        ]
        sys.exit(
            f"[X] Pedoman '{pedoman_name}' tidak ada di pedoman/.\n"
            f"   Tersedia: {', '.join(available) if available else '(kosong)'}\n"
            f"   Kampus baru? Salin pedoman/upb.json → pedoman/{pedoman_name}.json lalu ubah isinya."
        )
    os.environ["AUDIT_PEDOMAN"] = pedoman_path
    print(f"  [OK] Pedoman kampus: {pedoman_name}  ({pedoman_path})")
    return pedoman_path


def resolve_target(target):
    """
    Tentukan mode & path berdasarkan argumen target.
    Return dict: {pdf_input, work_dir, final_pdf, mode, job_label}.
    """
    if target is None:
        # Default legacy: .tmp/proposal.pdf
        target = os.path.join(PROJECT_DIR, ".tmp", "proposal.pdf")

    abs_target = os.path.abspath(target)

    # ── MODE JOB: target adalah folder ──
    if os.path.isdir(abs_target):
        job_dir = abs_target
        input_dir = os.path.join(job_dir, "input")
        # Cari PDF di input/ dulu, lalu di folder job langsung
        pdfs = sorted(glob.glob(os.path.join(input_dir, "*.pdf")))
        if not pdfs:
            pdfs = sorted(glob.glob(os.path.join(job_dir, "*.pdf")))
        if not pdfs:
            sys.exit(
                f"[X] Tidak ada PDF di folder job.\n"
                f"   Taruh file di: {os.path.join(input_dir, '<nama>.pdf')}"
            )
        if len(pdfs) > 1:
            print(f"  [!]  Ada {len(pdfs)} PDF, pakai yang pertama: {os.path.basename(pdfs[0])}")
        return {
            "pdf_input": pdfs[0],
            "work_dir": os.path.join(job_dir, "work"),
            "final_pdf": os.path.join(job_dir, "Final_Audit_Report.pdf"),
            "mode": "job",
            "job_label": os.path.basename(job_dir.rstrip(os.sep)),
        }

    # ── MODE LEGACY: target adalah file PDF ──
    if abs_target.lower().endswith(".pdf"):
        if not os.path.isfile(abs_target):
            sys.exit(f"[X] File PDF tidak ditemukan: {abs_target}")
        return {
            "pdf_input": abs_target,
            "work_dir": os.path.join(PROJECT_DIR, ".tmp"),
            "final_pdf": os.path.join(PROJECT_DIR, "Final_Audit_Report.pdf"),
            "mode": "legacy",
            "job_label": os.path.basename(abs_target),
        }

    sys.exit(
        f"[X] Target tidak valid: {target}\n"
        f"   Beri folder job (mis. audits/2026-07-01_upb_budi) "
        f"atau path ke file .pdf."
    )


def clean_work(work_dir):
    """Hapus file proses lama (untuk --fresh). .gitkeep dibiarkan."""
    if not os.path.isdir(work_dir):
        return
    removed = 0
    for f in glob.glob(os.path.join(work_dir, "*")):
        if os.path.basename(f) == ".gitkeep":
            continue
        if os.path.isfile(f):
            os.remove(f)
            removed += 1
    if removed:
        print(f"  [CLEAN] --fresh: {removed} file proses lama dihapus dari work/")


def main():
    start_time = time.time()
    opts = parse_args(sys.argv[1:])
    cfg = resolve_target(opts["target"])

    work_dir = cfg["work_dir"]
    os.makedirs(work_dir, exist_ok=True)

    if opts["fresh"]:
        clean_work(work_dir)

    print("=" * 60)
    print("  AGENTIC PROPOSAL AUDIT — FASE A (6 AGEN AUDIT)")
    print("=" * 60)
    print(f"  Mode   : {cfg['mode']}  ({cfg['job_label']})")
    print(f"  Input  : {cfg['pdf_input']}")
    print(f"  Kerja  : {work_dir}")
    print(f"  Output : {cfg['final_pdf']}")
    apply_pedoman(opts["pedoman"])
    print("=" * 60)

    # Define all intermediate file paths (di dalam work_dir job)
    paths = {
        "raw":        os.path.join(work_dir, "01-raw-extraction.txt"),
        "puebi":      os.path.join(work_dir, "02-audit-puebi.md"),
        "register":   os.path.join(work_dir, "03-audit-register.md"),
        "sitasi":     os.path.join(work_dir, "04-audit-sitasi.md"),
        "struktur":   os.path.join(work_dir, "05-audit-struktur.md"),
        "metodologi": os.path.join(work_dir, "06-audit-metodologi.md"),
        "koherensi":  os.path.join(work_dir, "07-audit-koherensi.md"),
        "final_pdf":  cfg["final_pdf"],
    }

    # ─── STAGE 0: Extraction ────────────────────────────────
    print("\n>> STAGE 0: Mengekstrak teks dari PDF...")
    extract_text_from_pdf(cfg["pdf_input"], paths["raw"])

    # ─── LAYER 1: Audit Permukaan (PUEBI, Register, Sitasi) ─
    print("\n" + "─" * 60)
    print("  LAYER 1: AUDIT PERMUKAAN (PUEBI, Register, Sitasi)")
    print("─" * 60)

    success_count = 0
    total_agents = 6

    agents = [
        ("Agen 1/6 — PUEBI",      paths["puebi"],      run_puebi_audit),
        ("Agen 2/6 — Register",    paths["register"],   run_register_audit),
        ("Agen 3/6 — Sitasi",      paths["sitasi"],     run_sitasi_audit),
    ]

    for label, output_path, fn in agents:
        if should_skip(output_path):
            print(f"\n  [>>]  {label} sudah ada, dilewati: {os.path.basename(output_path)}")
            success_count += 1
        else:
            if run_with_retry(fn, paths["raw"], output_path):
                success_count += 1

    # ─── LAYER 2: Audit Substansi (Struktur, Metodologi, Koherensi) ─
    print("\n" + "─" * 60)
    print("  LAYER 2: AUDIT SUBSTANSI (Struktur, Metodologi, Koherensi)")
    print("─" * 60)

    agents_l2 = [
        ("Agen 4/6 — Struktur",    paths["struktur"],    run_structure_audit),
        ("Agen 5/6 — Metodologi",  paths["metodologi"],  run_metodologi_audit),
        ("Agen 6/6 — Koherensi",   paths["koherensi"],   run_koherensi_audit),
    ]

    for label, output_path, fn in agents_l2:
        if should_skip(output_path):
            print(f"\n  [>>]  {label} sudah ada, dilewati: {os.path.basename(output_path)}")
            success_count += 1
        else:
            if run_with_retry(fn, paths["raw"], output_path):
                success_count += 1

    print(f"\n  Audit selesai: {success_count}/{total_agents} agen berhasil")

    if success_count < total_agents:
        print(f"  [!]  {total_agents - success_count} agen gagal. Lihat log di atas untuk detail.")

    # ─── LAYER 3: Konsolidasi & PDF ────────────────────────
    print("\n" + "─" * 60)
    print("  LAYER 3: KONSOLIDASI FINAL REPORT")
    print("─" * 60)

    # Combine all 6 audit reports into one markdown
    combined_md_path = os.path.join(work_dir, "08-combined-report.md")

    report_files = [
        ("AUDIT PUEBI & EJAAN", paths["puebi"]),
        ("AUDIT REGISTER & BAHASA AKADEMIK", paths["register"]),
        ("AUDIT SITASI & DAFTAR PUSTAKA", paths["sitasi"]),
        ("AUDIT STRUKTUR & RESEARCH GAP", paths["struktur"]),
        ("AUDIT METODOLOGI BAB III", paths["metodologi"]),
        ("AUDIT KOHERENSI & BENANG MERAH", paths["koherensi"]),
    ]

    with open(combined_md_path, 'w', encoding='utf-8') as combined:
        combined.write("# LAPORAN AUDIT PROPOSAL — TIER PRO MAX\n\n")
        combined.write("---\n\n")

        for title, filepath in report_files:
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                combined.write(f"\n\n---\n\n# {title}\n\n")
                combined.write(content)
                combined.write("\n")
            else:
                combined.write(f"\n\n---\n\n# {title}\n\n*[!] File tidak ditemukan: {filepath}*\n")

    print(f"  Combined report saved to {combined_md_path}")

    # Generate PDF from combined markdown
    try:
        generate_pdf(combined_md_path, None, paths["final_pdf"])
    except Exception as e:
        print(f"  [!]  PDF generation gagal: {e}")
        print(f"  [PDF]  Anda masih bisa membaca laporan di: {combined_md_path}")

    elapsed = time.time() - start_time
    minutes = int(elapsed // 60)
    seconds = int(elapsed % 60)

    print("\n" + "=" * 60)
    print(f"  [OK] AUDIT SELESAI! Waktu: {minutes}m {seconds}s")
    print(f"  [PDF] Laporan: {paths['final_pdf']}")
    print(f"  [DIR] File detail: {work_dir}")
    print(f"  [INFO] Berhasil: {success_count}/{total_agents} agen")
    print("=" * 60)

if __name__ == "__main__":
    main()


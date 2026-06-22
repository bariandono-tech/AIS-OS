import os
import json
import argparse
from datetime import datetime
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.table import Table
from .workflow import AuditWorkflow

console = Console()

def print_banner():
    """
    Mencetak banner program.
    """
    banner_text = Text()
    banner_text.append("=== AuditDok CLI v1.1 ===\n", style="bold white")
    banner_text.append("Jasa Audit Dokumen Berbasis AI Agent (WAT Framework)\n", style="italic cyan")
    banner_text.append("Tier: Basic (2-pass) | Plus (3-pass)", style="dim white")
    
    console.print(Panel(
        banner_text,
        title="[bold blue]AuditDok[/bold blue]",
        border_style="blue",
        padding=(1, 2),
        expand=False
    ))

def log_order(client_name, file_path, tier, skill_type, status, output_dir):
    """
    Mencatat atau memperbarui status order ke file orders.json untuk tracking.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    log_path = os.path.normpath(os.path.join(current_dir, "..", "orders.json"))
    
    # Baca data yang sudah ada
    orders = []
    if os.path.exists(log_path):
        try:
            with open(log_path, "r", encoding="utf-8") as f:
                orders = json.load(f)
        except (json.JSONDecodeError, IOError):
            orders = []
    
    file_basename = os.path.basename(file_path)
    
    # Cari apakah ada order 'draft' dari klien dan file yang sama untuk di-update
    updated = False
    for order in orders:
        if (order.get("client") == client_name and 
            order.get("file") == file_basename and 
            order.get("status") == "draft"):
            
            order["status"] = status
            order["tier"] = tier
            order["type"] = skill_type
            order["output_dir"] = output_dir
            order["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            updated = True
            break
            
    if not updated:
        # Tambah order baru
        order = {
            "id": len(orders) + 1,
            "client": client_name,
            "file": file_basename,
            "tier": tier,
            "type": skill_type,
            "status": status,
            "output_dir": output_dir,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        orders.append(order)
    else:
        # Untuk return value
        order = [o for o in orders if o.get("client") == client_name and o.get("file") == file_basename][-1]
    
    # Simpan
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(orders, f, indent=2, ensure_ascii=False)
    
    return order

def find_draft_order_by_compile_path(compile_path):
    """
    Mencari draft order di orders.json yang cocok dengan path file yang di-compile.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    log_path = os.path.normpath(os.path.join(current_dir, "..", "orders.json"))
    if not os.path.exists(log_path):
        return None
    try:
        with open(log_path, "r", encoding="utf-8") as f:
            orders = json.load(f)
    except Exception:
        return None
        
    compile_path = os.path.normpath(os.path.abspath(compile_path))
    compile_basename = os.path.basename(compile_path)
    
    # 1. Coba pencarian presisi: status 'draft' dan file base name cocok (iterasi terbalik / terbaru dahulu)
    for order in reversed(orders):
        if order.get("status") != "draft":
            continue
        
        order_file = order.get("file", "")
        order_file_base = os.path.splitext(order_file)[0]
        
        if order_file_base and order_file_base.lower() in compile_basename.lower():
            order_out = os.path.normpath(os.path.abspath(order.get("output_dir", "")))
            if os.path.dirname(compile_path) == order_out or compile_path.startswith(order_out):
                return order
                
    # 2. Pencarian fallback: status 'draft' dan nama file asal dicocokkan tanpa cek output_dir
    for order in reversed(orders):
        if order.get("status") != "draft":
            continue
        order_file = order.get("file", "")
        order_file_base = os.path.splitext(order_file)[0]
        if order_file_base and order_file_base.lower() in compile_basename.lower():
            return order
            
    return None

def main():
    print_banner()
    
    parser = argparse.ArgumentParser(description="AuditDok: Audit Dokumen Berbasis AI Agent")
    parser.add_argument("--file", "-f", default=None, help="Path ke file dokumen (.pdf atau .docx)")
    parser.add_argument("--tier", "-t", default="basic", choices=["basic", "plus"], help="Tier layanan: basic (2-pass) atau plus (3-pass)")
    parser.add_argument("--type", "-y", default="makalah", help="Jenis dokumen / Skill (nama file di folder skills tanpa .md)")
    parser.add_argument("--client", "-n", default="Umum", help="Nama klien (untuk tracking order)")
    parser.add_argument("--focus", "-c", default="", help="Fokus atau permintaan khusus tambahan")
    parser.add_argument("--output", "-o", default="output", help="Folder tujuan penyimpanan hasil")
    parser.add_argument("--provider", "-p", default="gemini", choices=["gemini", "claude"], help="Provider LLM")
    parser.add_argument("--model", "-m", default=None, help="Nama model spesifik (opsional)")
    parser.add_argument("--compile", "-compile", default=None, help="Path ke file markdown hasil audit untuk dicompile langsung ke PDF (Mode Offline/Tanpa API)")
    parser.add_argument("--prompt-only", "-po", action="store_true", help="Hanya susun file prompt gabungan untuk di-copy ke Web AI (Mode Gratis/Bebas Kuota)")
    parser.add_argument("--draft-first", "-df", action="store_true", help="Hanya jalankan audit AI dan simpan ke file Markdown draft (.md) untuk di-review terlebih dahulu (Hybrid HITL)")
    
    args = parser.parse_args()
    
    # --- PILIHAN 1: MODE COMPILE MANUAL ---
    if args.compile:
        if not os.path.exists(args.compile):
            console.print(f"[bold red][ERROR] File markdown '{args.compile}' tidak ditemukan![/bold red]")
            return
            
        console.print(f"[bold green][OK][/bold green] Memulai kompilasi PDF manual dari: [yellow]{args.compile}[/yellow]")
        os.makedirs(args.output, exist_ok=True)
        
        base_name = os.path.splitext(os.path.basename(args.compile))[0]
        # Jika nama file draft mengandung '_laporan_audit_draft', kita bisa ganti menjadi '_laporan_audit' untuk PDF
        pdf_base_name = base_name.replace("_laporan_audit_draft", "_laporan_audit")
        pdf_output_path = os.path.join(args.output, f"{pdf_base_name}.pdf")
        
        try:
            from .generator import generate_pdf_report, generate_markdown_files
            with open(args.compile, "r", encoding="utf-8") as f:
                markdown_content = f.read()
                
            actual_path = generate_pdf_report(markdown_content, pdf_output_path, metadata={"compiler": "Manual (ReportLab)"})
            console.print(f"\n[bold green][OK] Kompilasi berhasil! PDF disimpan di:[/bold green]\n[yellow]{os.path.abspath(actual_path)}[/yellow]\n")
            
            # Cari draft order yang sesuai di orders.json
            order = find_draft_order_by_compile_path(args.compile)
            
            tier = "plus"
            client = "Umum"
            file_name = os.path.basename(args.compile)
            skill_type = "makalah"
            output_dir = args.output
            
            if order:
                tier = order.get("tier", "plus")
                client = order.get("client", "Umum")
                file_name = order.get("file", file_name)
                skill_type = order.get("type", "makalah")
                output_dir = order.get("output_dir", args.output)
            
            # Ekstrak checklist & minimap jika draft order tier adalah 'plus' atau default ke 'plus'
            if tier == "plus":
                console.print(f"[bold green][OK][/bold green] Mengekstrak checklist tindakan & minimap...")
                generate_markdown_files(markdown_content, output_dir)
                console.print(f"      Checklist & minimap disimpan di: [yellow]{os.path.abspath(output_dir)}[/yellow]")
                
            if order:
                log_order(client, file_name, tier, skill_type, "success", output_dir)
                console.print(f"\n [dim]Order #{order['id']} status diubah dari 'draft' menjadi 'success' di orders.json[/dim]")
                
        except Exception as e:
            console.print(f"[bold red][ERROR] Gagal mengkompilasi PDF: {e}[/bold red]")
        return
        
    # --- VALIDASI PARAMETER UNTUK MODE NON-COMPILE ---
    if not args.file:
        console.print("[bold red][ERROR] Argumen --file (-f) wajib diisi kecuali Anda menggunakan mode --compile![/bold red]")
        return
        
    if not os.path.exists(args.file):
        console.print(f"[bold red][ERROR] File '{args.file}' tidak ditemukan![/bold red]")
        return
        
    passes = 2 if args.tier == "basic" else 3
    console.print(f"[bold green][OK][/bold green] Menyiapkan workflow audit untuk:")
    console.print(f"    - Klien  : [yellow]{args.client}[/yellow]")
    console.print(f"    - Berkas : [yellow]{args.file}[/yellow]")
    console.print(f"    - Tier   : [yellow]{args.tier.upper()} ({passes}-pass audit)[/yellow]")
    console.print(f"    - Skill  : [yellow]{args.type}[/yellow]")
    if args.focus:
        console.print(f"    - Fokus  : [yellow]{args.focus}[/yellow]")
    if args.prompt_only:
        console.print("    - Mode   : [yellow]PROMPT-ONLY (Copy-Paste Gratis)[/yellow]\n")
    elif args.draft_first:
        console.print("    - Mode   : [yellow]DRAFT-FIRST (Hybrid HITL - Lewati PDF)[/yellow]\n")
    else:
        console.print(f"    - Engine : [yellow]{args.provider.upper()} ({args.model or 'Default'})[/yellow]\n")
    
    # Jalankan Workflow
    use_gemini = (args.provider == "gemini")
    workflow = AuditWorkflow(use_gemini=use_gemini, model_name=args.model)
    
    result = workflow.run(
        file_path=args.file,
        tier=args.tier,
        skill_type=args.type,
        focus_prompt=args.focus,
        output_dir=args.output,
        prompt_only=args.prompt_only,
        draft_only=args.draft_first
    )
        
    if result["status"] == "success":
        console.print("\n[bold green][OK] PROSES SELESAI DENGAN SUKSES![/bold green]\n")
        
        # Cetak Tabel Hasil
        table = Table(title="Berkas Deliverable Hasil", show_header=True, header_style="bold magenta")
        table.add_column("Tipe Deliverable", style="cyan")
        table.add_column("Lokasi File", style="green")
        
        for key, filepath in result["results"].items():
            table.add_row(key.upper(), os.path.abspath(filepath))
                
        console.print(table)
        
        # Cetak Statistik Dokumen
        meta = result["metadata"]
        console.print(f"\n Statistik: Halaman: [yellow]{meta.get('pages', 'N/A')}[/yellow] | Kata: [yellow]{meta.get('words', 0)}[/yellow] | Karakter: [yellow]{meta.get('characters', 0)}[/yellow] | Tabel: [yellow]{meta.get('tables_count', 0)}[/yellow]")
        
        # Log order (jika bukan mode prompt-only)
        if not args.prompt_only:
            status = "draft" if args.draft_first else "success"
            order = log_order(args.client, args.file, args.tier, args.type, status, args.output)
            console.print(f"\n [dim]Order #{order['id']} tercatat di orders.json dengan status '{status}'[/dim]")
        else:
            console.print(f"\n[bold yellow][TIPS][/bold yellow] Buka berkas [cyan]prompt_manual.txt[/cyan] di atas, copy isinya, paste ke ChatGPT/Claude/Gemini Advanced untuk audit gratis.")
            console.print("Setelah mendapat respon teks utuh, simpan teks tersebut ke file markdown (misal: laporan.md).")
            console.print("Gunakan perintah [cyan]--compile [path_file_markdown][/cyan] untuk mengubahnya menjadi PDF profesional.")
    else:
        console.print(f"\n[bold red][FAIL] PROSES AUDIT GAGAL: {result['message']}[/bold red]\n")
        if not args.prompt_only:
            log_order(args.client, args.file, args.tier, args.type, "failed", args.output)

if __name__ == "__main__":
    main()

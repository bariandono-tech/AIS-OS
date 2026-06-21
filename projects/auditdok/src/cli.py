import os
import argparse
from rich.console import Console
from rich.panel import Panel
from rich.text import Text
from rich.table import Table
from .workflow import AuditWorkflow

console = Console()

def print_banner():
    """
    Mencetak banner program yang estetis dan premium.
    """
    banner_text = Text()
    banner_text.append("=== AuditDok CLI v1.0 ===\n", style="bold white")
    banner_text.append("Jasa Audit Dokumen Berbasis AI Agent (WAT Framework)\n", style="italic cyan")
    banner_text.append("Terinspirasi dari Karpathy Method & Vibe Coding", style="dim white")
    
    console.print(Panel(
        banner_text,
        title="[bold blue]AuditDok[/bold blue]",
        border_style="blue",
        padding=(1, 2),
        expand=False
    ))

def main():
    print_banner()
    
    parser = argparse.ArgumentParser(description="AuditDok: Audit Dokumen Berbasis AI Agent")
    parser.add_argument("--file", "-f", required=True, help="Path ke file dokumen (.pdf atau .docx) yang akan diaudit")
    parser.add_argument("--tier", "-t", default="basic", choices=["basic", "plus", "pro", "ultra"], help="Tier layanan audit")
    parser.add_argument("--type", "-y", default="makalah", choices=["makalah", "proposal_skripsi", "laporan_keuangan"], help="Jenis dokumen / Skill yang digunakan")
    parser.add_argument("--focus", "-c", default="", help="Fokus atau permintaan khusus tambahan untuk audit")
    parser.add_argument("--output", "-o", default="output", help="Folder tujuan penyimpanan hasil audit")
    parser.add_argument("--provider", "-p", default="gemini", choices=["gemini", "claude"], help="Provider LLM yang digunakan")
    parser.add_argument("--model", "-m", default=None, help="Nama model spesifik (opsional)")
    
    args = parser.parse_args()
    
    # Validasi file
    if not os.path.exists(args.file):
        console.print(f"[bold red][ERROR] File '{args.file}' tidak ditemukan![/bold red]")
        return
        
    console.print(f"[bold green][OK][/bold green] Menyiapkan workflow audit untuk:")
    console.print(f"    - Berkas : [yellow]{args.file}[/yellow]")
    console.print(f"    - Tier   : [yellow]{args.tier.upper()}[/yellow]")
    console.print(f"    - Skill  : [yellow]{args.type}[/yellow]")
    if args.focus:
        console.print(f"    - Fokus  : [yellow]{args.focus}[/yellow]")
    console.print(f"    - Engine : [yellow]{args.provider.upper()} ({args.model or 'Default Model'})[/yellow]\n")
    
    # Jalankan Workflow
    use_gemini = (args.provider == "gemini")
    workflow = AuditWorkflow(use_gemini=use_gemini, model_name=args.model)
    
    with console.status("[bold blue]Sedang menjalankan proses audit dokumen...[/bold blue]", spinner="dots"):
        result = workflow.run(
            file_path=args.file,
            tier=args.tier,
            skill_type=args.type,
            focus_prompt=args.focus,
            output_dir=args.output
        )
        
    if result["status"] == "success":
        console.print("\n[bold green][OK] PROSES AUDIT SELESAI DENGAN SUKSES![/bold green]\n")
        
        # Cetak Tabel Hasil
        table = Table(title="Berkas Deliverable Hasil Audit", show_header=True, header_style="bold magenta")
        table.add_column("Tipe Deliverable", style="cyan")
        table.add_column("Lokasi File", style="green")
        
        for key, filepath in result["results"].items():
            if key != "human_review_required":
                table.add_row(key.upper(), os.path.abspath(filepath))
                
        console.print(table)
        
        # Cetak Statistik Dokumen
        meta = result["metadata"]
        console.print(f"\n[bold blue][i] Statistik Dokumen:[/i][/bold blue] Halaman: [yellow]{meta.get('pages', 'N/A')}[/yellow] | Kata: [yellow]{meta.get('words', 0)}[/yellow] | Karakter: [yellow]{meta.get('characters', 0)}[/yellow] | Tabel: [yellow]{meta.get('tables_count', 0)}[/yellow]")
        
        if "human_review_required" in result["results"]:
            console.print(Panel(
                "[bold red]PERHATIAN: Laporan tier ULTRA mendeteksi perlunya REVIEW MANUAL.[/bold red]\n"
                "Harap tinjau berkas draf laporan di atas, lakukan edit jika diperlukan, "
                "dan serahkan kepada klien setelah disetujui.",
                title="[bold yellow]Protokol Kepercayaan (HITL)[/bold yellow]",
                border_style="yellow"
            ))
    else:
        console.print(f"\n[bold red][FAIL] PROSES AUDIT GAGAL: {result['message']}[/bold red]\n")

if __name__ == "__main__":
    main()

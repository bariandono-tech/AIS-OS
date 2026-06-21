import os
from .parser import parse_document
from .agent import AuditAgent
from .generator import generate_pdf_report, generate_markdown_files

class AuditWorkflow:
    def __init__(self, use_gemini=True, model_name=None):
        self.agent = AuditAgent(use_gemini=use_gemini, model_name=model_name)
        
        # Cari lokasi folder skills
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.skills_dir = os.path.normpath(os.path.join(current_dir, "..", "skills"))

    def _load_skill_prompt(self, skill_type):
        """
        Membaca isi file Markdown dari pustaka Skills.
        """
        skill_filename = f"{skill_type}.md"
        skill_path = os.path.join(self.skills_dir, skill_filename)
        
        if not os.path.exists(skill_path):
            print(f"[INFO] Skill '{skill_type}' tidak ditemukan di {skill_path}. Menggunakan audit umum.")
            return """# SKILL: General Document Audit
            Anda adalah editor profesional. Periksa struktur dokumen, kejelasan bahasa, dan tata cara penulisan agar rapi dan terstandar."""
            
        with open(skill_path, "r", encoding="utf-8") as f:
            return f.read()

    def run(self, file_path, tier, skill_type, focus_prompt="", output_dir="output"):
        """
        Menjalankan orkestrasi alur kerja audit berdasarkan Tier layanan.
        """
        print(f"\n[1/4] Memulai parsing berkas: {file_path}...")
        try:
            document_text, metadata = parse_document(file_path)
            print(f"      Berhasil! {metadata.get('words', 0)} kata dibaca.")
        except Exception as e:
            return {"status": "error", "message": f"Gagal membaca file: {e}"}

        print(f"[2/4] Memuat pustaka skill: {skill_type}...")
        system_instruction = self._load_skill_prompt(skill_type)

        # Modifikasi instruksi berdasarkan tier
        tier = tier.lower()
        tier_instruction = system_instruction
        if tier == "basic":
            tier_instruction += "\n\nPENTING: Buat laporan sangat ringkas (maksimal 1-2 halaman PDF), fokus pada skor evaluasi dan temuan paling kritis saja."
        elif tier == "plus":
            tier_instruction += "\n\nPENTING: Laporan harus disertai dengan CHECKLIST TINDAKAN (PRD Format) yang terstruktur per-bagian beserta contoh konkret sebelum vs sesudah."
        elif tier == "pro":
            tier_instruction += "\n\nPENTING: Laporan wajib disertai CHECKLIST perbaikan, plus struktur MINDMAP konsep bertingkat menggunakan format nested bullet points, serta kode diagram alur logis menggunakan sintaks Mermaid.js."
        elif tier == "ultra":
            tier_instruction += "\n\nPENTING: Lakukan audit komprehensif tanpa batasan panjang. Sertakan analisis struktur mendalam, checklist tindakan per-bagian, mindmap bertingkat, dan berikan draf perbaikan penulisan ulang teks yang lebih mengalir dan alami untuk bab-bab utama."

        print(f"[3/4] Mengirim konten ke AI Agent ({self.agent.model}) untuk di-audit...")
        audit_result = self.agent.run_audit(tier_instruction, document_text, focus_prompt)

        print(f"[4/4] Membuat berkas output di direktori: {output_dir}...")
        os.makedirs(output_dir, exist_ok=True)
        
        # Path untuk file PDF
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        pdf_output_path = os.path.join(output_dir, f"{base_name}_laporan_audit.pdf")
        
        # Generate files berdasarkan tier
        results = {}
        
        if tier == "basic":
            generate_pdf_report(audit_result, pdf_output_path, metadata)
            results["pdf"] = pdf_output_path
        else:
            # Plus, Pro, Ultra generate Markdown files
            generate_pdf_report(audit_result, pdf_output_path, metadata)
            markdown_paths = generate_markdown_files(audit_result, output_dir)
            results["pdf"] = pdf_output_path
            results.update(markdown_paths)
            
        if tier == "ultra":
            print("\n" + "="*60)
            print("[HUMAN REVIEW REQUIRED] - PROTOKOL KEPERCAYAAN")
            print("Akun ini merupakan order tier ULTRA.")
            print(f"Laporan audit dan draf mentah telah dibuat di folder: {output_dir}")
            print("Harap tinjau, edit draf final, lalu setujui sebelum mengirimkan ke klien.")
            print("="*60 + "\n")
            results["human_review_required"] = True
            
        print("Proses audit selesai dengan sukses!")
        return {"status": "success", "results": results, "metadata": metadata}

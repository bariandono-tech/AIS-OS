import os
import json
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

    def _run_multi_pass(self, system_instruction, document_text, tier, focus_prompt=""):
        """
        Menjalankan audit multi-pass sesuai tier layanan:
        - Basic: 2 pass (Review Umum + Fokus Spesifik)
        - Plus:  3 pass (Review Umum + Fokus Spesifik + Checklist Detail)
        """
        all_results = []
        
        # --- PASS 1: Review Umum (Semua Tier) ---
        print("      [Pass 1/{}] Review umum struktur & bahasa...".format(
            2 if tier == "basic" else 3
        ))
        pass1_prompt = (
            "PASS 1 - REVIEW UMUM:\n"
            "Lakukan review umum terhadap dokumen ini. Fokus pada:\n"
            "- Skor kualitas keseluruhan (skala 1-10)\n"
            "- Struktur dokumen (apakah bab/bagian sudah lengkap?)\n"
            "- Kesalahan ejaan dan tata bahasa\n"
            "- Konsistensi istilah dan format penomoran\n\n"
            f"Dokumen:\n{document_text}"
        )
        if focus_prompt:
            pass1_prompt += f"\n\nFokus Tambahan: {focus_prompt}"
        
        result1 = self.agent.run_audit(system_instruction, pass1_prompt)
        all_results.append("# PASS 1: Review Umum\n\n" + result1)
        
        # --- PASS 2: Fokus Spesifik (Semua Tier) ---
        print("      [Pass 2/{}] Analisis fokus spesifik per-bagian...".format(
            2 if tier == "basic" else 3
        ))
        pass2_instruction = system_instruction + (
            "\n\nKONTEKS: Anda sudah melakukan review umum dan menemukan masalah. "
            "Sekarang lakukan analisis mendalam per-bagian dokumen. "
            "Untuk SETIAP temuan, berikan:\n"
            "- Lokasi/Bagian yang bermasalah\n"
            "- Jenis Masalah (Struktur/Bahasa/Logika)\n"
            "- Tingkat Keparahan (Kritis/Penting/Opsional)\n"
            "- Contoh teks 'Sebelum' dan saran perbaikan 'Sesudah'\n"
        )
        pass2_prompt = (
            "PASS 2 - ANALISIS FOKUS:\n"
            f"Berdasarkan review umum sebelumnya, berikut temuan awal:\n{result1[:500]}...\n\n"
            "Sekarang lakukan deep-dive ke setiap bagian dokumen dan berikan temuan detail.\n\n"
            f"Dokumen asli:\n{document_text}"
        )
        
        result2 = self.agent.run_audit(pass2_instruction, pass2_prompt)
        all_results.append("\n\n# PASS 2: Analisis Fokus Per-Bagian\n\n" + result2)
        
        # --- PASS 3: Checklist & Mindmap (Hanya Plus) ---
        if tier == "plus":
            print("      [Pass 3/3] Menyusun checklist tindakan & mindmap...")
            pass3_instruction = system_instruction + (
                "\n\nTUGAS AKHIR: Berdasarkan seluruh temuan audit, buatkan:\n"
                "1. CHECKLIST TINDAKAN (format '- [ ] ...') yang terstruktur per-bagian\n"
                "   dengan prioritas (Kritis/Penting/Opsional) dan contoh perbaikan konkret\n"
                "2. STRUKTUR MINDMAP KONSEP menggunakan nested bullet points\n"
                "3. DIAGRAM ALUR menggunakan sintaks Mermaid.js (```mermaid ... ```)\n"
            )
            pass3_prompt = (
                "PASS 3 - KOMPILASI CHECKLIST & VISUAL:\n"
                f"Temuan Pass 1:\n{result1[:800]}...\n\n"
                f"Temuan Pass 2:\n{result2[:800]}...\n\n"
                "Susun checklist tindakan lengkap, mindmap konsep, dan diagram Mermaid."
            )
            
            result3 = self.agent.run_audit(pass3_instruction, pass3_prompt)
            all_results.append("\n\n# PASS 3: Checklist & Mindmap\n\n" + result3)
        
        return "\n".join(all_results)

    def run(self, file_path, tier, skill_type, focus_prompt="", output_dir="output", prompt_only=False, draft_only=False):
        """
        Menjalankan orkestrasi alur kerja audit berdasarkan Tier layanan.
        """
        tier = tier.lower()
        total_passes = 2 if tier == "basic" else 3
        
        print(f"\n[1/4] Memulai parsing berkas: {file_path}...")
        try:
            document_text, metadata = parse_document(file_path)
            print(f"      Berhasil! {metadata.get('words', 0)} kata dibaca.")
        except Exception as e:
            return {"status": "error", "message": f"Gagal membaca file: {e}"}

        print(f"[2/4] Memuat pustaka skill: {skill_type}...")
        system_instruction = self._load_skill_prompt(skill_type)

        # MODE PROMPT-ONLY (Untuk Manual Copy-Paste Gratis)
        if prompt_only:
            print(f"[3/4] [PROMPT-ONLY] Menyusun berkas prompt manual...")
            os.makedirs(output_dir, exist_ok=True)
            prompt_file_path = os.path.join(output_dir, "prompt_manual.txt")
            
            task_instruction = ""
            if tier == "basic":
                task_instruction = (
                    "Lakukan audit terhadap dokumen di atas berdasarkan panduan/SOP. Hasilkan laporan terstruktur yang memuat:\n"
                    "1. Skor Evaluasi (skala 1-10)\n"
                    "2. Temuan Utama (Daftar Masalah), di mana untuk setiap masalah wajib dicantumkan:\n"
                    "   - Lokasi/Bagian: (misalnya: Bab I Latar Belakang)\n"
                    "   - Jenis Masalah: (Struktur / Bahasa / Logika)\n"
                    "   - Tingkat Keparahan: (Kritis / Penting / Opsional)\n"
                    "   - Deskripsi: Penjelasan mengapa salah.\n"
                    "   - Sebelum: Kutipan teks bermasalah.\n"
                    "   - Sesudah: Contoh kalimat perbaikan. PENTING: Istilah asing yang harus dicetak miring WAJIB dibungkus dengan format italic Markdown (seperti *italic*).\n\n"
                    "Buat laporan ringkas dan berfokus pada temuan paling kritis saja."
                )
            else:
                task_instruction = (
                    "Lakukan audit terhadap dokumen di atas berdasarkan panduan/SOP. Hasilkan laporan terstruktur yang memuat:\n"
                    "1. Skor Evaluasi (skala 1-10)\n"
                    "2. Temuan Utama (Daftar Masalah), di mana untuk setiap masalah wajib dicantumkan:\n"
                    "   - Lokasi/Bagian: (misalnya: Bab I Latar Belakang)\n"
                    "   - Jenis Masalah: (Struktur / Bahasa / Logika)\n"
                    "   - Tingkat Keparahan: (Kritis / Penting / Opsional)\n"
                    "   - Deskripsi: Penjelasan mengapa salah.\n"
                    "   - Sebelum: Kutipan teks bermasalah.\n"
                    "   - Sesudah: Contoh kalimat perbaikan. PENTING: Istilah asing yang harus dicetak miring WAJIB dibungkus dengan format italic Markdown (seperti *italic*).\n"
                    "3. Checklist Tindakan Perbaikan (format '- [ ] ...') yang terstruktur per-bagian beserta tingkat prioritas.\n"
                    "4. Struktur Mindmap Konsep menggunakan nested bullet points.\n"
                    "5. Kode Diagram Alur Logika menggunakan sintaks Mermaid.js (```mermaid ... ```).\n"
                    "6. Catatan Editor berupa kesimpulan naratif."
                )
                
            combined_prompt = (
                f"# PANDUAN AUDIT DOKUMEN (SOP / SYSTEM INSTRUCTION)\n"
                f"{system_instruction}\n\n"
                f"---\n\n"
                f"# DOKUMEN YANG AKAN DIAUDIT\n"
                f"{document_text}\n\n"
                f"---\n\n"
                f"# TUGAS AUDITOR (TIER: {tier.upper()})\n"
            )
            if focus_prompt:
                combined_prompt += f"Fokus Tambahan Audit: {focus_prompt}\n\n"
            combined_prompt += task_instruction
            
            with open(prompt_file_path, "w", encoding="utf-8") as f:
                f.write(combined_prompt)
                
            print(f"      Berhasil! Berkas prompt siap pakai ditulis ke: {prompt_file_path}")
            return {"status": "success", "results": {"prompt_file": prompt_file_path}, "metadata": metadata, "prompt_only": True}

        print(f"[3/4] Menjalankan {total_passes}-pass audit via {self.agent.model}...")
        audit_result = self._run_multi_pass(
            system_instruction, document_text, tier, focus_prompt
        )

        print(f"[4/4] Membuat berkas output di direktori: {output_dir}...")
        os.makedirs(output_dir, exist_ok=True)
        
        base_name = os.path.splitext(os.path.basename(file_path))[0]
        
        # JIKA MODE DRAFT-FIRST AKTIF (Hybrid Workflow)
        if draft_only:
            draft_output_path = os.path.join(output_dir, f"{base_name}_laporan_audit_draft.md")
            meta_json = json.dumps(metadata, ensure_ascii=False)
            content_with_meta = f"<!-- METADATA\n{meta_json}\n-->\n\n{audit_result}"
            with open(draft_output_path, "w", encoding="utf-8") as f:
                f.write(content_with_meta)
            print(f"Draft audit berhasil disimpan di: {draft_output_path}")
            return {
                "status": "success",
                "results": {"draft": draft_output_path},
                "metadata": metadata,
                "draft_only": True
            }
            
        pdf_output_path = os.path.join(output_dir, f"{base_name}_laporan_audit.pdf")
        
        results = {}
        
        if tier == "basic":
            # Basic: Hanya PDF ringkas
            actual_pdf_path = generate_pdf_report(audit_result, pdf_output_path, metadata)
            results["pdf"] = actual_pdf_path
        else:
            # Plus: PDF + Markdown files (Checklist, MiniMap)
            actual_pdf_path = generate_pdf_report(audit_result, pdf_output_path, metadata)
            markdown_paths = generate_markdown_files(audit_result, output_dir)
            results["pdf"] = actual_pdf_path
            results.update(markdown_paths)
            
        print("Proses audit selesai dengan sukses!")
        return {"status": "success", "results": results, "metadata": metadata}

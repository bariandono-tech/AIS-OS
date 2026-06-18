import os
from PIL import Image, ImageDraw, ImageFont

# Canvas Setup Helpers
BG = (255, 255, 255, 255)
TEXT_COLOR = (15, 23, 42, 255)         # Dark slate
ARROW_COLOR = (71, 85, 105, 255)       # Slate gray

# Fonts
font_path = "C:\\Windows\\Fonts\\times.ttf"
font_bold_path = "C:\\Windows\\Fonts\\timesbd.ttf"
if os.path.exists(font_path) and os.path.exists(font_bold_path):
    f_title = ImageFont.truetype(font_bold_path, 18)
    f_body = ImageFont.truetype(font_path, 11)
    f_bold = ImageFont.truetype(font_bold_path, 11)
    f_arrow = ImageFont.truetype(font_bold_path, 10)
else:
    f_title = f_body = f_bold = f_arrow = ImageFont.load_default()

# Actor Color Mapping (fill, stroke)
COLORS = {
    "Kepala": ((243, 232, 255, 255), (147, 51, 234, 255)),            # Purple
    "Kasi Reg": ((219, 234, 254, 255), (37, 99, 235, 255)),           # Blue
    "Kasi Kamtib": ((220, 252, 231, 255), (22, 163, 74, 255)),        # Green
    "Kasi Perkes": ((254, 243, 199, 255), (217, 119, 6, 255)),        # Orange/Amber
    "Subbag TU": ((243, 244, 246, 255), (107, 114, 128, 255)),        # Gray
    "Kasubseksi Registrasi": ((220, 252, 231, 255), (22, 163, 74, 255)), # Green
    "Kasubseksi Admin": ((254, 243, 199, 255), (217, 119, 6, 255)),   # Amber
    "Kasubseksi Ketertiban": ((220, 252, 231, 255), (22, 163, 74, 255)), # Green
    "Fungsional": ((243, 244, 246, 255), (107, 114, 128, 255)),       # Gray
    "Penjaga": ((243, 232, 255, 255), (147, 51, 234, 255)),          # Purple
    "Danru": ((254, 243, 199, 255), (217, 119, 6, 255)),              # Amber
    "Kanwil": ((219, 234, 254, 255), (37, 99, 235, 255)),             # Blue
    "Ditjenim": ((243, 244, 246, 255), (107, 114, 128, 255)),         # Gray
    "MulaiSelesai": ((254, 226, 226, 255), (220, 38, 38, 255)),       # Red/Coral
}

def draw_arrow(draw, start, end, text=""):
    draw.line([start, end], fill=ARROW_COLOR, width=2)
    # Arrowhead
    import math
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    angle = math.atan2(dy, dx)
    arrow_len = 8
    x1 = end[0] - arrow_len * math.cos(angle - math.pi/6)
    y1 = end[1] - arrow_len * math.sin(angle - math.pi/6)
    x2 = end[0] - arrow_len * math.cos(angle + math.pi/6)
    y2 = end[1] - arrow_len * math.sin(angle + math.pi/6)
    draw.polygon([end, (x1, y1), (x2, y2)], fill=ARROW_COLOR)
    
    if text:
        tx = (start[0] + end[0]) / 2 + 5
        ty = (start[1] + end[1]) / 2 - 12
        draw.text((tx, ty), text, fill=TEXT_COLOR, font=f_arrow)

def wrap_text(text, max_w, font):
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        current_line.append(word)
        # Check size
        w = font.getbbox(" ".join(current_line))[2]
        if w > max_w:
            current_line.pop()
            lines.append(" ".join(current_line))
            current_line = [word]
    lines.append(" ".join(current_line))
    return "\n".join(lines)

def generate_sop_flowchart(title_text, steps, output_name, height=850):
    width = 650
    image = Image.new("RGBA", (width, height), "white")
    draw = ImageDraw.Draw(image)
    
    # Title
    draw.rounded_rectangle([(30, 20), (width-30, 65)], radius=5, fill=(51, 65, 85, 255), outline=(15, 23, 42, 255), width=2)
    draw.text((width//2, 42), title_text.upper(), fill="white", font=f_title, anchor="mm")
    
    # Start node
    draw.ellipse([(width//2 - 50, 95), (width//2 + 50, 130)], fill=COLORS["MulaiSelesai"][0], outline=COLORS["MulaiSelesai"][1], width=2)
    draw.text((width//2, 112), "MULAI", fill=COLORS["MulaiSelesai"][1], font=f_bold, anchor="mm")
    
    current_y = 130
    prev_center = (width//2, 130)
    
    # Draw steps
    for i, step in enumerate(steps):
        step_num, step_name, actor = step
        # Draw arrow from previous node
        next_center = (width//2, current_y + 45)
        draw_arrow(draw, prev_center, (next_center[0], next_center[1] - 20))
        
        # Draw step box
        box_y0 = current_y + 45
        box_y1 = box_y0 + 60
        box_x0 = width//2 - 200
        box_x1 = width//2 + 200
        
        fill, stroke = COLORS.get(actor, COLORS["Fungsional"])
        draw.rounded_rectangle([(box_x0, box_y0), (box_x1, box_y1)], radius=6, fill=fill, outline=stroke, width=2)
        
        # Text
        wrapped = wrap_text(f"{step_num}. {step_name}", 370, f_body)
        draw.text((width//2, (box_y0 + box_y1)//2 - 8), wrapped, fill=TEXT_COLOR, font=f_body, anchor="mm", align="center")
        
        # Actor Label on right side of the box
        draw.text((box_x1 + 10, (box_y0 + box_y1)//2), f"({actor})", fill=stroke, font=f_bold, anchor="lm")
        
        current_y = box_y1
        prev_center = (width//2, box_y1)
        
    # Draw arrow to Selesai node
    next_center = (width//2, current_y + 45)
    draw_arrow(draw, prev_center, (next_center[0], next_center[1] - 20))
    
    # Selesai node
    draw.ellipse([(width//2 - 50, current_y + 45), (width//2 + 50, current_y + 80)], fill=COLORS["MulaiSelesai"][0], outline=COLORS["MulaiSelesai"][1], width=2)
    draw.text((width//2, current_y + 62), "SELESAI", fill=COLORS["MulaiSelesai"][1], font=f_bold, anchor="mm")
    
    # Save
    out_path = os.path.join(os.path.dirname(__file__), output_name)
    image = image.convert("RGB")
    image.save(out_path, "PNG")
    print(f"Generated: {out_path}")

# SOP 1: Penerimaan
generate_sop_flowchart(
    "SOP Penerimaan Calon Deteni",
    [
        ("1", "Memberikan persetujuan/disposisi penerimaan calon Deteni", "Kepala"),
        ("2", "Mempersiapkan & mengoordinasikan penerimaan berkas kasus", "Kasi Reg"),
        ("3", "Melakukan penggeledahan badan & barang bawaan deteni", "Kasi Kamtib"),
        ("4", "Melakukan pemeriksaan kesehatan fisik awal deteni", "Kasi Perkes"),
        ("5", "Menyusun konsep Surat Keputusan & Berita Acara Serah Terima", "Kasi Reg"),
        ("6", "Menerbitkan Surat Keputusan & Surat Perintah Pendetensian", "Kepala")
    ],
    "sop_penerimaan_flowchart.png",
    height=720
)

# SOP 2: Kesehatan
generate_sop_flowchart(
    "SOP Pemeriksaan Kesehatan Deteni",
    [
        ("1", "Melaporkan adanya deteni mengeluh sakit kepada Seksi Perkes", "Kasi Kamtib"),
        ("2", "Melakukan pemeriksaan fisik awal & skrining tingkat kedaruratan", "Kasi Perkes"),
        ("3", "Mengajukan surat izin keluar sementara deteni untuk dirujuk ke RS", "Kasi Reg"),
        ("4", "Menandatangani berkas Surat Izin Keluar Sementara Deteni", "Kepala"),
        ("5", "Mempersiapkan akomodasi & kendaraan operasional / Ambulans", "Subbag TU"),
        ("6", "Menugaskan personel & menyiapkan berkas Surat Perintah Pengawalan", "Kasi Kamtib"),
        ("7", "Melakukan perawatan medis deteni di Rumah Sakit / Puskesmas mitra", "Kasi Perkes"),
        ("8", "Menyusun jadwal piket jaga pengawalan deteni 24 jam di RS", "Kasi Kamtib"),
        ("9", "Memproses pemulangan deteni yang dinyatakan sembuh oleh dokter RS", "Kasi Perkes"),
        ("10", "Mengembalikan deteni ke dalam blok kamar hunian Rudenim", "Kasi Kamtib"),
        ("11", "Melaporkan kembalinya deteni dari RS kepada pimpinan", "Kasi Reg")
    ],
    "sop_kesehatan_flowchart.png",
    height=1200
)

# SOP 3: Registrasi
generate_sop_flowchart(
    "SOP Registrasi Deteni (SIMKIM)",
    [
        ("1", "Menerbitkan surat perintah pendetensian resmi", "Kepala"),
        ("2", "Memerintahkan registrasi deteni & pendataan barang bawaan", "Kasi Reg"),
        ("3", "Menginput data biometrik, biodata & menyusun konsep berita acara", "Kasubseksi Registrasi"),
        ("4", "Menyusun laporan proses perekaman data & inventarisasi barang", "Kasubseksi Admin"),
        ("5", "Menyerahkan BAST deteni, menyimpan barang, & menyerahkan ke Kamtib", "Kasubseksi Registrasi")
    ],
    "sop_registrasi_flowchart.png",
    height=640
)

# SOP 4: Penempatan
generate_sop_flowchart(
    "SOP Penempatan Deteni Ke Blok Hunian",
    [
        ("1", "Menerima berkas BAST registrasi & memberikan disposisi penempatan", "Kasi Kamtib"),
        ("2", "Memeriksa kelayakan sel kamar & menugaskan pengawalan penempatan", "Kasubseksi Ketertiban"),
        ("3", "Mensosialisasikan tata tertib, hak, serta kewajiban deteni", "Kasi Kamtib"),
        ("4", "Mengawal deteni ke sel, mengunci kamar & menyusun draf BA", "Fungsional"),
        ("5", "Memverifikasi draf Berita Acara Penempatan kamar deteni", "Kasubseksi Ketertiban"),
        ("6", "Menandatangani Berita Acara Penempatan Deteni secara resmi", "Kasi Kamtib"),
        ("7", "Menyusun laporan berkala penempatan deteni di blok hunian", "Kasi Kamtib"),
        ("8", "Menandatangani & menyampaikan laporan evaluasi ke pimpinan", "Kasubseksi Ketertiban")
    ],
    "sop_penempatan_flowchart.png",
    height=900
)

# SOP 5: Penjagaan
generate_sop_flowchart(
    "SOP Penjagaan & Pengamanan Rudenim",
    [
        ("1", "Memerintahkan pelaksanaan tugas pengamanan & penjagaan harian", "Kasi Kamtib"),
        ("2", "Memimpin apel serah terima pergantian regu jaga (piket)", "Kasubseksi Keamanan"),
        ("3", "Memeriksa inventaris taktis keamanan & membagi pos tugas", "Danru"),
        ("4", "Melakukan patroli & menghitung fisik deteni di kamar hunian", "Penjaga"),
        ("5", "Menugaskan personel jaga aktif di pos-pos pengamanan UPT", "Danru")
    ],
    "sop_penjagaan_flowchart.png",
    height=640
)

# SOP 6: Pemindahan
generate_sop_flowchart(
    "SOP Pemindahan Deteni Antar Rudenim",
    [
        ("1", "Melakukan rapat identifikasi urgensi pemindahan deteni (overcapacity)", "Kasi Reg"),
        ("2", "Menyusun konsep surat permohonan pemindahan ditujukan ke Kanwil", "Kasi Reg"),
        ("3", "Menandatangani & mengajukan permohonan resmi kepada Kakanwil", "Kepala"),
        ("4", "Menelaah & meneruskan surat permohonan ke Ditjenim Wasdakim", "Kanwil"),
        ("5", "Memberikan keputusan persetujuan tertulis pemindahan deteni", "Ditjenim"),
        ("6", "Meneruskan surat Keputusan Persetujuan Ditjenim ke Rudenim", "Kanwil"),
        ("7", "Menindaklanjuti & mendisposisi pelaksanaan mutasi deteni", "Kepala"),
        ("8", "Menyiapkan berkas pengeluaran, pengawalan, & koordinasi UPT tujuan", "Kasi Reg"),
        ("9", "Mengeluarkan deteni dari sel hunian & serah terima berkas ke pengawal", "Kasi Reg"),
        ("10", "Melaksanakan pengawalan fisik deteni lintas daerah (udara/darat)", "Kasi Kamtib"),
        ("11", "Serah terima deteni & berkas portofolio di Rudenim penerima", "Kasi Kamtib"),
        ("12", "Melaporkan pelaksanaan kegiatan pemindahan deteni kepada Kakanwil", "Kepala")
    ],
    "sop_pemindahan_flowchart.png",
    height=1300
)

# SOP 7: Deportasi
generate_sop_flowchart(
    "SOP Pendeportasian Deteni Ke Negara Asal",
    [
        ("1", "Mengusulkan data deteni siap deportasi (dokumen & tiket lengkap)", "Kasi Reg"),
        ("2", "Memimpin rapat koordinasi teknis pelaksanaan pemulangan paksa", "Kepala"),
        ("3", "Menyusun konsep keputusan deportasi, SP pengawalan, & usulan cekal", "Kasi Reg"),
        ("4", "Menyusun konsep Surat Perintah Pengeluaran Deteni (SPPD)", "Kasubseksi Admin"),
        ("5", "Menandatangani berkas keputusan deportasi & surat-surat perintah", "Kepala"),
        ("6", "Menginput data rencana pendeportasian deteni ke modul SIMKIM", "Kasubseksi Admin"),
        ("7", "Menerakan cap stempel deportasi resmi pada paspor/SPLP deteni", "Kasubseksi Admin"),
        ("8", "Mengajukan paspor tercap deportasi untuk ditandatangani Kepala", "Kasi Reg"),
        ("9", "Menandatangani stempel deportasi di paspor & perintah pengeluaran", "Kepala"),
        ("10", "Mengeluarkan deteni dari sel & serah terima barang bukti/fisik", "Kasi Kamtib"),
        ("11", "Mengawal deteni ke bandara internasional hingga masuk pesawat", "Fungsional"),
        ("12", "Menyusun & mengirimkan laporan pelaksanaan deportasi ke Kanwil", "Kasi Reg")
    ],
    "sop_deportasi_flowchart.png",
    height=1300
)

import os
import math
from PIL import Image, ImageDraw, ImageFont

def draw_flowchart():
    # Setup canvas (optimized to fit Word page width perfectly without clipping)
    width, height = 1050, 1150
    image = Image.new("RGBA", (width, height), "white")
    draw = ImageDraw.Draw(image)

    # Colors
    primary_color = (30, 41, 59, 255)     # Dark Slate (border)
    fill_color = (241, 245, 249, 255)       # Light Slate (fill)
    text_color = (15, 23, 42, 255)         # Dark Text
    arrow_color = (71, 85, 105, 255)       # Slate Gray (arrows)
    green_accent = (22, 163, 74, 255)      # Safe/Process green
    red_accent = (220, 38, 38, 255)        # Alert/Alternative red

    # Load fonts
    font_path = "C:\\Windows\\Fonts\\times.ttf"
    font_bold_path = "C:\\Windows\\Fonts\\timesbd.ttf"
    
    if os.path.exists(font_path) and os.path.exists(font_bold_path):
        f_title = ImageFont.truetype(font_bold_path, 22)
        f_header = ImageFont.truetype(font_bold_path, 15)
        f_body = ImageFont.truetype(font_path, 13)
        f_arrow = ImageFont.truetype(font_bold_path, 12)
    else:
        # Fallback to default
        f_title = f_header = f_body = f_arrow = ImageFont.load_default()

    # Draw Title Header (widened to prevent text cutoff)
    draw.rounded_rectangle(
        [(25, 20), (1025, 75)], 
        radius=8, 
        fill=(51, 65, 85, 255), 
        outline=primary_color, 
        width=2
    )
    title_text = "FLOWCHART INTEGRASI 7 SOP SIKLUS HIDUP DETENSI DI RUDENIM PONTIANAK"
    draw.text((525, 45), title_text, fill="white", font=f_title, anchor="mm")

    # Helper function to draw an arrow with smart label placement
    def draw_arrow(start, end, text=""):
        draw.line([start, end], fill=arrow_color, width=2)
        # Arrowhead
        dx = end[0] - start[0]
        dy = end[1] - start[1]
        angle = math.atan2(dy, dx)
        arrow_len = 10
        x1 = end[0] - arrow_len * math.cos(angle - math.pi/6)
        y1 = end[1] - arrow_len * math.sin(angle - math.pi/6)
        x2 = end[0] - arrow_len * math.cos(angle + math.pi/6)
        y2 = end[1] - arrow_len * math.sin(angle + math.pi/6)
        draw.polygon([end, (x1, y1), (x2, y2)], fill=arrow_color)
        
        if text:
            mid_x = (start[0] + end[0]) / 2
            mid_y = (start[1] + end[1]) / 2
            # Horizontal arrow: draw text slightly above, centered
            if abs(start[1] - end[1]) < 2:
                draw.text((mid_x, mid_y - 12), text, fill=text_color, font=f_arrow, anchor="mm")
            # Vertical arrow: draw text to the right, left-aligned middle
            else:
                draw.text((mid_x + 12, mid_y), text, fill=text_color, font=f_arrow, anchor="lm")

    # Dimensions
    CX = 525
    OW = 160
    OH = 50
    BW = 340
    BH = 75
    DW = 320
    DH = 120
    BBW = 220
    BBH = 70

    # 1. Start (Oval)
    draw.ellipse([(CX - OW//2, 110), (CX + OW//2, 160)], fill=(220, 252, 231, 255), outline=green_accent, width=2)
    draw.text((CX, 135), "MULAI", fill=green_accent, font=f_header, anchor="mm")

    # 2. SOP 1: Penerimaan Calon Deteni (Box)
    draw.rounded_rectangle([(CX - BW//2, 195), (CX + BW//2, 255)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((CX, 225), "1. SOP Penerimaan Calon Deteni\n(Serah terima berkas Kanim & cek fisik)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((CX, 160), (CX, 195))

    # 3. SOP 2: Pemeriksaan Kesehatan Deteni (Diamond)
    # Define diamond coordinates: Top, Right, Bottom, Left (centered at Y=345)
    dia_t = (CX, 345 - DH//2)
    dia_r = (CX + DW//2, 345)
    dia_b = (CX, 345 + DH//2)
    dia_l = (CX - DW//2, 345)
    draw.polygon([dia_t, dia_r, dia_b, dia_l], fill=fill_color, outline=primary_color, width=2)
    draw.text((CX, 345), "2. SOP Pemeriksaan\nKesehatan\n(Sehat / Sakit?)", fill=text_color, font=f_header, anchor="mm", align="center")
    draw_arrow((CX, 255), (CX, dia_t[1]))

    # Branch 3a: Deteni Sakit -> Rujukan RS (Box on Right)
    draw.rounded_rectangle([(870 - BBW//2, 310), (870 + BBW//2, 380)], radius=5, fill=(254, 226, 226, 255), outline=red_accent, width=2)
    draw.text((870, 345), "Penanganan Medis / Rujukan RS\n(Pengawalan Kamtib)", fill=red_accent, font=f_body, anchor="mm", align="center")
    draw_arrow((dia_r[0], 345), (870 - BBW//2, 345), "Sakit")
    # Arrow returning to flow before health check when healed
    draw.line([(870, 310), (870, 272)], fill=arrow_color, width=2)
    draw.line([(870, 272), (CX + 2, 272)], fill=arrow_color, width=2)
    draw_arrow((CX + 2, 272), (CX, 272))

    # 4. SOP 3: Registrasi Deteni - SIMKIM (Box)
    draw.rounded_rectangle([(CX - BW//2, 455), (CX + BW//2, 515)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((CX, 485), "3. SOP Registrasi Deteni\n(Foto, sidik jari, input SIMKIM)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((CX, dia_b[1]), (CX, 455), "Sehat")

    # 5. SOP 4: Penempatan Deteni (Box)
    draw.rounded_rectangle([(CX - BW//2, 550), (CX + BW//2, 610)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((CX, 580), "4. SOP Penempatan Deteni\n(Profiling & Pembagian Kamar Blok)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((CX, 515), (CX, 550))

    # 6. SOP 5: Penjagaan & Pengamanan Deteni (Box/Loop)
    draw.rounded_rectangle([(CX - BW//2, 645), (CX + BW//2, 705)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((CX, 675), "5. SOP Penjagaan & Pengamanan\n(Patroli, sidak, apel harian, kunjungan)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((CX, 610), (CX, 645))

    # Loop for security checks
    draw.line([(CX + BW//2, 675), (CX + BW//2 + 60, 675)], fill=arrow_color, width=2)
    draw.line([(CX + BW//2 + 60, 675), (CX + BW//2 + 60, 630)], fill=arrow_color, width=2)
    draw.line([(CX + BW//2 + 60, 630), (CX, 630)], fill=arrow_color, width=2)
    draw_arrow((CX, 630), (CX, 645), "Rutinitas")

    # 7. Outflow Decision (Diamond)
    # Centered at Y=800
    dia2_t = (CX, 800 - DH//2)
    dia2_r = (CX + DW//2, 800)
    dia2_b = (CX, 800 + DH//2)
    dia2_l = (CX - DW//2, 800)
    draw.polygon([dia2_t, dia2_r, dia2_b, dia2_l], fill=fill_color, outline=primary_color, width=2)
    draw.text((CX, 800), "Status Akhir?", fill=text_color, font=f_header, anchor="mm")
    draw_arrow((CX, 705), (CX, dia2_t[1]))

    # Branch 7a: SOP 6: Pemindahan Deteni (Left)
    draw.rounded_rectangle([(150 - BBW//2, 770), (150 + BBW//2, 830)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((150, 800), "6. SOP Pemindahan Deteni\n(Ke Rudenim / UPT Lain)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((dia2_l[0], 800), (150 + BBW//2, 800), "Pindah")

    # Branch 7b: SOP 7: Pendeportasian Deteni (Right)
    draw.rounded_rectangle([(900 - BBW//2, 770), (900 + BBW//2, 830)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((900, 800), "7. SOP Pendeportasian Deteni\n(Verifikasi dokumen & tiket)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((dia2_r[0], 800), (900 - BBW//2, 800), "Deportasi")

    # Connect branches to End
    draw.line([(150, 830), (150, 920)], fill=arrow_color, width=2)
    draw.line([(150, 920), (CX - OW//2, 920)], fill=arrow_color, width=2)

    draw.line([(900, 830), (900, 920)], fill=arrow_color, width=2)
    draw.line([(900, 920), (CX + OW//2, 920)], fill=arrow_color, width=2)

    # 8. End (Oval)
    draw.ellipse([(CX - OW//2, 895), (CX + OW//2, 945)], fill=(254, 243, 199, 255), outline=(217, 119, 6, 255), width=2)
    draw.text((CX, 920), "SELESAI", fill=(217, 119, 6, 255), font=f_header, anchor="mm")

    # Caption at bottom
    caption = "Gambar 2. Flowchart Siklus Hidup Deteni Terintegrasi dengan 7 SOP"
    draw.text((CX, 1010), caption, fill=text_color, font=f_header, anchor="mm")

    # Save image
    output_path = os.path.join(os.path.dirname(__file__), "flowchart_lifecycle_deteni.png")
    image.save(output_path, "PNG")
    print(f"[OK] Flowchart successfully saved to {output_path}")

if __name__ == "__main__":
    draw_flowchart()

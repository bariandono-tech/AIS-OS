import os
from PIL import Image, ImageDraw, ImageFont

def draw_struktur():
    # Setup canvas
    width, height = 1100, 520
    image = Image.new("RGBA", (width, height), "white")
    draw = ImageDraw.Draw(image)

    # Colors
    primary_color = (30, 41, 59, 255)     # Dark Slate (border)
    fill_color = (241, 245, 249, 255)       # Light Slate (fill)
    text_color = (15, 23, 42, 255)         # Dark Text
    line_color = (71, 85, 105, 255)       # Slate Gray (lines)
    staff_color = (100, 116, 139, 255)     # Slate (dotted/dash line representation)

    # Load fonts
    font_path = "C:\\Windows\\Fonts\\times.ttf"
    font_bold_path = "C:\\Windows\\Fonts\\timesbd.ttf"
    
    if os.path.exists(font_path) and os.path.exists(font_bold_path):
        f_title = ImageFont.truetype(font_bold_path, 20)
        f_header = ImageFont.truetype(font_bold_path, 14)
        f_body = ImageFont.truetype(font_path, 12)
    else:
        # Fallback to default
        f_title = f_header = f_body = ImageFont.load_default()

    # Draw Title Header
    draw.rounded_rectangle(
        [(130, 20), (970, 70)], 
        radius=8, 
        fill=(51, 65, 85, 255), 
        outline=primary_color, 
        width=2
    )
    title_text = "STRUKTUR ORGANISASI RUMAH DETENSI IMIGRASI PONTIANAK"
    draw.text((550, 45), title_text, fill="white", font=f_title, anchor="mm")

    # Define Box Dimensions
    box_w, box_h = 280, 60

    # Coordinates
    # 1. Kepala
    kepala_box = (410, 110, 410 + box_w, 110 + box_h)
    
    # 2. Subbag Tata Usaha (Staff role)
    tu_box = (120, 210, 120 + box_w, 210 + box_h)
    
    # 3. Seksi Registrasi, Administrasi dan Pelaporan
    reg_box = (60, 330, 60 + box_w, 330 + box_h)
    
    # 4. Seksi Perawatan dan Kesehatan
    rawat_box = (410, 330, 410 + box_w, 330 + box_h)
    
    # 5. Seksi Keamanan dan Ketertiban
    kamtib_box = (760, 330, 760 + box_w, 330 + box_h)

    # Draw Boxes
    boxes = [
        (kepala_box, "KEPALA RUMAH DETENSI\nIMIGRASI", True),
        (tu_box, "SUB BAGIAN TATA USAHA", False),
        (reg_box, "SEKSI REGISTRASI, ADMINISTRASI\nDAN PELAPORAN", False),
        (rawat_box, "SEKSI PERAWATAN DAN KESEHATAN", False),
        (kamtib_box, "SEKSI KEAMANAN DAN KETERTIBAN", False)
    ]

    for box, text, is_head in boxes:
        fill = (51, 65, 85, 20) if is_head else fill_color
        draw.rounded_rectangle(box, radius=6, fill=fill, outline=primary_color, width=2)
        use_font = f_header if is_head else f_body
        draw.text(
            (box[0] + box_w/2, box[1] + box_h/2), 
            text, 
            fill=text_color, 
            font=use_font, 
            anchor="mm", 
            align="center"
        )

    # Draw Connective Lines
    # Line from Kepala down to division line
    draw.line([(550, 170), (550, 300)], fill=line_color, width=3)
    
    # Staff line to Subbag TU (Horizontal)
    draw.line([(550, 240), (400, 240)], fill=staff_color, width=3)
    
    # Main horizontal distribution line above Seksi
    draw.line([(200, 300), (900, 300)], fill=line_color, width=3)
    
    # Vertical line down to Seksi Registrasi
    draw.line([(200, 300), (200, 330)], fill=line_color, width=3)
    
    # Vertical line down to Seksi Perawatan
    draw.line([(550, 300), (550, 330)], fill=line_color, width=3)
    
    # Vertical line down to Seksi Kamtib
    draw.line([(900, 300), (900, 330)], fill=line_color, width=3)

    # Caption at bottom
    caption = "Gambar 3.1 Struktur Organisasi Rumah Detensi Imigrasi Pontianak"
    draw.text((550, 480), caption, fill=text_color, font=f_header, anchor="mm")

    # Save image
    output_path = os.path.join(os.path.dirname(__file__), "struktur_organisasi_rudenim.png")
    image.save(output_path, "PNG")
    print(f"Structure flowchart successfully saved to {output_path}")

if __name__ == "__main__":
    draw_struktur()

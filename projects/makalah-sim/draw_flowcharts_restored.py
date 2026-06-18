import os
from PIL import Image, ImageDraw, ImageFont

def draw_flowchart():
    # Setup canvas
    width, height = 1000, 850
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
        f_title = ImageFont.truetype(font_bold_path, 20)
        f_header = ImageFont.truetype(font_bold_path, 14)
        f_body = ImageFont.truetype(font_path, 12)
        f_arrow = ImageFont.truetype(font_bold_path, 12)
    else:
        # Fallback to default
        f_title = f_header = f_body = f_arrow = ImageFont.load_default()

    # Draw Title Header
    draw.rounded_rectangle(
        [(150, 20), (850, 70)], 
        radius=8, 
        fill=(51, 65, 85, 255), 
        outline=primary_color, 
        width=2
    )
    title_text = "FLOWCHART INTEGRASI 7 SOP SIKLUS HIDUP DETENI DI RUDENIM PONTIANAK"
    draw.text((500, 45), title

    # Branch 7a: SOP 6: Pemindahan Deteni (Left)
    draw.rounded_rectangle([(100, 635), (300, 685)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((200, 660), "6. SOP Pemindahan Deteni\n(Ke Rudenim Lain / UPT lain)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((340, 660), (300, 660), "Pindah")

    # Branch 7b: SOP 7: Pendeportasian Deteni (Right)
    draw.rounded_rectangle([(670, 635), (870, 685)], radius=5, fill=fill_color, outline=primary_color, width=2)
    draw.text((770, 660), "7. SOP Pendeportasian Deteni\n(Verifikasi berkas, tiket, deportasi)", fill=text_color, font=f_body, anchor="mm", align="center")
    draw_arrow((630, 660), (670, 660), "Deportasi")

    # Connect branches to End
    draw.line([(200, 685), (200, 740)], fill=arrow_color, width=2)
    draw.line([(200, 740), (450, 740)], fill=arrow_color, width=2)

    draw.line([(770, 685), (770, 740)], fill=arrow_color, width=2)
    draw.line([(770, 740), (550, 740)], fill=arrow_color, width=2)

    # 8. End (Oval)
    draw.ellipse([(450, 720), (550, 760)], fill=(254, 243, 199, 255), outline=(217, 119, 6, 255), width=2)
    draw.text((500, 740), "SELESAI", fill=(217, 119, 6, 255), font=f_header, anchor="mm")
    draw_arrow((450, 740), (450, 740)) # dummy anchor line representation

    # Caption at bottom
    caption = "Gambar 3. Flowchart Siklus Hidup Deteni Terintegrasi dengan 7 SOP"
    draw.text((500, 810), caption, fill=text_color, font=f_header, anchor="mm")

    # Save image
    output_path = os.path.join(os.path.dirname(__file__), "flowchart_lifecycle_deteni.png")
    image.save(output_path, "PNG")
    print(f"Flowchart successfully saved to {output_path}")

if __name__ == "__main__":
    draw_flowchart()

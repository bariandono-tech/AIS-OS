"""
Leavitt's Diamond Model Diagram for Makalah SIM
Generates a professional academic diagram showing the 4 interrelated components:
Structure, Technology, Task, People — applied to Rudenim Pontianak context.
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 900, 760
BG = (255, 255, 255)
DIAMOND_COLOR = (30, 41, 59)        # Dark Slate
FILL_TASK = (239, 246, 255)         # Very light blue
FILL_STRUCT = (254, 242, 242)       # Very light red
FILL_TECH = (240, 253, 250)         # Very light teal/green
FILL_PEOPLE = (255, 251, 235)       # Very light yellow/gold
ARROW_COLOR = (100, 116, 139)       # Slate Gray
TEXT_COLOR = (15, 23, 42)           # Dark Slate text
SUBTITLE_COLOR = (71, 85, 105)

img = Image.new('RGBA', (W, H), BG)
draw = ImageDraw.Draw(img)

# --- FONTS ---
# Using standard Windows fonts paths to guarantee high-quality rendering
font_dir = "C:\\Windows\\Fonts\\"
def get_font(name, size):
    path = os.path.join(font_dir, name)
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()

font_title = get_font("timesbd.ttf", 22)
font_subtitle = get_font("times.ttf", 15)
font_box_title = get_font("timesbd.ttf", 16)
font_box_detail = get_font("times.ttf", 13)
font_arrow = get_font("timesbd.ttf", 12)
font_source = get_font("timesi.ttf", 11)

# --- TITLE ---
draw.text((W//2, 20), "Gambar 3. Kerangka Analisis Leavitt's Diamond Model", fill=TEXT_COLOR, font=font_title, anchor="mt")
draw.text((W//2, 50), "pada Rumah Detensi Imigrasi Pontianak", fill=SUBTITLE_COLOR, font=font_subtitle, anchor="mt")

# --- DIAMOND COORDINATES (center-based) ---
cx, cy = 450, 405
dx, dy = 145, 95  # diamond half-width, half-height

top    = (cx, cy - dy)        # TASK (top)
right  = (cx + dx, cy)        # TECHNOLOGY (right)
bottom = (cx, cy + dy)        # PEOPLE (bottom)
left   = (cx - dx, cy)        # STRUCTURE (left)

# --- DRAW DIAMOND LINES (all interconnected) ---
points = [top, right, bottom, left]
for i in range(4):
    for j in range(i+1, 4):
        draw.line([points[i], points[j]], fill=ARROW_COLOR, width=2)

# --- BOX DIMENSIONS ---
bw, bh = 260, 175  # box width, height

def draw_box(center, title, details, bg_color, border_color):
    x, y = center
    x0, y0 = x - bw//2, y - bh//2
    x1, y1 = x + bw//2, y + bh//2
    
    # Subtle drop shadow
    draw.rounded_rectangle([x0+2, y0+2, x1+2, y1+2], radius=8, fill=(226, 232, 240, 150))
    # Box fill
    draw.rounded_rectangle([x0, y0, x1, y1], radius=8, fill=bg_color, outline=border_color, width=2)
    # Title bar
    draw.rounded_rectangle([x0, y0, x1, y0+30], radius=8, fill=border_color)
    draw.rectangle([x0, y0+20, x1, y0+30], fill=border_color)  # flatten bottom corners of title
    draw.text((x, y0 + 15), title, fill=(255, 255, 255), font=font_box_title, anchor="mm")
    
    # Detail lines
    line_y = y0 + 42
    for line in details:
        draw.text((x0 + 12, line_y), f"- {line}", fill=TEXT_COLOR, font=font_box_detail)
        line_y += 20

# --- DRAW BOXES ---
# 1. TASK (top)
draw_box(
    (cx, cy - dy - bh//2 - 20),
    "TASK (Tugas / SOP)",
    [
        "SOP Penerimaan Deteni",
        "SOP Registrasi Biometrik",
        "SOP Penempatan Blok",
        "SOP Pengamanan Harian",
        "SOP Pemeriksaan Kesehatan",
        "SOP Pemindahan & Deportasi",
    ],
    FILL_TASK,
    (29, 78, 216) # Blue-700
)

# 2. TECHNOLOGY (right)
draw_box(
    (cx + dx + bw//2 + 20, cy),
    "TECHNOLOGY (Teknologi)",
    [
        "Aplikasi SIMKIM Terpusat",
        "Database Nasional Ditjenim",
        "Fingerprint Scanner & Kamera",
        "Jaringan Internet VPN Aman",
        "Server Lokal & Pusdatin",
        "Modul Deteni & Cekal SIMKIM",
    ],
    FILL_TECH,
    (15, 118, 110) # Teal-700
)

# 3. PEOPLE (bottom)
draw_box(
    (cx, cy + dy + bh//2 + 20),
    "PEOPLE (Sumber Daya Manusia)",
    [
        "Kepala Rudenim Pontianak",
        "Operator Registrasi SIMKIM",
        "Petugas Pengamanan (Kamtib)",
        "Petugas Medis (Perkes)",
        "Staf Administrasi Tata Usaha",
        "Deteni (sebagai subjek layanan)",
    ],
    FILL_PEOPLE,
    (180, 83, 9) # Amber-700
)

# 4. STRUCTURE (left)
draw_box(
    (cx - dx - bw//2 - 20, cy),
    "STRUCTURE (Struktur)",
    [
        "Kepala Rudenim (Pimpinan)",
        "Subbag Tata Usaha (Staf)",
        "Seksi Registrasi & Admin",
        "Seksi Keamanan & Ketertiban",
        "Seksi Perawatan & Kesehatan",
        "Hierarki Organisasi UPT",
    ],
    FILL_STRUCT,
    (185, 28, 28) # Red-700
)

# --- ARROW LABELS (along the diamond edges/crosses) ---
# We position text on white background circles to avoid lines crossing through them
def draw_label(pos, text):
    tx, ty = pos
    # Estimate text width
    tw = font_arrow.getbbox(text)[2]
    # Draw background capsule
    draw.rounded_rectangle([tx - tw//2 - 4, ty - 8, tx + tw//2 + 4, ty + 8], radius=4, fill=(255,255,255,230))
    draw.text((tx, ty), text, fill=ARROW_COLOR, font=font_arrow, anchor="mm")

draw_label((cx + dx//2 + 20, cy - dy//2 - 12), "SOP ↔ SIMKIM")
draw_label((cx - dx//2 - 20, cy - dy//2 - 12), "SOP ↔ Struktur")
draw_label((cx + dx//2 + 20, cy + dy//2 + 12), "SIMKIM ↔ SDM")
draw_label((cx - dx//2 - 20, cy + dy//2 + 12), "Struktur ↔ SDM")
draw_label((cx, cy - 8), "Tugas ↔ SDM")

# --- SOURCE ---
draw.text((W//2, H - 25), "Sumber: Diadaptasi dari Leavitt (1965), diolah peneliti (2026)",
          fill=SUBTITLE_COLOR, font=font_source, anchor="mm")

# --- SAVE ---
out_path = os.path.join(os.path.dirname(__file__), 'leavitt_diamond_rudenim.png')
img = img.convert('RGB')
img.save(out_path, 'PNG', quality=95)
print(f"[OK] Diagram saved to {out_path}")


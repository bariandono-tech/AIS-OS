#!/usr/bin/env python3
"""
Generate proper SOP flowcharts with decision diamonds, branching, document shapes, and loops.
Replaces the previous linear process diagrams with ISO-standard flowchart elements.
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

# ============================================================
# CONFIGURATION
# ============================================================

CANVAS_W = 920
CX = 300             # Main flow center X
BRANCH_CX = 660      # Branch flow center X

# Shape dimensions
PW, PH = 320, 72       # Process box (balanced)
DW, DH = 270, 100       # Diamond (balanced)
OW, OH = 140, 50        # Oval (start/end) (balanced)
DOC_W, DOC_H = 320, 72 # Document (balanced)
BPW, BPH = 240, 64      # Branch process box (balanced)

VGAP = 45              # Vertical gap between shapes (balanced)
TITLE_H = 48
TITLE_TOP = 18
PAD_BOTTOM = 55

# Colors
TEXT_COLOR = (30, 41, 59)
ARROW_COLOR = (71, 85, 105)
TITLE_BG = (30, 41, 59)
TITLE_FG = (255, 255, 255)

DIAMOND_FILL = (255, 251, 235)
DIAMOND_STROKE = (180, 120, 4)

DOC_FILL = (239, 246, 255)
DOC_STROKE = (37, 99, 235)

OVAL_FILL = (254, 226, 226)
OVAL_STROKE = (220, 38, 38)

YES_COLOR = (22, 128, 61)
NO_COLOR = (185, 28, 28)

ACTOR_COLORS = {
    "Kepala":       ((243, 232, 255), (126, 34, 206)),
    "Kasi Reg":     ((219, 234, 254), (37, 99, 235)),
    "Kasi Kamtib":  ((220, 252, 231), (22, 163, 74)),
    "Kasi Perkes":  ((254, 243, 199), (202, 138, 4)),
    "Subbag TU":    ((243, 244, 246), (100, 116, 139)),
    "Kasub Reg":    ((219, 234, 254), (37, 99, 235)),
    "Kasub Adm":    ((254, 243, 199), (202, 138, 4)),
    "Kasub Tertib": ((220, 252, 231), (22, 163, 74)),
    "Fungsional":   ((243, 244, 246), (100, 116, 139)),
    "Penjaga":      ((243, 232, 255), (126, 34, 206)),
    "Danru":        ((254, 243, 199), (202, 138, 4)),
    "Kanwil":       ((219, 234, 254), (37, 99, 235)),
    "Ditjenim":     ((243, 244, 246), (100, 116, 139)),
}

# Fonts
_fp = "C:\\Windows\\Fonts\\times.ttf"
_fbp = "C:\\Windows\\Fonts\\timesbd.ttf"
if os.path.exists(_fp) and os.path.exists(_fbp):
    f_title = ImageFont.truetype(_fbp, 20)
    f_body  = ImageFont.truetype(_fp, 15)
    f_bold  = ImageFont.truetype(_fbp, 15)
    f_actor = ImageFont.truetype(_fbp, 13)
    f_label = ImageFont.truetype(_fbp, 13)
else:
    f_title = f_body = f_bold = f_actor = f_label = ImageFont.load_default()


# ============================================================
# DRAWING HELPERS
# ============================================================

def wrap_text(text, max_w, font):
    words = text.split()
    lines, current = [], []
    for word in words:
        current.append(word)
        w = font.getbbox(" ".join(current))[2]
        if w > max_w:
            current.pop()
            if current:
                lines.append(" ".join(current))
            current = [word]
    if current:
        lines.append(" ".join(current))
    return "\n".join(lines)


def draw_arrowhead(draw, tx, ty, fx, fy, size=7):
    angle = math.atan2(ty - fy, tx - fx)
    x1 = tx - size * math.cos(angle - math.pi / 6)
    y1 = ty - size * math.sin(angle - math.pi / 6)
    x2 = tx - size * math.cos(angle + math.pi / 6)
    y2 = ty - size * math.sin(angle + math.pi / 6)
    draw.polygon([(tx, ty), (x1, y1), (x2, y2)], fill=ARROW_COLOR)


def varrow(draw, x1, y1, x2, y2):
    """Vertical/straight arrow with arrowhead."""
    draw.line([(x1, y1), (x2, y2)], fill=ARROW_COLOR, width=2)
    draw_arrowhead(draw, x2, y2, x1, y1)


def harrow(draw, x1, y, x2, label=""):
    """Horizontal arrow with optional label above."""
    draw.line([(x1, y), (x2, y)], fill=ARROW_COLOR, width=2)
    draw_arrowhead(draw, x2, y, x1, y)
    if label:
        mid_x = (x1 + x2) / 2
        draw.text((mid_x, y - 15), label, fill=NO_COLOR, font=f_label, anchor="mm")


def draw_oval(draw, cx, cy, text):
    draw.ellipse([(cx - OW // 2, cy - OH // 2), (cx + OW // 2, cy + OH // 2)],
                 fill=OVAL_FILL, outline=OVAL_STROKE, width=2)
    draw.text((cx, cy), text, fill=OVAL_STROKE, font=f_bold, anchor="mm")


def draw_process(draw, cx, cy, text, actor, w=None, h=None):
    w = w or PW; h = h or PH
    fill, stroke = ACTOR_COLORS.get(actor, ((243, 244, 246), (100, 116, 139)))
    x0, y0, x1, y1 = cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2
    draw.rounded_rectangle([(x0, y0), (x1, y1)], radius=6, fill=fill, outline=stroke, width=2)
    
    # Actor inside the box to prevent overlapping on the right
    if actor:
        full_text = f"{text}\n({actor})"
    else:
        full_text = text
        
    wrapped = wrap_text(full_text, w - 30, f_body)
    draw.text((cx, cy), wrapped, fill=TEXT_COLOR, font=f_body, anchor="mm", align="center")


def draw_diamond(draw, cx, cy, text):
    pts = [(cx, cy - DH // 2), (cx + DW // 2, cy), (cx, cy + DH // 2), (cx - DW // 2, cy)]
    draw.polygon(pts, fill=DIAMOND_FILL, outline=DIAMOND_STROKE, width=2)
    wrapped = wrap_text(text, int(DW * 0.6), f_body)
    draw.text((cx, cy), wrapped, fill=TEXT_COLOR, font=f_body, anchor="mm", align="center")


def draw_document(draw, cx, cy, text, actor):
    w, h = DOC_W, DOC_H
    x0, y0, x1, y1 = cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2
    # Fill
    draw.rectangle([(x0 + 2, y0 + 2), (x1 - 2, y1)], fill=DOC_FILL)
    # Borders: top, left, right
    draw.line([(x0, y0), (x1, y0)], fill=DOC_STROKE, width=2)
    draw.line([(x0, y0), (x0, y1 + 5)], fill=DOC_STROKE, width=2)
    draw.line([(x1, y0), (x1, y1 + 5)], fill=DOC_STROKE, width=2)
    # Wavy bottom
    n = 40
    for i in range(n):
        xa = x0 + i * w / n
        xb = x0 + (i + 1) * w / n
        ya = y1 + 5 * math.sin(i * 2 * math.pi / (n / 2))
        yb = y1 + 5 * math.sin((i + 1) * 2 * math.pi / (n / 2))
        draw.line([(xa, ya), (xb, yb)], fill=DOC_STROKE, width=2)
    # Text
    if actor:
        full_text = f"{text}\n({actor})"
    else:
        full_text = text
    wrapped = wrap_text(full_text, w - 34, f_body)
    draw.text((cx, cy - 2), wrapped, fill=TEXT_COLOR, font=f_body, anchor="mm", align="center")


# ============================================================
# NODE CONSTRUCTORS
# ============================================================

def S():
    return {"type": "start"}

def E():
    return {"type": "end"}

def P(text, actor):
    return {"type": "process", "text": text, "actor": actor}

def D(text, no_nodes, no_type="merge", loop_target=None):
    """Decision diamond.
    no_nodes: list of P() for 'Tidak' branch.
    no_type:  'merge' (rejoin main flow), 'end' (branch gets own SELESAI), 'loop' (back to loop_target index).
    """
    return {"type": "decision", "text": text, "no": no_nodes,
            "no_type": no_type, "loop_target": loop_target}

def DOC(text, actor):
    return {"type": "document", "text": text, "actor": actor}


# ============================================================
# RENDER ENGINE
# ============================================================

def _hh(t):
    """Half-height for a node type."""
    return {"start": OH // 2, "end": OH // 2, "process": PH // 2,
            "decision": DH // 2, "document": DOC_H // 2 + 5}.get(t, PH // 2)


def render_flowchart(title, nodes, filename):
    # Generous height estimation
    est_h = TITLE_TOP + TITLE_H + VGAP * 2
    for nd in nodes:
        t = nd["type"]
        est_h += _hh(t) * 2 + VGAP
        if t == "decision":
            bn = nd.get("no", [])
            est_h += max(0, len(bn)) * (BPH + VGAP) + VGAP
            if nd.get("no_type") == "end":
                est_h += OH + VGAP
    est_h += PAD_BOTTOM + 100

    img = Image.new("RGB", (CANVAS_W, est_h), "white")
    draw = ImageDraw.Draw(img)

    # Title bar
    draw.rounded_rectangle(
        [(25, TITLE_TOP), (CANVAS_W - 25, TITLE_TOP + TITLE_H)],
        radius=5, fill=TITLE_BG
    )
    draw.text((CANVAS_W // 2, TITLE_TOP + TITLE_H // 2), title,
              fill=TITLE_FG, font=f_title, anchor="mm")

    y = TITLE_TOP + TITLE_H + VGAP   # y = top edge of next element's area
    prev_anchor = None                 # (x, y) bottom center of previous shape
    pending_merge = None               # (bx, by) branch bottom awaiting merge
    node_cy_map = {}                   # index → center_y for loop targets
    final_y = y                        # track lowest point drawn

    for i, nd in enumerate(nodes):
        t = nd["type"]
        hh = _hh(t)
        cy = y + hh   # center of this element

        node_cy_map[i] = cy

        # --- START ---
        if t == "start":
            draw_oval(draw, CX, cy, "MULAI")
            prev_anchor = (CX, cy + OH // 2)
            y = cy + OH // 2 + VGAP
            final_y = max(final_y, y)

        # --- END ---
        elif t == "end":
            # Main arrow
            if prev_anchor:
                varrow(draw, prev_anchor[0], prev_anchor[1], CX, cy - OH // 2)
            # Merge connector if pending
            if pending_merge:
                bx, by = pending_merge
                jy = min(cy - OH // 2 - 8, max(by + 8, (prev_anchor[1] + cy - OH // 2) * 0.6 + prev_anchor[1] * 0.4 if prev_anchor else by + 8))
                if by < jy:
                    draw.line([(bx, by), (bx, jy)], fill=ARROW_COLOR, width=2)
                draw.line([(bx, jy), (CX + 2, jy)], fill=ARROW_COLOR, width=2)
                pending_merge = None
            draw_oval(draw, CX, cy, "SELESAI")
            prev_anchor = (CX, cy + OH // 2)
            y = cy + OH // 2 + VGAP
            final_y = max(final_y, y)

        # --- PROCESS ---
        elif t == "process":
            top_y = cy - PH // 2
            # Merge connector if pending
            if pending_merge:
                bx, by = pending_merge
                if prev_anchor:
                    varrow(draw, prev_anchor[0], prev_anchor[1], CX, top_y)
                jy = min(top_y - 8, max(by + 8, prev_anchor[1] + 12 if prev_anchor else by + 8))
                if by < jy:
                    draw.line([(bx, by), (bx, jy)], fill=ARROW_COLOR, width=2)
                draw.line([(bx, jy), (CX + 2, jy)], fill=ARROW_COLOR, width=2)
                pending_merge = None
            else:
                if prev_anchor:
                    varrow(draw, prev_anchor[0], prev_anchor[1], CX, top_y)

            draw_process(draw, CX, cy, nd["text"], nd["actor"])
            prev_anchor = (CX, cy + PH // 2)
            y = cy + PH // 2 + VGAP
            final_y = max(final_y, y)

        # --- DOCUMENT ---
        elif t == "document":
            top_y = cy - DOC_H // 2
            if pending_merge:
                bx, by = pending_merge
                if prev_anchor:
                    varrow(draw, prev_anchor[0], prev_anchor[1], CX, top_y)
                jy = min(top_y - 8, max(by + 8, prev_anchor[1] + 12 if prev_anchor else by + 8))
                if by < jy:
                    draw.line([(bx, by), (bx, jy)], fill=ARROW_COLOR, width=2)
                draw.line([(bx, jy), (CX + 2, jy)], fill=ARROW_COLOR, width=2)
                pending_merge = None
            else:
                if prev_anchor:
                    varrow(draw, prev_anchor[0], prev_anchor[1], CX, top_y)

            draw_document(draw, CX, cy, nd["text"], nd["actor"])
            prev_anchor = (CX, cy + DOC_H // 2 + 6)
            y = cy + DOC_H // 2 + 8 + VGAP
            final_y = max(final_y, y)

        # --- DECISION ---
        elif t == "decision":
            top_y = cy - DH // 2
            # Arrow from previous
            if prev_anchor:
                varrow(draw, prev_anchor[0], prev_anchor[1], CX, top_y)
            # Previous pending merge
            if pending_merge:
                bx, by = pending_merge
                jy = min(top_y - 8, max(by + 8, prev_anchor[1] + 12 if prev_anchor else by + 8))
                if by < jy:
                    draw.line([(bx, by), (bx, jy)], fill=ARROW_COLOR, width=2)
                draw.line([(bx, jy), (CX + 2, jy)], fill=ARROW_COLOR, width=2)
                pending_merge = None

            # Draw diamond
            draw_diamond(draw, CX, cy, nd["text"])

            # "Ya" label below diamond on left side of arrow
            draw.text((CX + 10, cy + DH // 2 + 3), "Ya", fill=YES_COLOR, font=f_label)

            # Branch: "Tidak" → right
            branch_nodes = nd.get("no", [])
            no_type = nd.get("no_type", "merge")

            d_right = CX + DW // 2
            b_left = BRANCH_CX - BPW // 2
            harrow(draw, d_right, cy, b_left, label="Tidak")

            # Draw branch nodes
            b_cy = cy
            b_prev = None
            for j, bn in enumerate(branch_nodes):
                if j > 0:
                    b_cy = cy + j * (BPH + VGAP)
                    if b_prev:
                        varrow(draw, b_prev[0], b_prev[1], BRANCH_CX, b_cy - BPH // 2)
                draw_process(draw, BRANCH_CX, b_cy, bn["text"], bn.get("actor", ""), w=BPW, h=BPH)
                b_prev = (BRANCH_CX, b_cy + BPH // 2)
                final_y = max(final_y, b_cy + BPH // 2 + VGAP)

            # Handle branch ending
            if no_type == "end":
                end_cy = b_prev[1] + VGAP + OH // 2
                varrow(draw, b_prev[0], b_prev[1], BRANCH_CX, end_cy - OH // 2)
                draw_oval(draw, BRANCH_CX, end_cy, "SELESAI")
                final_y = max(final_y, end_cy + OH // 2 + VGAP)

            elif no_type == "merge":
                pending_merge = b_prev

            elif no_type == "loop":
                loop_idx = nd.get("loop_target", max(0, i - 1))
                target_cy = node_cy_map.get(loop_idx, cy - 150)
                # Route: branch bottom → down → right gutter → up → right edge of target
                loop_gutter_x = BRANCH_CX + BPW // 2 + 28
                bx, by = b_prev
                seg_y = by + 12
                draw.line([(bx, by), (bx, seg_y)], fill=ARROW_COLOR, width=2)
                draw.line([(bx, seg_y), (loop_gutter_x, seg_y)], fill=ARROW_COLOR, width=2)
                draw.line([(loop_gutter_x, seg_y), (loop_gutter_x, target_cy)], fill=ARROW_COLOR, width=2)
                target_right = CX + PW // 2 + 3
                draw.line([(loop_gutter_x, target_cy), (target_right, target_cy)], fill=ARROW_COLOR, width=2)
                draw_arrowhead(draw, target_right, target_cy, loop_gutter_x, target_cy)
                final_y = max(final_y, seg_y + VGAP)

            # Advance Y for main flow
            diamond_bottom = cy + DH // 2
            if no_type == "merge" and pending_merge:
                next_top = max(diamond_bottom, pending_merge[1]) + VGAP
            else:
                next_top = diamond_bottom + VGAP
            # Peek at next node to center it
            if i + 1 < len(nodes):
                next_hh = _hh(nodes[i + 1]["type"])
                y = next_top + next_hh
            else:
                y = next_top
            prev_anchor = (CX, diamond_bottom)
            final_y = max(final_y, y)

    # Crop to actual content
    crop_h = int(final_y + PAD_BOTTOM)
    crop_h = min(crop_h, est_h)
    img = img.crop((0, 0, CANVAS_W, crop_h))

    out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
    img.save(out_path, "PNG")
    print(f"  [OK] {out_path}")


# ============================================================
# 7 SOP DEFINITIONS
# ============================================================

print("Generating proper SOP flowcharts...\n")

# ---- SOP 1: PENERIMAAN CALON DETENI ----
render_flowchart("SOP PENERIMAAN CALON DETENI", [
    S(),
    P("Kepala memberikan disposisi\npenerimaan calon deteni", "Kepala"),
    P("Memeriksa kelengkapan berkas kasus\n& Surat Perintah Pendetensian", "Kasi Reg"),
    D("Berkas lengkap\n& sah?",
      [P("Kembalikan berkas\nke Kanim pengirim", "Kasi Reg")], "end"),
    P("Penggeledahan badan\n& barang bawaan deteni", "Kasi Kamtib"),
    P("Pemeriksaan kesehatan\nfisik awal deteni", "Kasi Perkes"),
    P("Menyusun konsep SK Pendetensian\n& Berita Acara Serah Terima", "Kasi Reg"),
    P("Menerbitkan SK Pendetensian\n& Surat Perintah resmi", "Kepala"),
    DOC("SK Pendetensian & BAST", "Kasi Reg"),
    E(),
], "sop_penerimaan_flowchart.png")


# ---- SOP 2: REGISTRASI DETENI (SIMKIM) ----
render_flowchart("SOP REGISTRASI DETENI (SIMKIM)", [
    S(),
    P("Kepala menerbitkan Surat\nPerintah Pendetensian", "Kepala"),
    P("Memerintahkan registrasi deteni\n& pendataan barang bawaan", "Kasi Reg"),
    P("Merekam data biometrik deteni:\nsidik jari, foto wajah, retina", "Kasub Reg"),
    D("Cocok dgn\ndata cekal?",
      [P("Tandai WNA cekal &\nlapor ke Ditjenim", "Kasub Reg")], "merge"),
    P("Input biodata lengkap\nke aplikasi SIMKIM", "Kasub Reg"),
    D("Data SIMKIM\nterverifikasi?",
      [P("Perbaiki / lengkapi\ndata yang salah", "Kasub Reg")], "loop", loop_target=5),
    P("Cetak Kartu Identitas Deteni\n& Nomor Registrasi", "Kasub Reg"),
    DOC("Kartu Identitas Deteni & BAST", "Kasub Adm"),
    P("Serahkan deteni beserta berkas\nke Seksi Kamtib", "Kasub Reg"),
    E(),
], "sop_registrasi_flowchart.png")


# ---- SOP 3: PENEMPATAN DETENI ----
render_flowchart("SOP PENEMPATAN DETENI KE BLOK HUNIAN", [
    S(),
    P("Menerima berkas BAST registrasi\n& memberikan disposisi penempatan", "Kasi Kamtib"),
    D("Deteni rentan?\n(wanita/anak/lansia)",
      [P("Tempatkan di\nblok hunian umum", "Kasub Tertib")], "merge"),
    P("Tempatkan di blok khusus\nsesuai profil kerentanan", "Kasub Tertib"),
    P("Sosialisasi tata tertib, hak,\nserta kewajiban deteni", "Kasi Kamtib"),
    P("Mengawal deteni ke sel kamar\n& mengunci pintu blok", "Fungsional"),
    P("Memverifikasi & menandatangani\nBerita Acara Penempatan", "Kasi Kamtib"),
    DOC("Berita Acara Penempatan", "Kasub Tertib"),
    P("Menyusun laporan berkala\npenempatan deteni", "Kasi Kamtib"),
    E(),
], "sop_penempatan_flowchart.png")


# ---- SOP 4: PENJAGAAN & PENGAMANAN ----
render_flowchart("SOP PENJAGAAN & PENGAMANAN RUDENIM", [
    S(),
    P("Memerintahkan pelaksanaan tugas\npengamanan & penjagaan harian", "Kasi Kamtib"),
    P("Memimpin apel serah terima\npergantian regu jaga (piket)", "Kasub Tertib"),
    P("Memeriksa inventaris taktis\n& membagi pos tugas jaga", "Danru"),
    P("Melakukan patroli keliling\n& menghitung fisik deteni", "Penjaga"),
    D("Jumlah deteni\nsesuai manifest?",
      [P("Lapor Kasi Kamtib &\nlakukan lockdown", "Danru")], "end"),
    D("Ditemukan barang\nterlarang?",
      [P("Sita barang &\nlaporkan ke Kasi", "Penjaga")], "merge"),
    P("Menyusun laporan harian\npengamanan & serah terima", "Danru"),
    E(),
], "sop_penjagaan_flowchart.png")


# ---- SOP 5: PEMERIKSAAN KESEHATAN ----
render_flowchart("SOP PEMERIKSAAN KESEHATAN DETENI", [
    S(),
    P("Melaporkan adanya deteni\nmengeluh sakit ke Seksi Perkes", "Kasi Kamtib"),
    P("Melakukan pemeriksaan fisik awal\n& skrining tingkat kedaruratan", "Kasi Perkes"),
    D("Perlu dirujuk\nke RS?",
      [P("Rawat di poliklinik\ninternal Rudenim", "Kasi Perkes")], "end"),
    P("Mengajukan surat izin keluar\nsementara deteni untuk rujukan RS", "Kasi Reg"),
    P("Menandatangani berkas Surat\nIzin Keluar Sementara Deteni", "Kepala"),
    P("Mempersiapkan kendaraan\noperasional / ambulans", "Subbag TU"),
    P("Menugaskan personel pengawalan\n& menyiapkan Surat Perintah", "Kasi Kamtib"),
    P("Melakukan perawatan medis deteni\ndi Rumah Sakit mitra", "Kasi Perkes"),
    D("Dinyatakan\nsembuh?",
      [P("Lanjutkan perawatan\ndi Rumah Sakit", "Kasi Perkes")], "loop", loop_target=8),
    P("Memproses pemulangan deteni\nyang dinyatakan sembuh", "Kasi Perkes"),
    P("Mengembalikan deteni ke dalam\nblok kamar hunian Rudenim", "Kasi Kamtib"),
    P("Melaporkan kembalinya deteni\ndari RS kepada pimpinan", "Kasi Reg"),
    E(),
], "sop_kesehatan_flowchart.png")


# ---- SOP 6: PEMINDAHAN DETENI ----
render_flowchart("SOP PEMINDAHAN DETENI ANTAR RUDENIM", [
    S(),
    P("Rapat identifikasi urgensi\npemindahan deteni (overcapacity)", "Kasi Reg"),
    P("Menyusun surat permohonan\npemindahan ditujukan ke Kanwil", "Kasi Reg"),
    P("Menandatangani & mengajukan\npermohonan resmi ke Kakanwil", "Kepala"),
    P("Menelaah & meneruskan surat\npermohonan ke Ditjenim", "Kanwil"),
    D("Ditjenim\nmenyetujui?",
      [P("Tunda pemindahan &\ncari alternatif lain", "Kasi Reg")], "end"),
    P("Meneruskan surat Keputusan\nPersetujuan Ditjenim ke Rudenim", "Kanwil"),
    P("Menindaklanjuti & mendisposisi\npelaksanaan mutasi deteni", "Kepala"),
    P("Menyiapkan berkas pengeluaran\n& koordinasi dgn UPT tujuan", "Kasi Reg"),
    P("Mengeluarkan deteni dari sel\nhunian & serah terima berkas", "Kasi Reg"),
    P("Melaksanakan pengawalan fisik\ndeteni lintas daerah", "Kasi Kamtib"),
    P("Serah terima deteni & berkas\nportofolio di Rudenim penerima", "Kasi Kamtib"),
    DOC("Laporan Pelaksanaan\nPemindahan Deteni", "Kepala"),
    E(),
], "sop_pemindahan_flowchart.png")


# ---- SOP 7: PENDEPORTASIAN DETENI ----
render_flowchart("SOP PENDEPORTASIAN DETENI KE NEGARA ASAL", [
    S(),
    P("Mengusulkan data deteni siap\ndeportasi (dokumen & tiket)", "Kasi Reg"),
    D("Dokumen\nperjalanan\nlengkap?",
      [P("Koordinasi dgn kedutaan\nnegara asal deteni", "Kasi Reg")], "loop", loop_target=1),
    P("Memimpin rapat koordinasi teknis\npelaksanaan pemulangan paksa", "Kepala"),
    P("Menyusun konsep keputusan deportasi,\nSP pengawalan, & usulan cekal", "Kasi Reg"),
    P("Menyusun konsep Surat Perintah\nPengeluaran Deteni (SPPD)", "Kasub Adm"),
    P("Menandatangani berkas keputusan\ndeportasi & surat-surat perintah", "Kepala"),
    P("Menginput data rencana deportasi\nke modul SIMKIM", "Kasub Adm"),
    P("Menerakan cap stempel deportasi\nresmi pada paspor/SPLP deteni", "Kasub Adm"),
    P("Menandatangani stempel deportasi\ndi paspor & perintah pengeluaran", "Kepala"),
    P("Mengeluarkan deteni dari sel &\nserah terima barang bukti/fisik", "Kasi Kamtib"),
    P("Mengawal deteni ke bandara\ninternasional hingga masuk pesawat", "Fungsional"),
    DOC("Berita Acara Deportasi\n& Laporan Pelaksanaan", "Kasi Reg"),
    E(),
], "sop_deportasi_flowchart.png")

print("\n[OK] All 7 SOP flowcharts generated successfully!")

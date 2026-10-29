import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def generate():
    W, H = 2400, 1260  # 2x supersampling canvas (for crisp 1200x630 output)
    cx = W // 2

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, 'public')
    bg_path = r'C:\Users\SANJEET CHAUHAN\.gemini\antigravity-ide\brain\a6db79ce-ce51-4b87-a70f-aed7c75afcd4\og_bg_cinematic_1792838229531.jpg'
    
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert('RGBA').resize((W, H), Image.Resampling.LANCZOS)
    else:
        bg = Image.new('RGBA', (W, H), (8, 9, 13, 255))

    # 1. Overlay subtle architectural grid & schematic circuits
    grid_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(grid_layer)

    # Grid lines (subtle dark technical texture)
    for x in range(0, W, 80):
        g_draw.line([(x, 0), (x, H)], fill=(255, 255, 255, 6), width=1)
    for y in range(0, H, 80):
        g_draw.line([(0, y), (W, y)], fill=(255, 255, 255, 6), width=1)

    # Architectural schematic circuit nodes and traces
    circuit_coords = [
        [(160, 240), (320, 240), (400, 320), (520, 320)],
        [(2240, 240), (2080, 240), (2000, 320), (1880, 320)],
        [(160, 980), (320, 980), (400, 900), (520, 900)],
        [(2240, 980), (2080, 980), (2000, 900), (1880, 900)],
    ]
    for path in circuit_coords:
        for i in range(len(path) - 1):
            g_draw.line([path[i], path[i+1]], fill=(255, 59, 78, 55), width=3)
        for pt in path:
            g_draw.ellipse([pt[0]-7, pt[1]-7, pt[0]+7, pt[1]+7], fill=(255, 59, 78, 140), outline=(255, 255, 255, 180), width=2)

    # 2. Place the SC emblem with smooth radial mask
    emblem_src = Image.open(os.path.join(public_dir, 'sc_badge_isolated.png')).convert('RGBA')
    emb_w, emb_h = 360, 360
    emblem_resized = emblem_src.resize((emb_w, emb_h), Image.Resampling.LANCZOS)

    # Create radial mask for emblem
    emb_mask = Image.new('L', (emb_w, emb_h), 0)
    m_draw = ImageDraw.Draw(emb_mask)
    for rad in range(180, 0, -2):
        alpha = int(255 * (1 - (rad / 180.0) ** 4))
        m_draw.ellipse([180 - rad, 180 - rad, 180 + rad, 180 + rad], fill=alpha)
    emb_mask = emb_mask.filter(ImageFilter.GaussianBlur(radius=8))

    cy_emb = 295
    emb_x = cx - emb_w // 2
    emb_y = cy_emb - emb_h // 2

    # Glow layer
    glow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    for r_glow, alpha in [(320, 20), (260, 45), (200, 75), (150, 120)]:
        glow_draw.ellipse([cx - r_glow, cy_emb - r_glow, cx + r_glow, cy_emb + r_glow], fill=(255, 45, 65, alpha))

    # Text & Art layers
    text_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    text_draw = ImageDraw.Draw(text_layer)

    art_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    art_draw = ImageDraw.Draw(art_layer)

    # Fonts
    font_name = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 108)
    font_role = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 44)
    font_pill = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 38)
    font_domain = ImageFont.truetype(r'C:\Windows\Fonts\consola.ttf', 32)

    # Name: SANJEET CHAUHAN
    name = 'SANJEET CHAUHAN'
    n_bbox = text_draw.textbbox((0, 0), name, font=font_name)
    ntw = n_bbox[2] - n_bbox[0]
    nth = n_bbox[3] - n_bbox[1]
    y_name = 540

    for off in range(4, 25, 5):
        glow_draw.text((cx - ntw//2, y_name), name, font=font_name, fill=(255, 45, 65, 45))
    text_draw.text((cx - ntw//2, y_name), name, font=font_name, fill=(255, 255, 255, 255))

    # Subtitle: FULL-STACK DEVELOPER
    role = 'FULL-STACK DEVELOPER'
    r_bbox = text_draw.textbbox((0, 0), role, font=font_role)
    rtw = r_bbox[2] - r_bbox[0]
    rth = r_bbox[3] - r_bbox[1]
    y_role = 695

    glow_draw.text((cx - rtw//2, y_role), role, font=font_role, fill=(255, 50, 75, 140))
    text_draw.text((cx - rtw//2, y_role), role, font=font_role, fill=(255, 95, 115, 255))

    # Supporting Line pill: MERN Stack | Java | DSA | Cloud Computing
    pill_str = 'MERN Stack   |   Java   |   DSA   |   Cloud Computing'
    pb = text_draw.textbbox((0, 0), pill_str, font=font_pill)
    ptw = pb[2] - pb[0]
    pth = pb[3] - pb[1]

    pill_pad_x = 54
    pill_h = 76
    pill_w = ptw + pill_pad_x * 2
    pill_x = cx - pill_w // 2
    y_pill = 805

    # Glassmorphic container with ember outline
    art_draw.rounded_rectangle([pill_x, y_pill, pill_x + pill_w, y_pill + pill_h],
                               radius=pill_h//2, fill=(16, 14, 26, 235), outline=(255, 59, 78, 175), width=3)
    text_draw.text((pill_x + pill_pad_x, y_pill + (pill_h - pth)//2 - 4), pill_str, font=font_pill, fill=(240, 243, 250, 255))

    # Domain / Status Accent badge at bottom: sanjeet-chauhan.vercel.app
    dom_str = 'sanjeet-chauhan.vercel.app'
    db = text_draw.textbbox((0, 0), dom_str, font=font_domain)
    dtw = db[2] - db[0]
    dth = db[3] - db[1]
    
    dom_pad_x = 36
    dom_h = 56
    dom_w = dtw + dom_pad_x * 2 + 30
    dom_x = cx - dom_w // 2
    y_dom = 935

    art_draw.rounded_rectangle([dom_x, y_dom, dom_x + dom_w, y_dom + dom_h],
                               radius=dom_h//2, fill=(10, 11, 18, 220), outline=(255, 255, 255, 40), width=2)
    # Green status dot
    dot_x = dom_x + dom_pad_x
    dot_y = y_dom + dom_h // 2
    art_draw.ellipse([dot_x - 7, dot_y - 7, dot_x + 7, dot_y + 7], fill=(16, 185, 129, 255))
    text_draw.text((dot_x + 22, y_dom + (dom_h - dth)//2 - 2), dom_str, font=font_domain, fill=(156, 163, 175, 255))

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=20))

    comp = Image.alpha_composite(bg, grid_layer)
    comp = Image.alpha_composite(comp, glow_layer)
    comp.paste(emblem_resized, (emb_x, emb_y), emb_mask)
    comp = Image.alpha_composite(comp, art_layer)
    comp = Image.alpha_composite(comp, text_layer)

    final = comp.resize((1200, 630), Image.Resampling.LANCZOS).convert('RGB')
    
    # Save og-preview.jpg, og-image.jpg, portfolio-og-v3.jpg, portfolio-og-v2.jpg, og.jpg
    target_files = [
        'og-preview.jpg',
        'og-image.jpg',
        'portfolio-og-v3.jpg',
        'portfolio-og-v2.jpg',
        'og.jpg'
    ]
    for fn in target_files:
        out_path = os.path.join(public_dir, fn)
        final.save(out_path, quality=93, optimize=True)
        print(f'Saved {out_path} ({os.path.getsize(out_path)} bytes, {os.path.getsize(out_path)/1024:.1f} KB)')

    final.save(os.path.join(public_dir, 'og.png'), optimize=True)
    print('Generated all Open Graph preview images successfully!')

if __name__ == '__main__':
    generate()

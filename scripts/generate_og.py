import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def generate():
    W, H = 2400, 1260 # 2x supersampling canvas
    cx = W // 2

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, 'public')
    bg_path = r'C:\Users\SANJEET CHAUHAN\.gemini\antigravity-ide\brain\a6db79ce-ce51-4b87-a70f-aed7c75afcd4\og_bg_cinematic_1792838229531.jpg'
    
    if os.path.exists(bg_path):
        bg = Image.open(bg_path).convert('RGBA').resize((W, H), Image.Resampling.LANCZOS)
    else:
        bg = Image.new('RGBA', (W, H), (8, 9, 13, 255))

    # 1. Place the SC emblem with smooth radial mask
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

    cy_emb = 310
    emb_x = cx - emb_w // 2
    emb_y = cy_emb - emb_h // 2

    # Glow layer
    glow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    for r_glow, alpha in [(300, 20), (250, 40), (200, 70), (160, 110)]:
        glow_draw.ellipse([cx - r_glow, cy_emb - r_glow, cx + r_glow, cy_emb + r_glow], fill=(255, 45, 65, alpha))

    # Text & Art layers
    text_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    text_draw = ImageDraw.Draw(text_layer)

    art_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    art_draw = ImageDraw.Draw(art_layer)

    # Fonts
    font_name = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 106)
    font_role = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 44)
    font_badge = ImageFont.truetype(r'C:\Windows\Fonts\segoeuib.ttf', 32)

    # Name: SANJEET CHAUHAN
    name = 'SANJEET CHAUHAN'
    n_bbox = text_draw.textbbox((0, 0), name, font=font_name)
    ntw = n_bbox[2] - n_bbox[0]
    nth = n_bbox[3] - n_bbox[1]
    y_name = 570

    for off in range(4, 25, 5):
        glow_draw.text((cx - ntw//2, y_name), name, font=font_name, fill=(255, 45, 65, 50))
    text_draw.text((cx - ntw//2, y_name), name, font=font_name, fill=(255, 255, 255, 255))

    # Role
    role = 'FULL STACK DEVELOPER  |  JAVA & DSA'
    r_bbox = text_draw.textbbox((0, 0), role, font=font_role)
    rtw = r_bbox[2] - r_bbox[0]
    rth = r_bbox[3] - r_bbox[1]
    y_role = 730

    glow_draw.text((cx - rtw//2, y_role), role, font=font_role, fill=(255, 50, 75, 140))
    text_draw.text((cx - rtw//2, y_role), role, font=font_role, fill=(255, 95, 115, 255))

    # Pills
    pills = ['Java', 'DSA', 'React', 'Node.js', 'Next.js']
    pill_pads_h = 36
    pill_h = 68
    pill_gap = 22

    pill_widths = []
    for p in pills:
        pb = text_draw.textbbox((0, 0), p, font=font_badge)
        pill_widths.append((pb[2] - pb[0]) + pill_pads_h * 2)

    total_pills_w = sum(pill_widths) + pill_gap * (len(pills) - 1)
    start_x = cx - total_pills_w // 2
    y_pills = 850

    curr_x = start_x
    for i, p in enumerate(pills):
        pw = pill_widths[i]
        pb = text_draw.textbbox((0, 0), p, font=font_badge)
        ptw = pb[2] - pb[0]
        pth = pb[3] - pb[1]
        
        art_draw.rounded_rectangle([curr_x, y_pills, curr_x + pw, y_pills + pill_h], 
                                   radius=pill_h//2, fill=(18, 16, 28, 225), outline=(255, 60, 80, 160), width=3)
        text_draw.text((curr_x + (pw - ptw)//2, y_pills + (pill_h - pth)//2 - 4), p, font=font_badge, fill=(235, 240, 250, 245))
        curr_x += pw + pill_gap

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=20))

    comp = Image.alpha_composite(bg, glow_layer)
    comp.paste(emblem_resized, (emb_x, emb_y), emb_mask)
    comp = Image.alpha_composite(comp, art_layer)
    comp = Image.alpha_composite(comp, text_layer)

    final = comp.resize((1200, 630), Image.Resampling.LANCZOS).convert('RGB')
    
    # Save og.jpg
    final.save(os.path.join(public_dir, 'og.jpg'), quality=90, optimize=True)
    # Save og.png
    final.save(os.path.join(public_dir, 'og.png'), optimize=True)
    
    print('Generated public/og.jpg and public/og.png successfully!')

if __name__ == '__main__':
    generate()

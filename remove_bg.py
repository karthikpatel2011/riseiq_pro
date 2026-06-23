"""
Remove white background from the 3 Sixthpage illustration PNGs.
Run from project root: python remove_bg.py
Requires: pip install Pillow
"""
from PIL import Image
import os

ASSETS = os.path.join("src", "assets")
FILES  = [
    "learning.png", "phase2.png", "phase3.png",
    "dashboard-hero.png", "dashboard-doubt.png",
    "dashboard-teammates.png", "dashboard-placements.png",
    "dashboard-learn.png"
]

def remove_white(path, threshold=220):
    img = Image.open(path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    visited = set()
    queue = []
    
    # Add all border pixels to queue
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
        visited.add((x, 0))
        visited.add((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))
        visited.add((0, y))
        visited.add((width - 1, y))
        
    while queue:
        x, y = queue.pop(0)
        r, g, b, a = pixels[x, y]
        # Check if the pixel is close to white/light gray
        is_light = (r >= threshold and g >= threshold and b >= threshold) or (
            (r + g + b) / 3 >= 210 and abs(r - g) < 10 and abs(g - b) < 10
        )
        if is_light:
            pixels[x, y] = (r, g, b, 0)
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                        
    img.save(path, "PNG")
    print(f"  [OK]  {os.path.basename(path)}")

print("Removing white backgrounds...")
for f in FILES:
    p = os.path.join(ASSETS, f)
    if os.path.exists(p):
        remove_white(p)
    else:
        print(f"  [ERR]  {f} not found — save it to src/assets/ first")
print("Done.")

from PIL import Image
from collections import Counter
import sys

def get_dominant_colors(image_path, num_colors=3):
    try:
        img = Image.open(image_path).convert('RGBA')
        img = img.resize((50, 50)) # resize for speed
        pixels = img.getdata()
        
        # filter out transparent pixels
        valid_pixels = [p[:3] for p in pixels if p[3] > 200 and not (p[0] > 240 and p[1] > 240 and p[2] > 240) and not (p[0] < 15 and p[1] < 15 and p[2] < 15)]
        
        counts = Counter(valid_pixels)
        for color, count in counts.most_common(num_colors):
            print(f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_dominant_colors(r"c:\01_ATP\02_Project_Git\atp-kuytanya\frontend\public\logo.png")

from PIL import Image
import os

img_path = 'docs/Gemini_Generated_Image_nzxuh0nzxuh0nzxu.png'
out_path = 'public/logo.png'

if not os.path.exists(img_path):
    print(f"Error: {img_path} not found")
    exit(1)

img = Image.open(img_path)
width, height = img.size
print(f"Original size: {width}x{height}")

# Left side is the main logo
left_half = img.crop((0, 0, width//2, height))
left_half = left_half.convert("RGBA")

data = left_half.getdata()
newData = []
for item in data:
    if item[0] > 240 and item[1] > 240 and item[2] > 240:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)
left_half.putdata(newData)

bbox = left_half.getbbox()
if bbox:
    cropped = left_half.crop(bbox)
    pad = 20
    padded = Image.new('RGBA', (cropped.width + pad*2, cropped.height + pad*2), (255, 255, 255, 0))
    padded.paste(cropped, (pad, pad))
    # Resize to have height around 128 for good resolution but not too large
    if padded.height > 128:
        ratio = 128 / padded.height
        padded = padded.resize((int(padded.width * ratio), 128), Image.Resampling.LANCZOS)
    padded.save(out_path, 'PNG')
    print(f"Successfully saved logo to {out_path} with size {padded.size}")
else:
    print("Could not find content to crop")

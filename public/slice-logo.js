const Jimp = require('jimp');

async function processImage() {
  try {
    const img = await Jimp.read('/Users/woosungjo/ImApplePie20/imapplepieTemplate001/docs/Gemini_Generated_Image_nzxuh0nzxuh0nzxu.png');
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    
    // Left half (Logo with text)
    const logoFull = img.clone().crop(0, 0, w / 2, h);
    await logoFull.writeAsync('/Users/woosungjo/ImApplePie20/imapplepieTemplate001/public/logo-full.png');
    
    // Right half (Square icon)
    const iconSide = img.clone().crop(w / 2, 0, w / 2, h);
    
    // Crop center square
    const sideW = w / 2;
    const sideH = h;
    const minDim = Math.min(sideW, sideH);
    // Add some padding to crop exactly to the rounded square icon inside
    const iconCrop = iconSide.clone().crop(
      (sideW - minDim) / 2 + 50,  // adjust for white space
      (sideH - minDim) / 2 + 50,
      minDim - 100,
      minDim - 100
    );
    
    await iconCrop.writeAsync('/Users/woosungjo/ImApplePie20/imapplepieTemplate001/public/icon.png');
    
    // Favicon (32x32)
    const favicon = iconCrop.clone().resize(32, 32);
    // Since Jimp doesn't support .ico out of the box easily without extras,
    // we save as png and will just rename or use as png favicon
    await favicon.writeAsync('/Users/woosungjo/ImApplePie20/imapplepieTemplate001/public/favicon.png');
    
    console.log("Images sliced successfully.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

processImage();

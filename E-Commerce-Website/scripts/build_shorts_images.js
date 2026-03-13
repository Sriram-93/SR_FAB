const Jimp = require('jimp');
const path = require('path');
const fs   = require('fs');

const brainDir   = '/home/sriram/.gemini/antigravity/brain/fa3f1e26-10cc-474d-947d-80a7f495a9cb';
const catalogDir = path.join(__dirname, '../frontend/public/images/products/catalog');
if (!fs.existsSync(catalogDir)) fs.mkdirSync(catalogDir, { recursive: true });

// The 2 AI-generated base shorts (clean product photos)
const BASE_CASUAL  = path.join(brainDir, 'casual_shorts_navy_1773207132227.png');   // Navy casual
const BASE_CARGO   = path.join(brainDir, 'casual_shorts_grey_1773207145795.png');   // grey — will reuse for cargo shape

// Color hex map
const COLOR_HEX = {
  'navy-blue':    '#1B2E5A',
  'grey':         '#7D7D7D',
  'black':        '#222222',
  'beige':        '#C8AD8F',
  'olive-green':  '#5A6B3A',
  'light-brown':  '#A07850',
  'khaki':        '#C3A96B',
  'sand':         '#D4C08A',
  'brown':        '#7B4E2D',
  'blue-white':   '#3B6EBA',
  'black-grey':   '#4A4A4A',
  'green-white':  '#3D7A3D',
  'beige-brown':  '#B09060',
};

const SHAPES = {
  'casual-shorts': BASE_CASUAL,
  'cargo-shorts':  BASE_CARGO,
  'pattern-shorts':BASE_CASUAL,
};

async function tintImage(srcPath, destPath, hexColor) {
  const img   = await Jimp.read(srcPath);
  const color = Jimp.intToRGBA(Jimp.cssColorToHex(hexColor + 'ff'));

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx+1];
    const b = this.bitmap.data[idx+2];
    const a = this.bitmap.data[idx+3];
    if (a === 0) return; // transparent — skip

    // Is this pixel part of the garment (non-white, non-shadow)?
    const brightness = 0.299*r + 0.587*g + 0.114*b;
    if (brightness < 230) { // garment pixel
      const lum = brightness / 255;
      this.bitmap.data[idx]   = Math.round(color.r * lum);
      this.bitmap.data[idx+1] = Math.round(color.g * lum);
      this.bitmap.data[idx+2] = Math.round(color.b * lum);
    }
  });

  await img.writeAsync(destPath);
  console.log('Created:', path.basename(destPath));
}

async function addPatternOverlay(destPath, patternType) {
  const img = await Jimp.read(destPath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;

  img.scan(0, 0, w, h, function(x, y, idx) {
    const brightness = 0.299*this.bitmap.data[idx] + 0.587*this.bitmap.data[idx+1] + 0.114*this.bitmap.data[idx+2];
    if (brightness > 230) return; // skip background

    if (patternType === 'striped') {
      if (x % 20 < 5) {
        this.bitmap.data[idx]   = Math.min(255, this.bitmap.data[idx]   + 60);
        this.bitmap.data[idx+1] = Math.min(255, this.bitmap.data[idx+1] + 60);
        this.bitmap.data[idx+2] = Math.min(255, this.bitmap.data[idx+2] + 60);
      }
    } else if (patternType === 'checked') {
      if ((Math.floor(x/18) + Math.floor(y/18)) % 2 === 0) {
        this.bitmap.data[idx]   = Math.min(255, this.bitmap.data[idx]   + 50);
        this.bitmap.data[idx+1] = Math.min(255, this.bitmap.data[idx+1] + 50);
        this.bitmap.data[idx+2] = Math.min(255, this.bitmap.data[idx+2] + 50);
      }
    } else if (patternType === 'minimal') {
      if (x % 40 < 2 || y % 40 < 2) {
        this.bitmap.data[idx]   = Math.max(0, this.bitmap.data[idx]   - 40);
        this.bitmap.data[idx+1] = Math.max(0, this.bitmap.data[idx+1] - 40);
        this.bitmap.data[idx+2] = Math.max(0, this.bitmap.data[idx+2] - 40);
      }
    } else if (patternType === 'tropical') {
      const blob = (Math.floor(x/35) + Math.floor(y/55)) % 3;
      if (blob === 0) {
        this.bitmap.data[idx]   = Math.min(255, this.bitmap.data[idx]   + 40);
      } else if (blob === 1) {
        this.bitmap.data[idx+1] = Math.min(255, this.bitmap.data[idx+1] + 40);
      }
    }
  });

  await img.writeAsync(destPath);
}

const combinations = {
  'casual-shorts': {
    types:  ["basic-cotton-shorts","relaxed-fit-cotton-shorts","summer-cotton-shorts","elastic-waist-cotton-shorts","drawstring-cotton-shorts"],
    colors: ["navy-blue","grey","black","beige","olive-green","light-brown"],
    base:   BASE_CASUAL,
  },
  'cargo-shorts': {
    types:  ["classic-cargo-shorts","multi-pocket-cargo-shorts","utility-cargo-shorts","outdoor-cotton-cargo-shorts"],
    colors: ["khaki","olive-green","sand","black","grey","brown"],
    base:   BASE_CARGO,
  },
  'pattern-shorts': {
    types:  ["striped-cotton-shorts","checked-cotton-shorts","minimal-pattern-cotton-shorts","tropical-print-cotton-shorts"],
    colors: ["blue-white","black-grey","green-white","beige-brown"],
    base:   BASE_CASUAL,
    patterns: ["striped","checked","minimal","tropical"],
  },
};

async function run() {
  for (const [prefix, data] of Object.entries(combinations)) {
    for (const type of data.types) {
      for (const color of data.colors) {
        const destPath = path.join(catalogDir, `${prefix}-${type}-${color}.png`);
        const hex      = COLOR_HEX[color] || '#777777';
        await tintImage(data.base, destPath, hex);

        // For pattern shorts, also add the visual overlay
        if (prefix === 'pattern-shorts') {
          const patternIdx = data.types.indexOf(type);
          const pattern    = data.patterns[patternIdx];
          await addPatternOverlay(destPath, pattern);
        }
      }
    }
  }
  console.log('All shorts images built!');
}

run();

/**
 * build_lounge_images.js
 * Generates all color variations for MEN'S PURE COTTON LOUNGEWEAR & NIGHTWEAR
 * Uses Jimp to tint 6 AI-generated base images into all required color combos.
 */

const Jimp = require('jimp');
const path = require('path');
const fs   = require('fs');

const brainDir   = '/home/sriram/.gemini/antigravity/brain/fa3f1e26-10cc-474d-947d-80a7f495a9cb';
const catalogDir = path.join(__dirname, '../frontend/public/images/products/catalog');
if (!fs.existsSync(catalogDir)) fs.mkdirSync(catalogDir, { recursive: true });

// ── 6 AI-generated base images ──────────────────────────────────────────
const BASE_LOUNGE_PANTS  = path.join(brainDir, 'base_lounge_pants_grey_1773218778986.png');
const BASE_PYJAMA_PANTS  = path.join(brainDir, 'base_pyjama_pants_navy_1773218800630.png');
const BASE_STRIPED_PYJAMA= path.join(brainDir, 'base_pattern_pyjama_striped_green_white_1773219115366.png');
const BASE_CHECKED_PYJAMA= path.join(brainDir, 'base_checked_pyjama_bw_1773219555737.png');
const BASE_NIGHTWEAR_SET = path.join(brainDir, 'base_nightwear_set_skyblue_1773219132234.png');
const BASE_TSHIRT_SHORTS = path.join(brainDir, 'base_nightwear_tshirt_shorts_1773219571707.png');

// ── Color hex map ──────────────────────────────────────────────────────
const COLOR_HEX = {
  'grey':        '#7D7D7D',
  'navy-blue':   '#1B2E5A',
  'black':       '#222222',
  'olive-green': '#5A6B3A',
  'beige':       '#C8AD8F',
  'charcoal':    '#3D3D3D',
  'cream':       '#F5E6C8',
  'light-blue':  '#6A9FD8',
  'maroon':      '#6B2233',
  'sky-blue':    '#7BB8E8',
  'light-grey':  '#B0B0B0',
  // Pattern combos — tint the whole garment toward the primary color
  'blue-white':   '#3B6EBA',
  'grey-white':   '#8A8A8A',
  'black-grey':   '#3A3A3A',
  'green-white':  '#3D7A3D',
};

// ── Tint function ────────────────────────────────────────────────────────
async function tintImage(srcPath, destPath, hexColor) {
  const img   = await Jimp.read(srcPath);
  const color = Jimp.intToRGBA(Jimp.cssColorToHex(hexColor + 'ff'));

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx+1];
    const b = this.bitmap.data[idx+2];
    const a = this.bitmap.data[idx+3];
    if (a === 0) return;

    const brightness = 0.299*r + 0.587*g + 0.114*b;
    if (brightness < 235) { // garment pixel (non-white background)
      const lum = brightness / 255;
      this.bitmap.data[idx]   = Math.round(color.r * lum);
      this.bitmap.data[idx+1] = Math.round(color.g * lum);
      this.bitmap.data[idx+2] = Math.round(color.b * lum);
    }
  });

  await img.writeAsync(destPath);
  console.log('  ✓', path.basename(destPath));
}

// ── Add pattern overlay for striped/checked/minimal variants ─────────
async function addPatternOverlay(destPath, patternType) {
  const img = await Jimp.read(destPath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;

  img.scan(0, 0, w, h, function(x, y, idx) {
    const brightness = 0.299*this.bitmap.data[idx] + 0.587*this.bitmap.data[idx+1] + 0.114*this.bitmap.data[idx+2];
    if (brightness > 230) return; // skip white background

    if (patternType === 'striped') {
      if (x % 20 < 5) {
        this.bitmap.data[idx]   = Math.min(255, this.bitmap.data[idx]   + 55);
        this.bitmap.data[idx+1] = Math.min(255, this.bitmap.data[idx+1] + 55);
        this.bitmap.data[idx+2] = Math.min(255, this.bitmap.data[idx+2] + 55);
      }
    } else if (patternType === 'checked') {
      if ((Math.floor(x/18) + Math.floor(y/18)) % 2 === 0) {
        this.bitmap.data[idx]   = Math.min(255, this.bitmap.data[idx]   + 45);
        this.bitmap.data[idx+1] = Math.min(255, this.bitmap.data[idx+1] + 45);
        this.bitmap.data[idx+2] = Math.min(255, this.bitmap.data[idx+2] + 45);
      }
    } else if (patternType === 'minimal') {
      if (x % 40 < 2 || y % 40 < 2) {
        this.bitmap.data[idx]   = Math.max(0, this.bitmap.data[idx]   - 35);
        this.bitmap.data[idx+1] = Math.max(0, this.bitmap.data[idx+1] - 35);
        this.bitmap.data[idx+2] = Math.max(0, this.bitmap.data[idx+2] - 35);
      }
    }
  });

  await img.writeAsync(destPath);
}

// ── Catalog definitions ─────────────────────────────────────────────────

const catalog = [
  // 1. COTTON LOUNGE PANTS — 5 types × 6 colors = 30
  {
    prefix: 'lounge-pants',
    base: BASE_LOUNGE_PANTS,
    types: [
      'soft-cotton-lounge-pants',
      'relax-fit-cotton-lounge-pants',
      'elastic-waist-cotton-lounge-pants',
      'drawstring-cotton-lounge-pants',
      'comfort-cotton-homewear-pants',
    ],
    colors: ['grey', 'navy-blue', 'black', 'olive-green', 'beige', 'charcoal'],
  },
  // 2. COTTON PYJAMA PANTS — 4 types × 5 colors = 20
  {
    prefix: 'pyjama-pants',
    base: BASE_PYJAMA_PANTS,
    types: [
      'classic-cotton-pyjama-pants',
      'relaxed-cotton-pyjama-pants',
      'elastic-waist-pyjama-pants',
      'drawstring-cotton-pyjama-pants',
    ],
    colors: ['grey', 'navy-blue', 'black', 'cream', 'light-blue'],
  },
  // 3. PATTERN PYJAMA PANTS — 3 types × 4 colors = 12
  {
    prefix: 'pattern-pyjama',
    base: BASE_STRIPED_PYJAMA,
    checkedBase: BASE_CHECKED_PYJAMA,
    types: [
      { slug: 'striped-cotton-pyjama-pants', pattern: 'striped' },
      { slug: 'checked-cotton-pyjama-pants', pattern: 'checked' },
      { slug: 'minimal-pattern-pyjama-pants', pattern: 'minimal' },
    ],
    colors: ['blue-white', 'grey-white', 'black-grey', 'green-white'],
  },
  // 4. COTTON NIGHTWEAR SETS — 3 types × 5 colors = 15
  {
    prefix: 'nightwear',
    types: [
      { slug: 'cotton-night-suit-set',           base: BASE_NIGHTWEAR_SET },
      { slug: 'cotton-sleep-shirt-pyjama-set',   base: BASE_NIGHTWEAR_SET },
      { slug: 'cotton-sleep-tshirt-shorts-set',  base: BASE_TSHIRT_SHORTS },
    ],
    colors: ['light-grey', 'navy-blue', 'sky-blue', 'cream', 'olive-green'],
  },
];

// ── Build all images ─────────────────────────────────────────────────────

async function run() {
  let count = 0;

  // 1. Lounge Pants
  console.log('\n🏠 Building LOUNGE PANTS images...');
  const lp = catalog[0];
  for (const type of lp.types) {
    for (const color of lp.colors) {
      const filename = `${lp.prefix}-${type}-${color}.png`;
      const dest = path.join(catalogDir, filename);
      await tintImage(lp.base, dest, COLOR_HEX[color]);
      count++;
    }
  }

  // 2. Pyjama Pants (solid)
  console.log('\n🌙 Building PYJAMA PANTS images...');
  const pp = catalog[1];
  for (const type of pp.types) {
    for (const color of pp.colors) {
      const filename = `${pp.prefix}-${type}-${color}.png`;
      const dest = path.join(catalogDir, filename);
      await tintImage(pp.base, dest, COLOR_HEX[color]);
      count++;
    }
  }

  // 3. Pattern Pyjama Pants
  console.log('\n🎨 Building PATTERN PYJAMA PANTS images...');
  const pat = catalog[2];
  for (const typeObj of pat.types) {
    const baseImg = typeObj.pattern === 'checked' ? pat.checkedBase : pat.base;
    for (const color of pat.colors) {
      const filename = `${pat.prefix}-${typeObj.slug}-${color}.png`;
      const dest = path.join(catalogDir, filename);
      await tintImage(baseImg, dest, COLOR_HEX[color]);
      await addPatternOverlay(dest, typeObj.pattern);
      count++;
    }
  }

  // 4. Nightwear Sets
  console.log('\n😴 Building NIGHTWEAR SETS images...');
  const nw = catalog[3];
  for (const typeObj of nw.types) {
    for (const color of nw.colors) {
      const filename = `${nw.prefix}-${typeObj.slug}-${color}.png`;
      const dest = path.join(catalogDir, filename);
      await tintImage(typeObj.base, dest, COLOR_HEX[color]);
      count++;
    }
  }

  console.log(`\n✅ All ${count} loungewear images built!`);
}

run().catch(console.error);

const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'frontend', 'public', 'images', 'products', 'catalog');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// 10 AI-generated base images from the Round Neck run
// These images match the exact ecommerce style requirements to serve as baselines.
const baseImages = {
  white: 'round_neck_white*.png',
  black: 'round_neck_black*.png',
  navy: 'round_neck_navy_blue*.png',
  sky: 'round_neck_sky_blue*.png',
  olive: 'round_neck_olive_green*.png',
  maroon: 'round_neck_maroon*.png',
  mustard: 'round_neck_mustard_yellow*.png',
  grey: 'round_neck_grey*.png',
  charcoal: 'round_neck_charcoal*.png',
  beige: 'round_neck_beige*.png'
};

// Map generated filename glob to an actual file if we can
const resolvedBaseFiles = {};
const filesInDir = fs.readdirSync(targetDir);
for (const [color, pattern] of Object.entries(baseImages)) {
  const prefix = pattern.replace('*.png', '');
  const matched = filesInDir.find(f => f.startsWith(prefix) && f !== prefix + '.png');
  if (matched) {
    resolvedBaseFiles[color] = path.join(targetDir, matched);
  } else {
    // If exact clean name exists
    if (filesInDir.includes(prefix + '.png')) {
       resolvedBaseFiles[color] = path.join(targetDir, prefix + '.png');
    } else {
       // fallback to white
       const w = filesInDir.find(f => f.startsWith('round_neck_white_'));
       resolvedBaseFiles[color] = w ? path.join(targetDir, w) : null;
    }
  }
}

// Colors map to base colors
const colorMapping = {
  'white': 'white', 'black': 'black', 'navy': 'navy', 'navy blue': 'navy', 
  'sky blue': 'sky', 'olive green': 'olive', 'maroon': 'maroon', 'burgundy': 'maroon',
  'mustard yellow': 'mustard', 'grey': 'grey', 'charcoal': 'charcoal', 'beige': 'beige'
};

const copyBaseImage = (colorName, destName) => {
   const baseColor = colorMapping[colorName.toLowerCase()] || 'white';
   const sourceFile = resolvedBaseFiles[baseColor] || Object.values(resolvedBaseFiles)[0];
   if (sourceFile && fs.existsSync(sourceFile)) {
       const destPath = path.join(targetDir, destName + '.png');
       if (!fs.existsSync(destPath)) {
          fs.copyFileSync(sourceFile, destPath);
          console.log(`Created: ${destName}.png (styled as ${baseColor})`);
       }
   } else {
       console.log(`Error: Could not find base image for ${destName}.png`);
   }
}

const requirements = {
   "v_neck": ["White", "Black", "Navy Blue", "Grey", "Olive Green"],
   "polo_classic": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "polo_slim_fit": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "polo_contrast_collar": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "polo_tipped_collar": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "oversized": ["Black", "Grey", "Beige", "White", "Olive Green"],
   "printed_typography": ["minimal_text", "bold_typography", "motivational_quote"],
   "printed_graphic": ["abstract_graphic", "retro_graphic", "cartoon_graphic"],
   "printed_pattern": ["geometric_pattern", "all_over_pattern"]
};

// V-Neck
requirements.v_neck.forEach(color => copyBaseImage(color, `v-neck-${color.toLowerCase().replace(' ', '-')}`));

// Polo
Object.keys(requirements).filter(k => k.startsWith('polo_')).forEach(style => {
    requirements[style].forEach(color => {
         copyBaseImage(color, `${style.replace('_', '-')}-${color.toLowerCase().replace(' ', '-')}`);
    });
});

// Oversized
requirements.oversized.forEach(color => copyBaseImage(color, `oversized-${color.toLowerCase().replace(' ', '-')}`));

// Printed (using white base)
requirements.printed_typography.forEach(print => copyBaseImage('white', `typography-print-${print.replace('_', '-')}`));
requirements.printed_graphic.forEach(print => copyBaseImage('white', `graphic-print-${print.replace('_', '-')}`));
requirements.printed_pattern.forEach(print => copyBaseImage('white', `pattern-print-${print.replace('_', '-')}`));

console.log('Finished generating full catalog combinations.');

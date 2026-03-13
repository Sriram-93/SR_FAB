const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../frontend/public/images/products/catalog/');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const brainDir = '/home/sriram/.gemini/antigravity/brain/fa3f1e26-10cc-474d-947d-80a7f495a9cb';

const sourceFiles = {
  chinos_khaki: path.join(brainDir, 'chinos_khaki_1773200210248.png'),
  chinos_beige: path.join(brainDir, 'chinos_beige_1773200230793.png'),
  chinos_navyblue: path.join(brainDir, 'chinos_navy_1773200248353.png'),
  chinos_black: path.join(brainDir, 'chinos_black_1773200264317.png'),
  chinos_olivegreen: path.join(brainDir, 'chinos_olive_1773200304365.png'),
  chinos_lightgrey: path.join(brainDir, 'chinos_lightgrey_1773200321514.png'),
  chinos_charcoal: path.join(brainDir, 'chinos_charcoal_1773200338146.png'),
  chinos_brown: path.join(brainDir, 'chinos_brown_1773200354378.png'),

  casual_grey: path.join(brainDir, 'casual_grey_1773200373600.png'),
  casual_charcoal: path.join(brainDir, 'casual_charcoal_1773200391056.png'),
  casual_navyblue: path.join(brainDir, 'casual_navy_1773200456758.png'),
  casual_cream: path.join(brainDir, 'casual_cream_1773200473435.png'),
  casual_sand: path.join(brainDir, 'casual_sand_1773200490290.png'),
  casual_brown: path.join(brainDir, 'casual_brown_1773200507505.png'),
  casual_olivegreen: path.join(brainDir, 'casual_olive_1773200520639.png'),

  cargo_sand: path.join(brainDir, 'cargo_sand_1773200540030.png'),
  cargo_black: path.join(brainDir, 'cargo_black_1773200555169.png')
};

function getSourceFile(prefix, color) {
  const colorKey = color.toLowerCase().replace(/ /g, '');
  let key = `${prefix.replace('-pants', '')}_${colorKey}`;
  
  if (sourceFiles[key]) return sourceFiles[key];

  // Fallbacks for Cargo Pants
  if (prefix === 'cargo-pants') {
      if (['black', 'darkbrown'].includes(colorKey)) return sourceFiles.cargo_black;
      return sourceFiles.cargo_sand; // Fallback for Military Green, Khaki, Grey, Olive Green
  }

  // Generic fallback just in case
  return sourceFiles.chinos_khaki;
}

const combinations = {
  chinos: {
    types: ["Slim Fit Cotton Chinos", "Regular Fit Cotton Chinos", "Stretch Cotton Chinos", "Casual Cotton Chinos"],
    colors: ["Khaki", "Beige", "Navy Blue", "Black", "Olive Green", "Light Grey", "Charcoal", "Brown"]
  },
  "casual-pants": {
    types: ["Straight Fit Cotton Pants", "Relaxed Fit Cotton Pants", "Elastic Waist Cotton Pants", "Drawstring Cotton Pants"],
    colors: ["Grey", "Charcoal", "Navy Blue", "Cream", "Sand", "Brown", "Olive Green"]
  },
  "cargo-pants": {
    types: ["Classic Cargo Pants", "Slim Fit Cargo Pants", "Multi Pocket Cargo Pants", "Utility Cargo Pants", "Tactical Cargo Pants"],
    colors: ["Military Green", "Khaki", "Sand", "Black", "Grey", "Olive Green", "Dark Brown"]
  }
};

let count = 0;

Object.entries(combinations).forEach(([prefix, data]) => {
  data.types.forEach(type => {
      data.colors.forEach(color => {
          const typeSlug = type.toLowerCase().replace(/ /g, '-');
          const colorSlug = color.toLowerCase().replace(/ /g, '-');
          const targetPath = path.join(targetDir, `${prefix}-${typeSlug}-${colorSlug}.png`);
          
          const sourcePath = getSourceFile(prefix, color);
          
          try {
              if (fs.existsSync(sourcePath)) {
                  fs.copyFileSync(sourcePath, targetPath);
                  count++;
              } else {
                  console.log(`Missing source file: ${sourcePath} for ${prefix} ${color}`);
              }
          } catch(e) {
              console.error(`Failed to copy to: ${targetPath}`);
          }
      });
  });
});

console.log(`Successfully mapped ${count} pants images.`);

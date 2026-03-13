const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../frontend/public/images/products/catalog/');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Source images from brain folder
const brainDir = '/home/sriram/.gemini/antigravity/brain/fa3f1e26-10cc-474d-947d-80a7f495a9cb';

const sourceFiles = {
  formal_white: path.join(brainDir, 'formal_white_1773048559797.png'),
  formal_lightblue: path.join(brainDir, 'formal_lightblue_1773048576359.png'),
  formal_pink: path.join(brainDir, 'formal_pink_1773048593352.png'),
  formal_cream: path.join(brainDir, 'formal_cream_1773048609772.png'),
  formal_lightgrey: path.join(brainDir, 'formal_lightgrey_1773048625128.png'),
  
  casual_olive: path.join(brainDir, 'casual_olive_1773048641562.png'),
  casual_navy: path.join(brainDir, 'casual_navy_1773048657149.png'),
  casual_brown: path.join(brainDir, 'casual_brown_1773048674462.png'),
  
  check_red_black: path.join(brainDir, 'check_red_black_1773048687799.png'),
  check_blue_white: path.join(brainDir, 'check_blue_white_1773048701273.png'),
  check_green_navy: path.join(brainDir, 'check_green_navy_1773048828528.png'),
  check_grey_white: path.join(brainDir, 'check_grey_white_1773048844385.png'),
  check_brown_cream: path.join(brainDir, 'check_brown_cream_1773048857767.png'),
  
  stripe_blue_white: path.join(brainDir, 'stripe_blue_white_1773048873359.png'),
  stripe_black_white: path.join(brainDir, 'stripe_black_white_1773048886917.png'),
  stripe_navy_grey: path.join(brainDir, 'stripe_navy_grey_1773048900542.png'),
  stripe_grey_white: path.join(brainDir, 'stripe_grey_white_1773048915485.png'),

  // Tinted Fallbacks
  formal_skyblue: path.join(brainDir, 'formal_skyblue_generated.png'),
  casual_beige: path.join(brainDir, 'casual_beige_generated.png'),
  casual_cream: path.join(brainDir, 'casual_cream_generated.png'),
  casual_dustyblue: path.join(brainDir, 'casual_dustyblue_generated.png'),
  
  print_floral: path.join(brainDir, 'print_floral.png'),
  print_tropical: path.join(brainDir, 'print_tropical.png'),
  print_abstract: path.join(brainDir, 'print_abstract.png'),
  print_modern: path.join(brainDir, 'print_modern.png')
};

function getSourceFile(prefix, color) {
  let key = `${prefix}_${color.toLowerCase().replace(/ & /g, '_').replace(/ /g, '')}`;
  
  // Print fallbacks
  if (prefix === 'print') {
     if (color.includes('Floral')) return sourceFiles.print_floral;
     if (color.includes('Tropical') || color.includes('Palm')) return sourceFiles.print_tropical;
     if (color.includes('Abstract')) return sourceFiles.print_abstract;
     return sourceFiles.print_modern; // Modern, Paisley, Geometric
  }

  return sourceFiles[key] || sourceFiles.formal_white;
}

const combinations = {
  formal: {
      types: ["Classic Formal Shirt", "Slim Fit Formal Shirt", "Regular Fit Formal Shirt", "Oxford Cotton Shirt", "Spread Collar Shirt", "Button Down Collar Shirt"],
      colors: ["White", "Light Blue", "Pastel Pink", "Cream", "Light Grey", "Sky Blue"]
  },
  casual: {
      types: ["Casual Plain Cotton Shirt", "Soft Washed Cotton Shirt", "Weekend Casual Shirt", "Mandarin Collar Cotton Shirt", "Cuban Collar Cotton Shirt"],
      colors: ["Olive Green", "Navy Blue", "Brown", "Beige", "Cream", "Dusty Blue"]
  },
  check: {
      types: ["Classic Check Shirt", "Micro Check Shirt", "Large Check Shirt", "Plaid Cotton Shirt"],
      colors: ["Red & Black", "Blue & White", "Green & Navy", "Grey & White", "Brown & Cream"]
  },
  stripe: {
      types: ["Vertical Stripe Shirt", "Horizontal Stripe Shirt", "Pinstripe Shirt", "Bold Stripe Shirt"],
      colors: ["Blue & White", "Black & White", "Navy & Grey", "Grey & White"]
  },
  print: {
      types: ["Small Floral Print Shirt", "Large Floral Print Shirt", "Palm Leaf Print Shirt", "Tropical Pattern Shirt", "Minimal Abstract Shirt", "Modern Pattern Shirt", "Paisley Print Shirt", "Geometric Print Shirt"],
      colors: ["Printed"] // Virtual color to trigger the print fallback
  }
};

Object.entries(combinations).forEach(([prefix, data]) => {
  data.types.forEach(type => {
      data.colors.forEach(color => {
          let sourceFile;
          if (prefix === 'print') {
             sourceFile = getSourceFile('print', type); 
             color = ""; 
          } else {
             sourceFile = getSourceFile(prefix, color);
          }
          
          const typeSlug = type.toLowerCase().replace(/ /g, '-');
          let targetPath;
          
          if (prefix === 'print') {
             targetPath = path.join(targetDir, `print-${typeSlug}.png`);
          } else {
             const colorSlug = color.toLowerCase().replace(/ & /g, '-').replace(/ /g, '');
             targetPath = path.join(targetDir, `${prefix}-${typeSlug}-${colorSlug}.png`);
          }
          
          try {
              if (fs.existsSync(sourceFile)) {
                  fs.copyFileSync(sourceFile, targetPath);
                  console.log(`Copied: ${path.basename(targetPath)}`);
              } else {
                  console.log(`Missing source file: ${sourceFile}`);
              }
          } catch(e) {
              console.error(`Failed to copy: ${targetPath}`);
          }
      });
  });
});

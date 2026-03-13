const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const brainDir = '/home/sriram/.gemini/antigravity/brain/fa3f1e26-10cc-474d-947d-80a7f495a9cb';
const baseFormalWhite = path.join(brainDir, 'formal_white_1773048559797.png');
const baseCasualGrey = path.join(brainDir, 'casual_grey_1773200373600.png'); // using pants for casual? No wait, casual shirts did not generate "casual_white". But I can use formal_white for casual items if I want. Actually, for casual shirts, I have casual_olive, casual_navy, casual_brown. I can use formal_white to tint.

async function colorizeImage(source, target, hexStr) {
  try {
     const image = await Jimp.read(source);
     const color = Jimp.intToRGBA(Jimp.cssColorToHex(hexStr));
     
     image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
         let r = this.bitmap.data[idx + 0];
         let g = this.bitmap.data[idx + 1];
         let b = this.bitmap.data[idx + 2];
         let a = this.bitmap.data[idx + 3];

         // If pixel is mostly white/grey (shirt), tint it
         // Very simple multiply blend
         if (r > 100 && g > 100 && b > 100 && Math.abs(r-g) < 20 && Math.abs(r-b) < 20 && a > 0) {
              const luminance = (0.299*r + 0.587*g + 0.114*b) / 255;
              this.bitmap.data[idx + 0] = Math.max(0, Math.min(255, luminance * color.r));
              this.bitmap.data[idx + 1] = Math.max(0, Math.min(255, luminance * color.g));
              this.bitmap.data[idx + 2] = Math.max(0, Math.min(255, luminance * color.b));
         }
     });

     await image.writeAsync(target);
     console.log('Created: ' + target);
  } catch (err) {
      console.error(err);
  }
}

async function run() {
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'formal_skyblue_generated.png'), '#82C3D3'); // Sky Blue
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'casual_beige_generated.png'), '#F2E8D0'); // Beige
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'casual_cream_generated.png'), '#F5F5DC'); // Cream
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'casual_dustyblue_generated.png'), '#6B90A0'); // Dusty Blue
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'print_floral.png'), '#EAA5B5'); // Fake it with a pink tint for now
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'print_tropical.png'), '#76B58F'); // Fake it with a green tint
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'print_abstract.png'), '#F2CA7C'); // Fake it with a yellow/gold tint
  await colorizeImage(baseFormalWhite, path.join(brainDir, 'print_modern.png'), '#514D62'); // Dark purple tint
}

run();

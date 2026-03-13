const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const catalogDir = path.join(__dirname, '../frontend/public/images/products/catalog');

async function processShirt(file) {
    const filePath = path.join(catalogDir, file);
    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const cx = width / 2;

    if (file.includes('mandarin-collar')) {
        // Cut out the standard collar to make it a Mandarin band
        // Approximately top center
        const topY = 150;
        const bottomY = 240;
        image.scan(0, 0, width, height, function(x, y, idx) {
            if (y >= topY && y < topY + 40 && Math.abs(x - cx) < 220) {
               // keep the neck band
            } else if (y >= topY + 40 && y <= bottomY && Math.abs(x - cx) < 250) {
               // clear the collar wings
               this.bitmap.data[idx + 0] = 255; 
               this.bitmap.data[idx + 1] = 255; 
               this.bitmap.data[idx + 2] = 255; 
               this.bitmap.data[idx + 3] = 255; 
            }
        });
    }

    if (file.includes('micro-check')) {
        // Add a secondary very fine grid
        image.scan(0, 0, width, height, function(x, y, idx) {
            if (x % 4 < 1 || y % 4 < 1) {
                this.bitmap.data[idx + 0] = Math.max(0, this.bitmap.data[idx + 0] - 15);
                this.bitmap.data[idx + 1] = Math.max(0, this.bitmap.data[idx + 1] - 15);
                this.bitmap.data[idx + 2] = Math.max(0, this.bitmap.data[idx + 2] - 15);
            }
        });
    }

    if (file.includes('bold-stripe')) {
        // Overlap existing stripes to make them look bolder
        image.scan(0, 0, width, height, function(x, y, idx) {
            if (x % 30 < 10) {
                this.bitmap.data[idx + 0] = Math.max(0, this.bitmap.data[idx + 0] - 25);
                this.bitmap.data[idx + 1] = Math.max(0, this.bitmap.data[idx + 1] - 25);
                this.bitmap.data[idx + 2] = Math.max(0, this.bitmap.data[idx + 2] - 25);
            }
        });
    }

    if (file.includes('pinstripe')) {
        // Add very thin vertical lines
        image.scan(0, 0, width, height, function(x, y, idx) {
            if (x % 15 === 0) {
                this.bitmap.data[idx + 0] = Math.max(0, this.bitmap.data[idx + 0] - 40);
                this.bitmap.data[idx + 1] = Math.max(0, this.bitmap.data[idx + 1] - 40);
                this.bitmap.data[idx + 2] = Math.max(0, this.bitmap.data[idx + 2] - 40);
            }
        });
    }

    await image.writeAsync(filePath);
    console.log('Processed Shirt: ' + file);
}

async function run() {
    const files = fs.readdirSync(catalogDir);
    for (let file of files) {
        if (file.startsWith('formal-') || file.startsWith('casual-') || file.startsWith('check-') || file.startsWith('stripe-')) {
            if (file.includes('collar') || file.includes('check') || file.includes('stripe') || file.includes('fit') || file.includes('shirt')) {
               await processShirt(file);
            }
        }
    }
}

run();

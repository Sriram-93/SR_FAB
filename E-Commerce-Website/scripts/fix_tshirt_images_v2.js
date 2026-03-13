const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

const catalogDir = path.join(__dirname, '../frontend/public/images/products/catalog');

async function processImage(file) {
    const filePath = path.join(catalogDir, file);
    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const cx = width / 2;
    const cy = height / 2;

    if (file.startsWith('v-neck-')) {
        // More realistic V-neck shadow/cut
        const topY = 160;
        const bottomY = 340;
        const neckWidth = 200;
        image.scan(0, 0, width, height, function(x, y, idx) {
            if (y >= topY && y <= bottomY) {
                const progress = (y - topY) / (bottomY - topY);
                const currentWidth = neckWidth * (1 - progress);
                if (x >= cx - currentWidth/2 && x <= cx + currentWidth/2) {
                    this.bitmap.data[idx + 0] = Math.min(255, this.bitmap.data[idx + 0] + 50); 
                    this.bitmap.data[idx + 1] = Math.min(255, this.bitmap.data[idx + 1] + 50); 
                    this.bitmap.data[idx + 2] = Math.min(255, this.bitmap.data[idx + 2] + 50); 
                }
            }
        });
    } 
    else if (file.startsWith('polo-')) {
        // Add a visible collar shadow and bigger placket
        const placketTop = 230;
        const placketBottom = 450;
        const placketWidth = 50;
        image.scan(0, 0, width, height, function(x, y, idx) {
            if (y >= placketTop && y <= placketBottom && x >= cx - placketWidth/2 && x <= cx + placketWidth/2) {
                this.bitmap.data[idx + 0] = Math.max(0, this.bitmap.data[idx + 0] - 40);
                this.bitmap.data[idx + 1] = Math.max(0, this.bitmap.data[idx + 1] - 40);
                this.bitmap.data[idx + 2] = Math.max(0, this.bitmap.data[idx + 2] - 40);
            }
            // Buttons
            if (x >= cx - 8 && x <= cx + 8) {
                if ((y >= 280 && y <= 295) || (y >= 350 && y <= 365) || (y >= 410 && y <= 425)) {
                    this.bitmap.data[idx + 0] = 220; 
                    this.bitmap.data[idx + 1] = 220; 
                    this.bitmap.data[idx + 2] = 220; 
                }
            }
        });
    }
    else if (file.includes('print-')) {
        // Unique prints for each specific variation
        if (file.includes('minimal-text')) {
             // 3 lines of "text"
             drawRect(image, cx-50, cy-40, 100, 10, '#333333');
             drawRect(image, cx-50, cy-20, 100, 10, '#333333');
             drawRect(image, cx-50, cy, 60, 10, '#333333');
        } else if (file.includes('bold-typography')) {
             drawRect(image, cx-80, cy-50, 160, 60, '#111111');
             drawRect(image, cx-80, cy+20, 160, 20, '#555555');
        } else if (file.includes('motivational-quote')) {
             drawRect(image, cx-70, cy-60, 140, 5, '#444444');
             drawRect(image, cx-60, cy-40, 120, 5, '#444444');
             drawRect(image, cx-70, cy+60, 140, 5, '#444444');
        } else if (file.includes('abstract-graphic')) {
             drawCircle(image, cx, cy, 90, '#E91E63');
             drawRect(image, cx-40, cy-110, 20, 220, '#FFC107');
        } else if (file.includes('retro-graphic')) {
             drawRect(image, cx-90, cy-60, 180, 120, '#FF9800');
             drawRect(image, cx-70, cy-40, 140, 80, '#2196F3');
        } else if (file.includes('cartoon-graphic')) {
             drawCircle(image, cx-40, cy-20, 30, '#4CAF50');
             drawCircle(image, cx+40, cy-20, 30, '#4CAF50');
             drawRect(image, cx-20, cy+30, 40, 10, '#F44336');
        } else if (file.includes('geometric-pattern')) {
             for(let i=0; i<5; i++) {
                 drawRect(image, cx-100 + i*40, cy-100, 20, 200, i%2===0 ? '#3F51B5' : '#00BCD4');
             }
        } else if (file.includes('all-over-pattern')) {
             image.scan(0, 0, width, height, function(x, y, idx) {
                 if (x % 50 < 5 || y % 50 < 5) {
                     this.bitmap.data[idx + 0] = Math.max(0, this.bitmap.data[idx + 0] - 20);
                 }
             });
        }
    }

    await image.writeAsync(filePath);
    console.log('Processed: ' + file);
}

function drawRect(image, x, y, w, h, hex) {
    const color = Jimp.intToRGBA(Jimp.cssColorToHex(hex));
    image.scan(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h), function(sx, sy, idx) {
        this.bitmap.data[idx + 0] = color.r;
        this.bitmap.data[idx + 1] = color.g;
        this.bitmap.data[idx + 2] = color.b;
        this.bitmap.data[idx + 3] = color.a;
    });
}

function drawCircle(image, cx, cy, r, hex) {
    const color = Jimp.intToRGBA(Jimp.cssColorToHex(hex));
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        const dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        if (dist <= r) {
            this.bitmap.data[idx + 0] = color.r;
            this.bitmap.data[idx + 1] = color.g;
            this.bitmap.data[idx + 2] = color.b;
            this.bitmap.data[idx + 3] = color.a;
        }
    });
}

async function run() {
    const files = fs.readdirSync(catalogDir);
    for (let file of files) {
        if (file.includes('v-neck') || file.includes('polo') || file.includes('print')) {
            await processImage(file);
        }
    }
}

run();

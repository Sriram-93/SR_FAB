const fs = require('fs');
const path = require('path');

const casualTypes    = ["Basic Cotton Shorts","Relaxed Fit Cotton Shorts","Summer Cotton Shorts","Elastic Waist Cotton Shorts","Drawstring Cotton Shorts"];
const casualColors   = ["Navy Blue","Grey","Black","Beige","Olive Green","Light Brown"];

const cargoTypes     = ["Classic Cargo Shorts","Multi Pocket Cargo Shorts","Utility Cargo Shorts","Outdoor Cotton Cargo Shorts"];
const cargoColors    = ["Khaki","Olive Green","Sand","Black","Grey","Brown"];

const patternTypes   = ["Striped Cotton Shorts","Checked Cotton Shorts","Minimal Pattern Cotton Shorts","Tropical Print Cotton Shorts"];
const patternColors  = ["Blue & White","Black & Grey","Green & White","Beige & Brown"];

let sql = "USE srfab;\n\n";
sql += "DELETE FROM product_variant WHERE pid >= 305 AND pid <= 500;\n";
sql += "DELETE FROM product WHERE pid >= 305 AND pid <= 500;\n\n";

let pid = 305;
const cid = 4; // Cotton Shorts
const variants = ['S','M','L','XL','XXL'];

function addProducts(types, colors, prefix, price) {
  types.forEach(type => {
    colors.forEach(color => {
      const typeSlug  = type.toLowerCase().replace(/ /g, '-');
      const colorSlug = color.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
      const imageName  = `/images/products/catalog/${prefix}-${typeSlug}-${colorSlug}.png`;
      const name       = `${color} ${type}`;
      const desc       = `Premium 100% pure cotton ${name.toLowerCase()} for men. Breathable fabric, comfortable fit, and versatile style.`;
      const discount   = 10;

      sql += `-- Product ${pid}: ${name}\n`;
      sql += `INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (${pid}, '${name}', '${desc}', ${price}, ${discount}, '${imageName}', ${cid}, 'SR FAB', 'Pure Cotton');\n`;
      variants.forEach(size => {
        const typeCode  = type.split(' ').map(s=>s[0].toUpperCase()).join('').substring(0,3);
        const colorCode = color.replace(/ & /,'').split(' ').map(s=>s[0].toUpperCase()).join('').substring(0,3);
        const sku = `SH-${typeCode}-${colorCode}-${size}-${pid}`;
        const c   = color.split(' & ')[0];
        sql += `INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (${pid}, '${size}', '${c}', 40, '${sku}');\n`;
      });
      sql += "\n";
      pid++;
    });
  });
}

addProducts(casualTypes,  casualColors,  'casual-shorts', 799);
addProducts(cargoTypes,   cargoColors,   'cargo-shorts',  999);
addProducts(patternTypes, patternColors, 'pattern-shorts',899);

fs.writeFileSync('shorts_catalog_insert.sql', sql);
console.log('SQL generated for', pid - 305, 'shorts products.');

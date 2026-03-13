const fs = require('fs');
const path = require('path');

const chinosTypes = [
  "Slim Fit Cotton Chinos", "Regular Fit Cotton Chinos", 
  "Stretch Cotton Chinos", "Casual Cotton Chinos"
];
const chinosColors = [
  "Khaki", "Beige", "Navy Blue", "Black", "Olive Green", 
  "Light Grey", "Charcoal", "Brown"
];

const casualPantsTypes = [
  "Straight Fit Cotton Pants", "Relaxed Fit Cotton Pants", 
  "Elastic Waist Cotton Pants", "Drawstring Cotton Pants"
];
const casualPantsColors = [
  "Grey", "Charcoal", "Navy Blue", "Cream", "Sand", 
  "Brown", "Olive Green"
];

const cargoPantsTypes = [
  "Classic Cargo Pants", "Slim Fit Cargo Pants", 
  "Multi Pocket Cargo Pants", "Utility Cargo Pants", "Tactical Cargo Pants"
];
const cargoPantsColors = [
  "Military Green", "Khaki", "Sand", "Black", "Grey", 
  "Olive Green", "Dark Brown"
];

let sql = "USE srfab;\n\n";
sql += "DELETE FROM product_variant WHERE pid >= 210 AND pid <= 400;\n";
sql += "DELETE FROM product WHERE pid >= 210 AND pid <= 400;\n\n";

let startPid = 210;
const cid = 3; // Men's Pants (Assuming 3, could be something else, let's look at seed_data if needed, but we'll use 3)

const variants = ['S', 'M', 'L', 'XL', 'XXL'];

function addProducts(types, colors, prefix) {
  types.forEach(type => {
    colors.forEach(color => {
      const typeSlug = type.toLowerCase().replace(/ /g, '-');
      const colorSlug = color.toLowerCase().replace(/ /g, '-');
      const imageName = `/images/products/catalog/${prefix}-${typeSlug}-${colorSlug}.png`;
      const productName = `${color} ${type}`;
      const description = `Premium 100% pure cotton ${productName.toLowerCase()} for men. Studio quality craftsmanship, breathable fabric, and perfect fit.`;
      
      let price = 1499;
      if (prefix === 'cargo-pants') price = 1799;
      if (prefix === 'casual-pants') price = 1299;
      
      const discount = 15;

      sql += `-- Product ${startPid}: ${productName}\n`;
      sql += `INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (${startPid}, '${productName}', '${description}', ${price}, ${discount}, '${imageName}', ${cid}, 'SR FAB', 'Pure Cotton');\n`;
      
      variants.forEach(size => {
         const typeCode = type.split(' ').map(s => s[0].toUpperCase()).join('').substring(0,3);
         const colorCode = color.split(' ').map(s => s[0].toUpperCase()).join('').substring(0,3);
         const sku = `PN-${typeCode}-${colorCode}-${size}-${startPid}`;
         
         const colorValue = color; 
         sql += `INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (${startPid}, '${size}', '${colorValue}', 30, '${sku}');\n`;
      });
      sql += "\n";
      startPid++;
    });
  });
}

addProducts(chinosTypes, chinosColors, 'chinos');
addProducts(casualPantsTypes, casualPantsColors, 'casual-pants');
addProducts(cargoPantsTypes, cargoPantsColors, 'cargo-pants');


fs.writeFileSync('pants_catalog_insert.sql', sql);
console.log('SQL generated for ' + (startPid - 210) + ' pants products.');

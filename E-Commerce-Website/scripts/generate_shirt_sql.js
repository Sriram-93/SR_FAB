const fs = require('fs');
const path = require('path');

const formalTypes = [
  "Classic Formal Shirt", "Slim Fit Formal Shirt", "Regular Fit Formal Shirt", 
  "Oxford Cotton Shirt", "Spread Collar Shirt", "Button Down Collar Shirt"
];
const formalColors = ["White", "Light Blue", "Pastel Pink", "Cream", "Light Grey", "Sky Blue"];

const casualTypes = [
  "Casual Plain Cotton Shirt", "Soft Washed Cotton Shirt", "Weekend Casual Shirt", 
  "Mandarin Collar Cotton Shirt", "Cuban Collar Cotton Shirt"
];
const casualColors = ["Olive Green", "Navy Blue", "Brown", "Beige", "Cream", "Dusty Blue"];

const checkedTypes = [
  "Classic Check Shirt", "Micro Check Shirt", "Large Check Shirt", "Plaid Cotton Shirt"
];
const checkedColors = ["Red & Black", "Blue & White", "Green & Navy", "Grey & White", "Brown & Cream"];

const stripedTypes = [
  "Vertical Stripe Shirt", "Horizontal Stripe Shirt", "Pinstripe Shirt", "Bold Stripe Shirt"
];
const stripedColors = ["Blue & White", "Black & White", "Navy & Grey", "Grey & White"];

const printTypes = {
  "Floral": ["Small Floral Print Shirt", "Large Floral Print Shirt"],
  "Tropical": ["Palm Leaf Print Shirt", "Tropical Pattern Shirt"],
  "Abstract": ["Minimal Abstract Shirt", "Modern Pattern Shirt"],
  "Other": ["Paisley Print Shirt", "Geometric Print Shirt"]
};

let sql = "USE srfab;\n\n";
sql += "DELETE FROM product_variant WHERE pid >= 100 AND pid <= 500;\n";
sql += "DELETE FROM product WHERE pid >= 100 AND pid <= 500;\n\n";

let startPid = 100;
const cid = 2; // Men's Shirts

const variants = ['S', 'M', 'L', 'XL', 'XXL'];

function addProducts(types, colors, prefix) {
  types.forEach(type => {
    colors.forEach(color => {
      const typeSlug = type.toLowerCase().replace(/ /g, '-');
      const colorSlug = color.toLowerCase().replace(/ & /g, '-').replace(/ /g, '');
      const imageName = `/images/products/catalog/${prefix}-${typeSlug}-${colorSlug}.png`;
      const productName = `${color} ${type}`;
      const description = `Premium 100% pure cotton ${productName.toLowerCase()} for men. Studio quality craftsmanship, breathable fabric, and perfect fit.`;
      const price = prefix === 'formal' ? 1299 : 1099;
      const discount = 15;

      sql += `-- Product ${startPid}: ${productName}\n`;
      sql += `INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (${startPid}, '${productName}', '${description}', ${price}, ${discount}, '${imageName}', ${cid}, 'SR FAB', 'Pure Cotton');\n`;
      
      variants.forEach(size => {
         const typeCode = type.split(' ').map(s => s[0].toUpperCase()).join('').substring(0,3);
         const colorCode = color.replace(/ & /g, '').split(' ').map(s => s[0].toUpperCase()).join('').substring(0,3);
         const sku = `SH-${typeCode}-${colorCode}-${size}-${startPid}`;
         
         const colorValue = color.split(' & ')[0]; // just use primary color for color field
         sql += `INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (${startPid}, '${size}', '${colorValue}', 40, '${sku}');\n`;
      });
      sql += "\n";
      startPid++;
    });
  });
}

addProducts(formalTypes, formalColors, 'formal');
addProducts(casualTypes, casualColors, 'casual');
addProducts(checkedTypes, checkedColors, 'check');
addProducts(stripedTypes, stripedColors, 'stripe');

Object.entries(printTypes).forEach(([category, pTypes]) => {
  pTypes.forEach(type => {
    // Prints don't have color combinations specified, we just use "Printed" as color
    const typeSlug = type.toLowerCase().replace(/ /g, '-');
    const imageName = `/images/products/catalog/print-${typeSlug}.png`;
    const productName = `${type}`;
    const description = `Premium 100% pure cotton ${productName.toLowerCase()} for men. Studio quality craftsmanship, breathable fabric, and excellent prints.`;
    const price = 1199;
    const discount = 10;

    sql += `-- Product ${startPid}: ${productName}\n`;
    sql += `INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (${startPid}, '${productName}', '${description}', ${price}, ${discount}, '${imageName}', ${cid}, 'SR FAB', 'Pure Cotton');\n`;
    
    variants.forEach(size => {
       const typeCode = type.split(' ').map(s => s[0].toUpperCase()).join('').substring(0,3);
       const sku = `SH-PRT-${typeCode}-${size}-${startPid}`;
       
       sql += `INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (${startPid}, '${size}', 'Printed', 35, '${sku}');\n`;
    });
    sql += "\n";
    startPid++;
  });
});

fs.writeFileSync('shirt_catalog_insert.sql', sql);
console.log('SQL generated for ' + (startPid - 100) + ' shirt products.');

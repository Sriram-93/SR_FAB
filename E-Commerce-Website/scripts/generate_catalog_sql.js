const fs = require('fs');
const path = require('path');

const requirements = {
   "round-neck": ["White", "Black", "Navy Blue", "Sky Blue", "Olive Green", "Maroon", "Mustard Yellow", "Grey", "Charcoal", "Beige"],
   "v-neck": ["White", "Black", "Navy Blue", "Grey", "Olive Green"],
   "polo-classic": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "polo-slim-fit": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "polo-contrast-collar": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "polo-tipped-collar": ["White", "Navy Blue", "Black", "Burgundy", "Olive Green", "Sky Blue"],
   "oversized": ["Black", "Grey", "Beige", "White", "Olive Green"],
   "typography-print": ["minimal-text", "bold-typography", "motivational-quote"],
   "graphic-print": ["abstract-graphic", "retro-graphic", "cartoon-graphic"],
   "pattern-print": ["geometric-pattern", "all-over-pattern"]
};

let sql = "USE srfab;\n\n";
sql += "DELETE FROM product_variant WHERE pid >= 16 AND pid <= 67;\n";
sql += "DELETE FROM product WHERE pid >= 16 AND pid <= 67;\n\n";
let startPid = 16;
const cid = 1; // Men's T-Shirts (as per seed_data.sql or first available)

Object.entries(requirements).forEach(([style, variations]) => {
    variations.forEach(variant => {
        const isPrint = style.includes('print');
        const color = isPrint ? 'White' : variant;
        const namePart = variant.charAt(0).toUpperCase() + variant.slice(1).replace(/-/g, ' ');
        const styleName = style.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        
        const productName = isPrint 
            ? `${styleName} (${namePart})`
            : `${namePart} ${styleName}`;
        
        const slug = variant.toLowerCase().replace(/ /g, '-');
        const imageName = `/images/products/catalog/${style}-${slug}.png`;
        
        const price = style.includes('polo') ? 999 : (style.includes('oversized') ? 899 : 799);
        const discount = 10;
        const description = `Premium 100% pure cotton ${productName.toLowerCase()} for men. Studio quality craftsmanship, breathable fabric, and perfect fit.`;

        sql += `-- Product ${startPid}: ${productName}\n`;
        sql += `INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (${startPid}, '${productName}', '${description}', ${price}, ${discount}, '${imageName}', ${cid}, 'SR FAB', 'Pure Cotton');\n`;
        
        // Variants
        ['S', 'M', 'L', 'XL', 'XXL'].forEach(size => {
            const styleCode = style.split('-').map(s => s[0].toUpperCase()).join('');
            const variantCode = variant.substring(0, 3).toUpperCase().replace(/ /g, '');
            const sku = `${styleCode}-${variantCode}-${size}-${startPid}`;
            sql += `INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (${startPid}, '${size}', '${color}', 50, '${sku}');\n`;
        });
        
        sql += "\n";
        startPid++;
    });
});

fs.writeFileSync('catalog_insert.sql', sql);
console.log('SQL generated for ' + (startPid - 16) + ' products.');

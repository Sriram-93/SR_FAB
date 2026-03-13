/**
 * update_lounge_db.js
 * Drops old cid=5 products and re-inserts with correct catalog image filenames.
 * Matches the files built by build_lounge_images.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CID = 5;
const BRAND = 'SR FAB';
const FABRIC = 'Pure Cotton';
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Image base path used in the DB (relative URL served by frontend)
const IMG_BASE = '/images/products/catalog/';

// ── Full catalog ────────────────────────────────────────────────────────

const sections = [
  // 1. COTTON LOUNGE PANTS — 5 types × 6 colors = 30
  {
    prefix: 'lounge-pants',
    price: '699',
    discount: 15,
    types: [
      { name: 'Soft Cotton Lounge Pants',          slug: 'soft-cotton-lounge-pants',          apparel: 'Lounge Pants', fit: 'Relaxed Fit' },
      { name: 'Relax Fit Cotton Lounge Pants',     slug: 'relax-fit-cotton-lounge-pants',     apparel: 'Lounge Pants', fit: 'Relaxed Fit' },
      { name: 'Elastic Waist Cotton Lounge Pants', slug: 'elastic-waist-cotton-lounge-pants', apparel: 'Lounge Pants', fit: 'Regular Fit' },
      { name: 'Drawstring Cotton Lounge Pants',    slug: 'drawstring-cotton-lounge-pants',    apparel: 'Lounge Pants', fit: 'Regular Fit' },
      { name: 'Comfort Cotton Home Wear Pants',    slug: 'comfort-cotton-homewear-pants',     apparel: 'Home Wear',    fit: 'Relaxed Fit' },
    ],
    colors: [
      { display: 'Grey',        slug: 'grey' },
      { display: 'Navy Blue',   slug: 'navy-blue' },
      { display: 'Black',       slug: 'black' },
      { display: 'Olive Green', slug: 'olive-green' },
      { display: 'Beige',       slug: 'beige' },
      { display: 'Charcoal',    slug: 'charcoal' },
    ],
  },
  // 2. COTTON PYJAMA PANTS — 4 types × 5 colors = 20
  {
    prefix: 'pyjama-pants',
    price: '649',
    discount: 12,
    types: [
      { name: 'Classic Cotton Pyjama Pants',   slug: 'classic-cotton-pyjama-pants',    apparel: 'Pyjama Pants', fit: 'Regular Fit' },
      { name: 'Relaxed Cotton Pyjama Pants',   slug: 'relaxed-cotton-pyjama-pants',    apparel: 'Pyjama Pants', fit: 'Relaxed Fit' },
      { name: 'Elastic Waist Pyjama Pants',    slug: 'elastic-waist-pyjama-pants',     apparel: 'Pyjama Pants', fit: 'Regular Fit' },
      { name: 'Drawstring Cotton Pyjama Pants',slug: 'drawstring-cotton-pyjama-pants', apparel: 'Pyjama Pants', fit: 'Regular Fit' },
    ],
    colors: [
      { display: 'Grey',       slug: 'grey' },
      { display: 'Navy Blue',  slug: 'navy-blue' },
      { display: 'Black',      slug: 'black' },
      { display: 'Cream',      slug: 'cream' },
      { display: 'Light Blue', slug: 'light-blue' },
    ],
  },
  // 3. PATTERN PYJAMA PANTS — 3 types × 4 colors = 12
  {
    prefix: 'pattern-pyjama',
    price: '749',
    discount: 10,
    types: [
      { name: 'Striped Cotton Pyjama Pants',  slug: 'striped-cotton-pyjama-pants',  apparel: 'Pyjama Pants', fit: 'Regular Fit' },
      { name: 'Checked Cotton Pyjama Pants',  slug: 'checked-cotton-pyjama-pants',  apparel: 'Pyjama Pants', fit: 'Regular Fit' },
      { name: 'Minimal Pattern Pyjama Pants', slug: 'minimal-pattern-pyjama-pants', apparel: 'Pyjama Pants', fit: 'Regular Fit' },
    ],
    colors: [
      { display: 'Blue & White',  slug: 'blue-white' },
      { display: 'Grey & White',  slug: 'grey-white' },
      { display: 'Black & Grey',  slug: 'black-grey' },
      { display: 'Green & White', slug: 'green-white' },
    ],
  },
  // 4. COTTON NIGHTWEAR SETS — 3 types × 5 colors = 15
  {
    prefix: 'nightwear',
    price: '999',
    discount: 15,
    types: [
      { name: 'Cotton Night Suit Set',             slug: 'cotton-night-suit-set',          apparel: 'Nightwear Set', fit: 'Regular Fit' },
      { name: 'Cotton Sleep Shirt & Pyjama Set',   slug: 'cotton-sleep-shirt-pyjama-set',  apparel: 'Nightwear Set', fit: 'Regular Fit' },
      { name: 'Cotton Sleep T-Shirt & Shorts Set', slug: 'cotton-sleep-tshirt-shorts-set', apparel: 'Nightwear Set', fit: 'Relaxed Fit' },
    ],
    colors: [
      { display: 'Light Grey',  slug: 'light-grey' },
      { display: 'Navy Blue',   slug: 'navy-blue' },
      { display: 'Sky Blue',    slug: 'sky-blue' },
      { display: 'Cream',       slug: 'cream' },
      { display: 'Olive Green', slug: 'olive-green' },
    ],
  },
];

// ── Generate SQL ─────────────────────────────────────────────────────────

let pid = 375;
const productInserts = [];
const variantInserts = [];

sections.forEach(section => {
  section.types.forEach(type => {
    section.colors.forEach(color => {
      const productName = `${type.name} - ${color.display}`;
      const desc = `${productName}. 100% Pure Cotton. Premium comfort for rest, relaxation and sleep.`;
      const imageFile = `${section.prefix}-${type.slug}-${color.slug}.png`;
      const imageUrl = `${IMG_BASE}${imageFile}`;

      productInserts.push(
        `(${pid}, '${BRAND}', '${FABRIC}', '${desc.replace(/'/g, "\\'")}', ${section.discount}, '${imageUrl}', '${productName.replace(/'/g, "\\'")}', '${section.price}', ${CID}, '${type.apparel}', '${type.fit}')`
      );

      SIZES.forEach((size, si) => {
        const sku = `LW-${pid}-${size}`;
        const stock = Math.floor(Math.random() * 30) + 20;
        variantInserts.push(`(${pid}, '${color.display.replace(/'/g, "\\'")}', '${size}', '${sku}', ${stock})`);
      });

      pid++;
    });
  });
});

const sql = `
-- Clean old cid=5 data
DELETE FROM product_variant WHERE pid IN (SELECT pid FROM product WHERE cid = ${CID});
DELETE FROM product WHERE cid = ${CID};

-- Insert loungewear products (cid=5, PIDs 375-${pid - 1})
INSERT INTO product (pid, brand, fabric_type, description, discount, image, name, price, cid, apparel_type, fit_type) VALUES
${productInserts.join(',\n')};

-- Insert variants
INSERT INTO product_variant (pid, color, size, sku, stock) VALUES
${variantInserts.join(',\n')};
`;

const sqlPath = path.join(__dirname, 'lounge_products_v2.sql');
fs.writeFileSync(sqlPath, sql);
console.log(`✅ SQL written to ${sqlPath}`);
console.log(`   Products: ${productInserts.length} (PIDs 375–${pid - 1})`);
console.log(`   Variants: ${variantInserts.length}`);

// Execute
try {
  execSync(`mysql -u admin -ppass1234 srfab < "${sqlPath}"`, { stdio: 'inherit' });
  console.log('✅ Database updated successfully!');
} catch (e) {
  console.error('❌ SQL execution failed:', e.message);
}

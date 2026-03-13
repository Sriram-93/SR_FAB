/**
 * generate_lounge_sql.js
 * Generates and executes SQL for MEN'S PURE COTTON LOUNGEWEAR & NIGHTWEAR (cid=5)
 * PIDs 375–444 (70 products)
 */

const { execSync } = require('child_process');

const CID = 5;
const BRAND = 'SR FAB';
const FABRIC = 'Pure Cotton';
const PRICE = '699';
const DISCOUNT = 15;
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// ── Catalog definition ──────────────────────────────────────────────────

const catalog = [
  // 1. COTTON LOUNGE PANTS (5 types × 6 colors = 30 products)
  {
    groupKey: 'lounge-pants',
    types: [
      { name: 'Soft Cotton Lounge Pants',          slug: 'soft-lounge-pants',       apparel: 'Lounge Pants', fit: 'Relaxed Fit' },
      { name: 'Relax Fit Cotton Lounge Pants',     slug: 'relax-lounge-pants',      apparel: 'Lounge Pants', fit: 'Relaxed Fit' },
      { name: 'Elastic Waist Cotton Lounge Pants', slug: 'elastic-lounge-pants',    apparel: 'Lounge Pants', fit: 'Regular Fit' },
      { name: 'Drawstring Cotton Lounge Pants',    slug: 'drawstring-lounge-pants', apparel: 'Lounge Pants', fit: 'Regular Fit' },
      { name: 'Comfort Cotton Home Wear Pants',    slug: 'comfort-homewear-pants',  apparel: 'Home Wear',    fit: 'Relaxed Fit' },
    ],
    colors: ['Grey', 'Navy Blue', 'Black', 'Olive Green', 'Beige', 'Charcoal'],
  },

  // 2. COTTON PYJAMA PANTS (4 types × 5 colors = 20 products)
  {
    groupKey: 'pyjama-pants',
    types: [
      { name: 'Classic Cotton Pyjama Pants',  slug: 'classic-pyjama-pants',  apparel: 'Pyjama Pants', fit: 'Regular Fit' },
      { name: 'Relaxed Cotton Pyjama Pants',  slug: 'relaxed-pyjama-pants',  apparel: 'Pyjama Pants', fit: 'Relaxed Fit' },
      { name: 'Elastic Waist Pyjama Pants',   slug: 'elastic-pyjama-pants',  apparel: 'Pyjama Pants', fit: 'Regular Fit' },
      { name: 'Drawstring Pyjama Pants',      slug: 'drawstring-pyjama-pants', apparel: 'Pyjama Pants', fit: 'Regular Fit' },
    ],
    colors: ['Navy Blue', 'Grey', 'Maroon', 'Black', 'Olive Green'],
  },

  // 3. COTTON NIGHTWEAR SETS (4 types × 5 colors = 20 products)
  {
    groupKey: 'nightwear-sets',
    types: [
      { name: 'Classic Cotton Nightwear Set',  slug: 'classic-nightwear-set',  apparel: 'Nightwear Set', fit: 'Regular Fit' },
      { name: 'Comfort Cotton Sleep Set',      slug: 'comfort-sleep-set',      apparel: 'Nightwear Set', fit: 'Relaxed Fit' },
      { name: 'Striped Cotton Night Suit',     slug: 'striped-night-suit',     apparel: 'Night Suit',    fit: 'Regular Fit' },
      { name: 'Checked Cotton Night Suit',     slug: 'checked-night-suit',     apparel: 'Night Suit',    fit: 'Regular Fit' },
    ],
    colors: ['Navy Blue', 'Grey', 'Maroon', 'Black', 'Olive Green'],
  },
];

// ── Image mapping ────────────────────────────────────────────────────────

const COLOR_IMAGE_MAP = {
  // Lounge pants
  'soft-lounge-pants':       { Grey: 'lounge-pants-grey.png', 'Navy Blue': 'lounge-pants-navy.png', Black: 'lounge-pants-black.png', 'Olive Green': 'lounge-pants-olive.png', Beige: 'lounge-pants-beige.png', Charcoal: 'lounge-pants-charcoal.png' },
  'relax-lounge-pants':      { Grey: 'lounge-pants-grey.png', 'Navy Blue': 'lounge-pants-navy.png', Black: 'lounge-pants-black.png', 'Olive Green': 'lounge-pants-olive.png', Beige: 'lounge-pants-beige.png', Charcoal: 'lounge-pants-charcoal.png' },
  'elastic-lounge-pants':    { Grey: 'lounge-pants-grey.png', 'Navy Blue': 'lounge-pants-navy.png', Black: 'lounge-pants-black.png', 'Olive Green': 'lounge-pants-olive.png', Beige: 'lounge-pants-beige.png', Charcoal: 'lounge-pants-charcoal.png' },
  'drawstring-lounge-pants': { Grey: 'lounge-pants-grey.png', 'Navy Blue': 'lounge-pants-navy.png', Black: 'lounge-pants-black.png', 'Olive Green': 'lounge-pants-olive.png', Beige: 'lounge-pants-beige.png', Charcoal: 'lounge-pants-charcoal.png' },
  'comfort-homewear-pants':  { Grey: 'lounge-pants-grey.png', 'Navy Blue': 'lounge-pants-navy.png', Black: 'lounge-pants-black.png', 'Olive Green': 'lounge-pants-olive.png', Beige: 'lounge-pants-beige.png', Charcoal: 'lounge-pants-charcoal.png' },
  // Pyjama pants
  'classic-pyjama-pants':    { 'Navy Blue': 'pyjama-pants-navy.png', Grey: 'pyjama-pants-grey.png', Maroon: 'pyjama-pants-maroon.png', Black: 'pyjama-pants-black.png', 'Olive Green': 'pyjama-pants-olive.png' },
  'relaxed-pyjama-pants':    { 'Navy Blue': 'pyjama-pants-navy.png', Grey: 'pyjama-pants-grey.png', Maroon: 'pyjama-pants-maroon.png', Black: 'pyjama-pants-black.png', 'Olive Green': 'pyjama-pants-olive.png' },
  'elastic-pyjama-pants':    { 'Navy Blue': 'pyjama-pants-navy.png', Grey: 'pyjama-pants-grey.png', Maroon: 'pyjama-pants-maroon.png', Black: 'pyjama-pants-black.png', 'Olive Green': 'pyjama-pants-olive.png' },
  'drawstring-pyjama-pants': { 'Navy Blue': 'pyjama-pants-navy.png', Grey: 'pyjama-pants-grey.png', Maroon: 'pyjama-pants-maroon.png', Black: 'pyjama-pants-black.png', 'Olive Green': 'pyjama-pants-olive.png' },
  // Nightwear sets
  'classic-nightwear-set':   { 'Navy Blue': 'nightwear-set-navy.png', Grey: 'nightwear-set-grey.png', Maroon: 'nightwear-set-maroon.png', Black: 'nightwear-set-black.png', 'Olive Green': 'nightwear-set-olive.png' },
  'comfort-sleep-set':       { 'Navy Blue': 'nightwear-set-navy.png', Grey: 'nightwear-set-grey.png', Maroon: 'nightwear-set-maroon.png', Black: 'nightwear-set-black.png', 'Olive Green': 'nightwear-set-olive.png' },
  'striped-night-suit':      { 'Navy Blue': 'nightwear-striped-navy.png', Grey: 'nightwear-striped-grey.png', Maroon: 'nightwear-striped-maroon.png', Black: 'nightwear-striped-black.png', 'Olive Green': 'nightwear-striped-olive.png' },
  'checked-night-suit':      { 'Navy Blue': 'nightwear-checked-navy.png', Grey: 'nightwear-checked-grey.png', Maroon: 'nightwear-checked-maroon.png', Black: 'nightwear-checked-black.png', 'Olive Green': 'nightwear-checked-olive.png' },
};

function getImage(slug, color) {
  return (COLOR_IMAGE_MAP[slug] && COLOR_IMAGE_MAP[slug][color]) || 'lounge-pants-grey.png';
}

// ── SQL generation ────────────────────────────────────────────────────────

let pid = 375;
const productInserts = [];
const variantInserts = [];

catalog.forEach(({ types, colors }) => {
  types.forEach(({ name, slug, apparel, fit }) => {
    colors.forEach((color) => {
      const pname = `${color} ${name}`;
      const desc  = `${pname}. 100% Pure Cotton. Premium comfort for rest, relaxation and sleep.`;
      const img   = getImage(slug, color);
      productInserts.push(
        `(${pid}, '${BRAND}', '${FABRIC}', '${desc.replace(/'/g,"\\'")}', ${DISCOUNT}, '${img}', '${pname.replace(/'/g,"\\'")}', '${PRICE}', ${CID}, '${apparel}', '${fit}')`
      );
      SIZES.forEach((size, si) => {
        const sku   = `LW-${slug.toUpperCase().slice(0,8)}-${pid}-${si + 1}`;
        const stock = Math.floor(Math.random() * 30) + 20;
        variantInserts.push(`(${pid}, '${color}', '${size}', '${sku}', ${stock})`);
      });
      pid++;
    });
  });
});

const sql = `
-- Loungewear & Nightwear products (cid=5, PIDs 375-${pid - 1})
INSERT INTO product (pid, brand, fabric_type, description, discount, image, name, price, cid, apparel_type, fit_type) VALUES
${productInserts.join(',\n')};

-- Variants for loungewear products
INSERT INTO product_variant (pid, color, size, sku, stock) VALUES
${variantInserts.join(',\n')};
`;

// Write SQL file
const fs = require('fs');
const path = require('path');
const sqlPath = path.join(__dirname, 'lounge_products.sql');
fs.writeFileSync(sqlPath, sql);
console.log(`✅ SQL written to ${sqlPath}`);
console.log(`   Products: ${productInserts.length} (PIDs 375–${pid - 1})`);
console.log(`   Variants: ${variantInserts.length}`);

// Execute SQL
try {
  execSync(`mysql -u admin -ppass1234 srfab < "${sqlPath}"`, { stdio: 'inherit' });
  console.log('✅ SQL executed successfully!');
} catch (e) {
  console.error('❌ SQL execution failed:', e.message);
}

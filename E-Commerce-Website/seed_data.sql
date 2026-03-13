-- ============================================
-- SR FAB  – Seed Data for Fashion Store
-- ============================================
-- Run: mysql -u admin -p srfab < seed_data.sql
-- ============================================

USE `srfab`;

-- ── Categories ─────────────────────────────
INSERT INTO category (cid, name, image) VALUES
  (1, "Men's Wear",   'mens_wear.jpg'),
  (2, "Women's Wear", 'womens_wear.jpg'),
  (3, 'Ethnic Wear',  'ethnic_wear.jpg'),
  (4, "Kids' Wear",   'kids_wear.jpg'),
  (5, 'Footwear',     'footwear.jpg'),
  (6, 'Accessories',  'accessories.jpg')
ON DUPLICATE KEY UPDATE name=VALUES(name), image=VALUES(image);

-- ── Products ───────────────────────────────
-- Men's Wear (cid=1)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES
  (1,  'Classic Cotton Shirt',       'Premium 100% cotton formal shirt for everyday elegance.', '1499', 20, 'cotton_shirt.jpg',   1, 'SR FAB',      'Cotton'),
  (2,  'Slim Fit Chinos',            'Comfortable stretch chinos that go from desk to dinner.',  '1999', 15, 'slim_chinos.jpg',    1, 'SR FAB',      'Cotton Blend'),
  (3,  'Denim Jacket',               'Rugged indigo denim jacket with brass-toned buttons.',     '2999', 10, 'denim_jacket.jpg',   1, 'SR FAB',      'Denim'),

-- Women's Wear (cid=2)
  (4,  'Floral Maxi Dress',          'Flowy A-line maxi with block-print florals.',              '2499', 25, 'maxi_dress.jpg',     2, 'SR FAB',      'Rayon'),
  (5,  'High-Waist Palazzo Pants',   'Wide-leg palazzos in breathable cotton.',                  '1299', 10, 'palazzo_pants.jpg',  2, 'SR FAB',      'Cotton'),

-- Ethnic Wear (cid=3)
  (6,  'Silk Saree – Royal Blue',    'Pure Banarasi silk saree with gold zari border.',           '5999', 30, 'silk_saree.jpg',     3, 'SR FAB',      'Silk'),
  (7,  'Embroidered Kurta Set',      'Chikankari hand-embroidered kurta with matching pyjama.',   '3499', 20, 'kurta_set.jpg',      3, 'SR FAB',      'Cotton'),

-- Kids' Wear (cid=4)
  (8,  'Kids Cartoon T-Shirt',       'Soft organic cotton tee with fun cartoon prints.',          '599',  15, 'kids_tshirt.jpg',    4, 'SR FAB Kids', 'Organic Cotton'),

-- Footwear (cid=5)
  (9,  'Leather Formal Shoes',       'Handcrafted genuine leather oxford shoes.',                 '3999', 10, 'formal_shoes.jpg',   5, 'SR FAB',      'Leather'),

-- Accessories (cid=6)
  (10, 'Handwoven Silk Stole',       'Lightweight silk stole with digital print.',                '899',  20, 'silk_stole.jpg',     6, 'SR FAB',      'Silk')

ON DUPLICATE KEY UPDATE
  name=VALUES(name), description=VALUES(description), price=VALUES(price),
  discount=VALUES(discount), image=VALUES(image), cid=VALUES(cid),
  brand=VALUES(brand), fabric_type=VALUES(fabric_type);

-- ── Product Variants (size × color × stock) ──
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES
  -- Classic Cotton Shirt (pid=1)
  (1, 'S',  'White',   12, 'CCS-WHT-S'),
  (1, 'M',  'White',   20, 'CCS-WHT-M'),
  (1, 'L',  'White',   15, 'CCS-WHT-L'),
  (1, 'XL', 'White',    8, 'CCS-WHT-XL'),
  (1, 'M',  'Sky Blue',10, 'CCS-BLU-M'),
  (1, 'L',  'Sky Blue', 7, 'CCS-BLU-L'),

  -- Slim Fit Chinos (pid=2)
  (2, '30', 'Beige',   14, 'SFC-BEG-30'),
  (2, '32', 'Beige',   18, 'SFC-BEG-32'),
  (2, '34', 'Beige',   10, 'SFC-BEG-34'),
  (2, '32', 'Navy',    12, 'SFC-NAV-32'),
  (2, '34', 'Navy',     9, 'SFC-NAV-34'),

  -- Denim Jacket (pid=3)
  (3, 'M',  'Indigo',  10, 'DJ-IND-M'),
  (3, 'L',  'Indigo',   8, 'DJ-IND-L'),
  (3, 'XL', 'Indigo',   5, 'DJ-IND-XL'),

  -- Floral Maxi Dress (pid=4)
  (4, 'S',  'Coral',   10, 'FMD-CRL-S'),
  (4, 'M',  'Coral',   15, 'FMD-CRL-M'),
  (4, 'L',  'Coral',    8, 'FMD-CRL-L'),
  (4, 'M',  'Teal',    12, 'FMD-TEL-M'),

  -- Palazzo Pants (pid=5)
  (5, 'S',  'Black',   20, 'PP-BLK-S'),
  (5, 'M',  'Black',   25, 'PP-BLK-M'),
  (5, 'L',  'Black',   15, 'PP-BLK-L'),
  (5, 'M',  'Off-White',10, 'PP-OWH-M'),

  -- Silk Saree (pid=6)
  (6, 'Free Size', 'Royal Blue', 8, 'SS-RBL-FS'),
  (6, 'Free Size', 'Maroon',     6, 'SS-MRN-FS'),

  -- Kurta Set (pid=7)
  (7, 'S',  'White',   10, 'KS-WHT-S'),
  (7, 'M',  'White',   15, 'KS-WHT-M'),
  (7, 'L',  'White',   12, 'KS-WHT-L'),
  (7, 'XL', 'White',    8, 'KS-WHT-XL'),
  (7, 'M',  'Mint Green', 7, 'KS-MNT-M'),

  -- Kids T-Shirt (pid=8)
  (8, '2-3Y', 'Yellow',  20, 'KT-YLW-23'),
  (8, '4-5Y', 'Yellow',  18, 'KT-YLW-45'),
  (8, '6-7Y', 'Yellow',  12, 'KT-YLW-67'),
  (8, '4-5Y', 'Blue',    15, 'KT-BLU-45'),

  -- Formal Shoes (pid=9)
  (9, '7',  'Brown',   10, 'FS-BRN-7'),
  (9, '8',  'Brown',   12, 'FS-BRN-8'),
  (9, '9',  'Brown',    8, 'FS-BRN-9'),
  (9, '10', 'Brown',    5, 'FS-BRN-10'),
  (9, '8',  'Black',   10, 'FS-BLK-8'),
  (9, '9',  'Black',    7, 'FS-BLK-9'),

  -- Silk Stole (pid=10)
  (10, 'Free Size', 'Blush Pink',   15, 'HSS-PNK-FS'),
  (10, 'Free Size', 'Midnight Blue', 10, 'HSS-BLU-FS');

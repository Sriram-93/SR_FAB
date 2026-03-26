USE defaultdb;

DELETE FROM product_variant WHERE pid >= 16 AND pid <= 67;
DELETE FROM product WHERE pid >= 16 AND pid <= 67;

-- Product 16: White Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (16, 'White Round Neck', 'Premium 100% pure cotton white round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (16, 'S', 'White', 50, 'RN-WHI-S-16');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (16, 'M', 'White', 50, 'RN-WHI-M-16');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (16, 'L', 'White', 50, 'RN-WHI-L-16');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (16, 'XL', 'White', 50, 'RN-WHI-XL-16');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (16, 'XXL', 'White', 50, 'RN-WHI-XXL-16');

-- Product 17: Black Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (17, 'Black Round Neck', 'Premium 100% pure cotton black round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (17, 'S', 'Black', 50, 'RN-BLA-S-17');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (17, 'M', 'Black', 50, 'RN-BLA-M-17');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (17, 'L', 'Black', 50, 'RN-BLA-L-17');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (17, 'XL', 'Black', 50, 'RN-BLA-XL-17');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (17, 'XXL', 'Black', 50, 'RN-BLA-XXL-17');

-- Product 18: Navy Blue Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (18, 'Navy Blue Round Neck', 'Premium 100% pure cotton navy blue round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-navy-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (18, 'S', 'Navy Blue', 50, 'RN-NAV-S-18');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (18, 'M', 'Navy Blue', 50, 'RN-NAV-M-18');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (18, 'L', 'Navy Blue', 50, 'RN-NAV-L-18');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (18, 'XL', 'Navy Blue', 50, 'RN-NAV-XL-18');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (18, 'XXL', 'Navy Blue', 50, 'RN-NAV-XXL-18');

-- Product 19: Sky Blue Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (19, 'Sky Blue Round Neck', 'Premium 100% pure cotton sky blue round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-sky-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (19, 'S', 'Sky Blue', 50, 'RN-SKY-S-19');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (19, 'M', 'Sky Blue', 50, 'RN-SKY-M-19');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (19, 'L', 'Sky Blue', 50, 'RN-SKY-L-19');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (19, 'XL', 'Sky Blue', 50, 'RN-SKY-XL-19');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (19, 'XXL', 'Sky Blue', 50, 'RN-SKY-XXL-19');

-- Product 20: Olive Green Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (20, 'Olive Green Round Neck', 'Premium 100% pure cotton olive green round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (20, 'S', 'Olive Green', 50, 'RN-OLI-S-20');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (20, 'M', 'Olive Green', 50, 'RN-OLI-M-20');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (20, 'L', 'Olive Green', 50, 'RN-OLI-L-20');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (20, 'XL', 'Olive Green', 50, 'RN-OLI-XL-20');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (20, 'XXL', 'Olive Green', 50, 'RN-OLI-XXL-20');

-- Product 21: Maroon Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (21, 'Maroon Round Neck', 'Premium 100% pure cotton maroon round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-maroon.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (21, 'S', 'Maroon', 50, 'RN-MAR-S-21');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (21, 'M', 'Maroon', 50, 'RN-MAR-M-21');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (21, 'L', 'Maroon', 50, 'RN-MAR-L-21');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (21, 'XL', 'Maroon', 50, 'RN-MAR-XL-21');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (21, 'XXL', 'Maroon', 50, 'RN-MAR-XXL-21');

-- Product 22: Mustard Yellow Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (22, 'Mustard Yellow Round Neck', 'Premium 100% pure cotton mustard yellow round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-mustard-yellow.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (22, 'S', 'Mustard Yellow', 50, 'RN-MUS-S-22');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (22, 'M', 'Mustard Yellow', 50, 'RN-MUS-M-22');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (22, 'L', 'Mustard Yellow', 50, 'RN-MUS-L-22');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (22, 'XL', 'Mustard Yellow', 50, 'RN-MUS-XL-22');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (22, 'XXL', 'Mustard Yellow', 50, 'RN-MUS-XXL-22');

-- Product 23: Grey Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (23, 'Grey Round Neck', 'Premium 100% pure cotton grey round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-grey.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (23, 'S', 'Grey', 50, 'RN-GRE-S-23');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (23, 'M', 'Grey', 50, 'RN-GRE-M-23');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (23, 'L', 'Grey', 50, 'RN-GRE-L-23');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (23, 'XL', 'Grey', 50, 'RN-GRE-XL-23');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (23, 'XXL', 'Grey', 50, 'RN-GRE-XXL-23');

-- Product 24: Charcoal Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (24, 'Charcoal Round Neck', 'Premium 100% pure cotton charcoal round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-charcoal.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (24, 'S', 'Charcoal', 50, 'RN-CHA-S-24');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (24, 'M', 'Charcoal', 50, 'RN-CHA-M-24');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (24, 'L', 'Charcoal', 50, 'RN-CHA-L-24');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (24, 'XL', 'Charcoal', 50, 'RN-CHA-XL-24');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (24, 'XXL', 'Charcoal', 50, 'RN-CHA-XXL-24');

-- Product 25: Beige Round Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (25, 'Beige Round Neck', 'Premium 100% pure cotton beige round neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/round-neck-beige.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (25, 'S', 'Beige', 50, 'RN-BEI-S-25');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (25, 'M', 'Beige', 50, 'RN-BEI-M-25');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (25, 'L', 'Beige', 50, 'RN-BEI-L-25');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (25, 'XL', 'Beige', 50, 'RN-BEI-XL-25');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (25, 'XXL', 'Beige', 50, 'RN-BEI-XXL-25');

-- Product 26: White V Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (26, 'White V Neck', 'Premium 100% pure cotton white v neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/v-neck-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (26, 'S', 'White', 50, 'VN-WHI-S-26');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (26, 'M', 'White', 50, 'VN-WHI-M-26');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (26, 'L', 'White', 50, 'VN-WHI-L-26');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (26, 'XL', 'White', 50, 'VN-WHI-XL-26');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (26, 'XXL', 'White', 50, 'VN-WHI-XXL-26');

-- Product 27: Black V Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (27, 'Black V Neck', 'Premium 100% pure cotton black v neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/v-neck-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (27, 'S', 'Black', 50, 'VN-BLA-S-27');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (27, 'M', 'Black', 50, 'VN-BLA-M-27');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (27, 'L', 'Black', 50, 'VN-BLA-L-27');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (27, 'XL', 'Black', 50, 'VN-BLA-XL-27');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (27, 'XXL', 'Black', 50, 'VN-BLA-XXL-27');

-- Product 28: Navy Blue V Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (28, 'Navy Blue V Neck', 'Premium 100% pure cotton navy blue v neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/v-neck-navy-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (28, 'S', 'Navy Blue', 50, 'VN-NAV-S-28');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (28, 'M', 'Navy Blue', 50, 'VN-NAV-M-28');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (28, 'L', 'Navy Blue', 50, 'VN-NAV-L-28');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (28, 'XL', 'Navy Blue', 50, 'VN-NAV-XL-28');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (28, 'XXL', 'Navy Blue', 50, 'VN-NAV-XXL-28');

-- Product 29: Grey V Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (29, 'Grey V Neck', 'Premium 100% pure cotton grey v neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/v-neck-grey.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (29, 'S', 'Grey', 50, 'VN-GRE-S-29');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (29, 'M', 'Grey', 50, 'VN-GRE-M-29');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (29, 'L', 'Grey', 50, 'VN-GRE-L-29');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (29, 'XL', 'Grey', 50, 'VN-GRE-XL-29');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (29, 'XXL', 'Grey', 50, 'VN-GRE-XXL-29');

-- Product 30: Olive Green V Neck
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (30, 'Olive Green V Neck', 'Premium 100% pure cotton olive green v neck for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/v-neck-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (30, 'S', 'Olive Green', 50, 'VN-OLI-S-30');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (30, 'M', 'Olive Green', 50, 'VN-OLI-M-30');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (30, 'L', 'Olive Green', 50, 'VN-OLI-L-30');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (30, 'XL', 'Olive Green', 50, 'VN-OLI-XL-30');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (30, 'XXL', 'Olive Green', 50, 'VN-OLI-XXL-30');

-- Product 31: White Polo Classic
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (31, 'White Polo Classic', 'Premium 100% pure cotton white polo classic for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-classic-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (31, 'S', 'White', 50, 'PC-WHI-S-31');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (31, 'M', 'White', 50, 'PC-WHI-M-31');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (31, 'L', 'White', 50, 'PC-WHI-L-31');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (31, 'XL', 'White', 50, 'PC-WHI-XL-31');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (31, 'XXL', 'White', 50, 'PC-WHI-XXL-31');

-- Product 32: Navy Blue Polo Classic
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (32, 'Navy Blue Polo Classic', 'Premium 100% pure cotton navy blue polo classic for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-classic-navy-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (32, 'S', 'Navy Blue', 50, 'PC-NAV-S-32');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (32, 'M', 'Navy Blue', 50, 'PC-NAV-M-32');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (32, 'L', 'Navy Blue', 50, 'PC-NAV-L-32');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (32, 'XL', 'Navy Blue', 50, 'PC-NAV-XL-32');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (32, 'XXL', 'Navy Blue', 50, 'PC-NAV-XXL-32');

-- Product 33: Black Polo Classic
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (33, 'Black Polo Classic', 'Premium 100% pure cotton black polo classic for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-classic-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (33, 'S', 'Black', 50, 'PC-BLA-S-33');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (33, 'M', 'Black', 50, 'PC-BLA-M-33');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (33, 'L', 'Black', 50, 'PC-BLA-L-33');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (33, 'XL', 'Black', 50, 'PC-BLA-XL-33');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (33, 'XXL', 'Black', 50, 'PC-BLA-XXL-33');

-- Product 34: Burgundy Polo Classic
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (34, 'Burgundy Polo Classic', 'Premium 100% pure cotton burgundy polo classic for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-classic-burgundy.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (34, 'S', 'Burgundy', 50, 'PC-BUR-S-34');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (34, 'M', 'Burgundy', 50, 'PC-BUR-M-34');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (34, 'L', 'Burgundy', 50, 'PC-BUR-L-34');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (34, 'XL', 'Burgundy', 50, 'PC-BUR-XL-34');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (34, 'XXL', 'Burgundy', 50, 'PC-BUR-XXL-34');

-- Product 35: Olive Green Polo Classic
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (35, 'Olive Green Polo Classic', 'Premium 100% pure cotton olive green polo classic for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-classic-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (35, 'S', 'Olive Green', 50, 'PC-OLI-S-35');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (35, 'M', 'Olive Green', 50, 'PC-OLI-M-35');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (35, 'L', 'Olive Green', 50, 'PC-OLI-L-35');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (35, 'XL', 'Olive Green', 50, 'PC-OLI-XL-35');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (35, 'XXL', 'Olive Green', 50, 'PC-OLI-XXL-35');

-- Product 36: Sky Blue Polo Classic
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (36, 'Sky Blue Polo Classic', 'Premium 100% pure cotton sky blue polo classic for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-classic-sky-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (36, 'S', 'Sky Blue', 50, 'PC-SKY-S-36');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (36, 'M', 'Sky Blue', 50, 'PC-SKY-M-36');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (36, 'L', 'Sky Blue', 50, 'PC-SKY-L-36');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (36, 'XL', 'Sky Blue', 50, 'PC-SKY-XL-36');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (36, 'XXL', 'Sky Blue', 50, 'PC-SKY-XXL-36');

-- Product 37: White Polo Slim Fit
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (37, 'White Polo Slim Fit', 'Premium 100% pure cotton white polo slim fit for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-slim-fit-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (37, 'S', 'White', 50, 'PSF-WHI-S-37');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (37, 'M', 'White', 50, 'PSF-WHI-M-37');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (37, 'L', 'White', 50, 'PSF-WHI-L-37');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (37, 'XL', 'White', 50, 'PSF-WHI-XL-37');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (37, 'XXL', 'White', 50, 'PSF-WHI-XXL-37');

-- Product 38: Navy Blue Polo Slim Fit
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (38, 'Navy Blue Polo Slim Fit', 'Premium 100% pure cotton navy blue polo slim fit for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-slim-fit-navy-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (38, 'S', 'Navy Blue', 50, 'PSF-NAV-S-38');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (38, 'M', 'Navy Blue', 50, 'PSF-NAV-M-38');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (38, 'L', 'Navy Blue', 50, 'PSF-NAV-L-38');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (38, 'XL', 'Navy Blue', 50, 'PSF-NAV-XL-38');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (38, 'XXL', 'Navy Blue', 50, 'PSF-NAV-XXL-38');

-- Product 39: Black Polo Slim Fit
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (39, 'Black Polo Slim Fit', 'Premium 100% pure cotton black polo slim fit for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-slim-fit-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (39, 'S', 'Black', 50, 'PSF-BLA-S-39');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (39, 'M', 'Black', 50, 'PSF-BLA-M-39');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (39, 'L', 'Black', 50, 'PSF-BLA-L-39');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (39, 'XL', 'Black', 50, 'PSF-BLA-XL-39');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (39, 'XXL', 'Black', 50, 'PSF-BLA-XXL-39');

-- Product 40: Burgundy Polo Slim Fit
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (40, 'Burgundy Polo Slim Fit', 'Premium 100% pure cotton burgundy polo slim fit for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-slim-fit-burgundy.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (40, 'S', 'Burgundy', 50, 'PSF-BUR-S-40');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (40, 'M', 'Burgundy', 50, 'PSF-BUR-M-40');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (40, 'L', 'Burgundy', 50, 'PSF-BUR-L-40');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (40, 'XL', 'Burgundy', 50, 'PSF-BUR-XL-40');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (40, 'XXL', 'Burgundy', 50, 'PSF-BUR-XXL-40');

-- Product 41: Olive Green Polo Slim Fit
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (41, 'Olive Green Polo Slim Fit', 'Premium 100% pure cotton olive green polo slim fit for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-slim-fit-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (41, 'S', 'Olive Green', 50, 'PSF-OLI-S-41');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (41, 'M', 'Olive Green', 50, 'PSF-OLI-M-41');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (41, 'L', 'Olive Green', 50, 'PSF-OLI-L-41');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (41, 'XL', 'Olive Green', 50, 'PSF-OLI-XL-41');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (41, 'XXL', 'Olive Green', 50, 'PSF-OLI-XXL-41');

-- Product 42: Sky Blue Polo Slim Fit
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (42, 'Sky Blue Polo Slim Fit', 'Premium 100% pure cotton sky blue polo slim fit for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-slim-fit-sky-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (42, 'S', 'Sky Blue', 50, 'PSF-SKY-S-42');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (42, 'M', 'Sky Blue', 50, 'PSF-SKY-M-42');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (42, 'L', 'Sky Blue', 50, 'PSF-SKY-L-42');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (42, 'XL', 'Sky Blue', 50, 'PSF-SKY-XL-42');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (42, 'XXL', 'Sky Blue', 50, 'PSF-SKY-XXL-42');

-- Product 43: White Polo Contrast Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (43, 'White Polo Contrast Collar', 'Premium 100% pure cotton white polo contrast collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-contrast-collar-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (43, 'S', 'White', 50, 'PCC-WHI-S-43');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (43, 'M', 'White', 50, 'PCC-WHI-M-43');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (43, 'L', 'White', 50, 'PCC-WHI-L-43');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (43, 'XL', 'White', 50, 'PCC-WHI-XL-43');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (43, 'XXL', 'White', 50, 'PCC-WHI-XXL-43');

-- Product 44: Navy Blue Polo Contrast Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (44, 'Navy Blue Polo Contrast Collar', 'Premium 100% pure cotton navy blue polo contrast collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-contrast-collar-navy-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (44, 'S', 'Navy Blue', 50, 'PCC-NAV-S-44');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (44, 'M', 'Navy Blue', 50, 'PCC-NAV-M-44');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (44, 'L', 'Navy Blue', 50, 'PCC-NAV-L-44');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (44, 'XL', 'Navy Blue', 50, 'PCC-NAV-XL-44');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (44, 'XXL', 'Navy Blue', 50, 'PCC-NAV-XXL-44');

-- Product 45: Black Polo Contrast Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (45, 'Black Polo Contrast Collar', 'Premium 100% pure cotton black polo contrast collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-contrast-collar-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (45, 'S', 'Black', 50, 'PCC-BLA-S-45');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (45, 'M', 'Black', 50, 'PCC-BLA-M-45');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (45, 'L', 'Black', 50, 'PCC-BLA-L-45');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (45, 'XL', 'Black', 50, 'PCC-BLA-XL-45');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (45, 'XXL', 'Black', 50, 'PCC-BLA-XXL-45');

-- Product 46: Burgundy Polo Contrast Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (46, 'Burgundy Polo Contrast Collar', 'Premium 100% pure cotton burgundy polo contrast collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-contrast-collar-burgundy.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (46, 'S', 'Burgundy', 50, 'PCC-BUR-S-46');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (46, 'M', 'Burgundy', 50, 'PCC-BUR-M-46');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (46, 'L', 'Burgundy', 50, 'PCC-BUR-L-46');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (46, 'XL', 'Burgundy', 50, 'PCC-BUR-XL-46');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (46, 'XXL', 'Burgundy', 50, 'PCC-BUR-XXL-46');

-- Product 47: Olive Green Polo Contrast Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (47, 'Olive Green Polo Contrast Collar', 'Premium 100% pure cotton olive green polo contrast collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-contrast-collar-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (47, 'S', 'Olive Green', 50, 'PCC-OLI-S-47');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (47, 'M', 'Olive Green', 50, 'PCC-OLI-M-47');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (47, 'L', 'Olive Green', 50, 'PCC-OLI-L-47');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (47, 'XL', 'Olive Green', 50, 'PCC-OLI-XL-47');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (47, 'XXL', 'Olive Green', 50, 'PCC-OLI-XXL-47');

-- Product 48: Sky Blue Polo Contrast Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (48, 'Sky Blue Polo Contrast Collar', 'Premium 100% pure cotton sky blue polo contrast collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-contrast-collar-sky-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (48, 'S', 'Sky Blue', 50, 'PCC-SKY-S-48');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (48, 'M', 'Sky Blue', 50, 'PCC-SKY-M-48');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (48, 'L', 'Sky Blue', 50, 'PCC-SKY-L-48');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (48, 'XL', 'Sky Blue', 50, 'PCC-SKY-XL-48');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (48, 'XXL', 'Sky Blue', 50, 'PCC-SKY-XXL-48');

-- Product 49: White Polo Tipped Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (49, 'White Polo Tipped Collar', 'Premium 100% pure cotton white polo tipped collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-tipped-collar-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (49, 'S', 'White', 50, 'PTC-WHI-S-49');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (49, 'M', 'White', 50, 'PTC-WHI-M-49');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (49, 'L', 'White', 50, 'PTC-WHI-L-49');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (49, 'XL', 'White', 50, 'PTC-WHI-XL-49');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (49, 'XXL', 'White', 50, 'PTC-WHI-XXL-49');

-- Product 50: Navy Blue Polo Tipped Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (50, 'Navy Blue Polo Tipped Collar', 'Premium 100% pure cotton navy blue polo tipped collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-tipped-collar-navy-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (50, 'S', 'Navy Blue', 50, 'PTC-NAV-S-50');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (50, 'M', 'Navy Blue', 50, 'PTC-NAV-M-50');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (50, 'L', 'Navy Blue', 50, 'PTC-NAV-L-50');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (50, 'XL', 'Navy Blue', 50, 'PTC-NAV-XL-50');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (50, 'XXL', 'Navy Blue', 50, 'PTC-NAV-XXL-50');

-- Product 51: Black Polo Tipped Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (51, 'Black Polo Tipped Collar', 'Premium 100% pure cotton black polo tipped collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-tipped-collar-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (51, 'S', 'Black', 50, 'PTC-BLA-S-51');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (51, 'M', 'Black', 50, 'PTC-BLA-M-51');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (51, 'L', 'Black', 50, 'PTC-BLA-L-51');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (51, 'XL', 'Black', 50, 'PTC-BLA-XL-51');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (51, 'XXL', 'Black', 50, 'PTC-BLA-XXL-51');

-- Product 52: Burgundy Polo Tipped Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (52, 'Burgundy Polo Tipped Collar', 'Premium 100% pure cotton burgundy polo tipped collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-tipped-collar-burgundy.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (52, 'S', 'Burgundy', 50, 'PTC-BUR-S-52');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (52, 'M', 'Burgundy', 50, 'PTC-BUR-M-52');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (52, 'L', 'Burgundy', 50, 'PTC-BUR-L-52');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (52, 'XL', 'Burgundy', 50, 'PTC-BUR-XL-52');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (52, 'XXL', 'Burgundy', 50, 'PTC-BUR-XXL-52');

-- Product 53: Olive Green Polo Tipped Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (53, 'Olive Green Polo Tipped Collar', 'Premium 100% pure cotton olive green polo tipped collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-tipped-collar-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (53, 'S', 'Olive Green', 50, 'PTC-OLI-S-53');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (53, 'M', 'Olive Green', 50, 'PTC-OLI-M-53');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (53, 'L', 'Olive Green', 50, 'PTC-OLI-L-53');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (53, 'XL', 'Olive Green', 50, 'PTC-OLI-XL-53');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (53, 'XXL', 'Olive Green', 50, 'PTC-OLI-XXL-53');

-- Product 54: Sky Blue Polo Tipped Collar
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (54, 'Sky Blue Polo Tipped Collar', 'Premium 100% pure cotton sky blue polo tipped collar for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 999, 10, '/images/products/catalog/polo-tipped-collar-sky-blue.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (54, 'S', 'Sky Blue', 50, 'PTC-SKY-S-54');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (54, 'M', 'Sky Blue', 50, 'PTC-SKY-M-54');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (54, 'L', 'Sky Blue', 50, 'PTC-SKY-L-54');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (54, 'XL', 'Sky Blue', 50, 'PTC-SKY-XL-54');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (54, 'XXL', 'Sky Blue', 50, 'PTC-SKY-XXL-54');

-- Product 55: Black Oversized
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (55, 'Black Oversized', 'Premium 100% pure cotton black oversized for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 899, 10, '/images/products/catalog/oversized-black.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (55, 'S', 'Black', 50, 'O-BLA-S-55');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (55, 'M', 'Black', 50, 'O-BLA-M-55');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (55, 'L', 'Black', 50, 'O-BLA-L-55');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (55, 'XL', 'Black', 50, 'O-BLA-XL-55');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (55, 'XXL', 'Black', 50, 'O-BLA-XXL-55');

-- Product 56: Grey Oversized
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (56, 'Grey Oversized', 'Premium 100% pure cotton grey oversized for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 899, 10, '/images/products/catalog/oversized-grey.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (56, 'S', 'Grey', 50, 'O-GRE-S-56');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (56, 'M', 'Grey', 50, 'O-GRE-M-56');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (56, 'L', 'Grey', 50, 'O-GRE-L-56');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (56, 'XL', 'Grey', 50, 'O-GRE-XL-56');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (56, 'XXL', 'Grey', 50, 'O-GRE-XXL-56');

-- Product 57: Beige Oversized
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (57, 'Beige Oversized', 'Premium 100% pure cotton beige oversized for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 899, 10, '/images/products/catalog/oversized-beige.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (57, 'S', 'Beige', 50, 'O-BEI-S-57');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (57, 'M', 'Beige', 50, 'O-BEI-M-57');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (57, 'L', 'Beige', 50, 'O-BEI-L-57');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (57, 'XL', 'Beige', 50, 'O-BEI-XL-57');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (57, 'XXL', 'Beige', 50, 'O-BEI-XXL-57');

-- Product 58: White Oversized
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (58, 'White Oversized', 'Premium 100% pure cotton white oversized for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 899, 10, '/images/products/catalog/oversized-white.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (58, 'S', 'White', 50, 'O-WHI-S-58');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (58, 'M', 'White', 50, 'O-WHI-M-58');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (58, 'L', 'White', 50, 'O-WHI-L-58');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (58, 'XL', 'White', 50, 'O-WHI-XL-58');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (58, 'XXL', 'White', 50, 'O-WHI-XXL-58');

-- Product 59: Olive Green Oversized
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (59, 'Olive Green Oversized', 'Premium 100% pure cotton olive green oversized for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 899, 10, '/images/products/catalog/oversized-olive-green.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (59, 'S', 'Olive Green', 50, 'O-OLI-S-59');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (59, 'M', 'Olive Green', 50, 'O-OLI-M-59');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (59, 'L', 'Olive Green', 50, 'O-OLI-L-59');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (59, 'XL', 'Olive Green', 50, 'O-OLI-XL-59');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (59, 'XXL', 'Olive Green', 50, 'O-OLI-XXL-59');

-- Product 60: Typography Print (Minimal text)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (60, 'Typography Print (Minimal text)', 'Premium 100% pure cotton typography print (minimal text) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/typography-print-minimal-text.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (60, 'S', 'White', 50, 'TP-MIN-S-60');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (60, 'M', 'White', 50, 'TP-MIN-M-60');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (60, 'L', 'White', 50, 'TP-MIN-L-60');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (60, 'XL', 'White', 50, 'TP-MIN-XL-60');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (60, 'XXL', 'White', 50, 'TP-MIN-XXL-60');

-- Product 61: Typography Print (Bold typography)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (61, 'Typography Print (Bold typography)', 'Premium 100% pure cotton typography print (bold typography) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/typography-print-bold-typography.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (61, 'S', 'White', 50, 'TP-BOL-S-61');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (61, 'M', 'White', 50, 'TP-BOL-M-61');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (61, 'L', 'White', 50, 'TP-BOL-L-61');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (61, 'XL', 'White', 50, 'TP-BOL-XL-61');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (61, 'XXL', 'White', 50, 'TP-BOL-XXL-61');

-- Product 62: Typography Print (Motivational quote)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (62, 'Typography Print (Motivational quote)', 'Premium 100% pure cotton typography print (motivational quote) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/typography-print-motivational-quote.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (62, 'S', 'White', 50, 'TP-MOT-S-62');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (62, 'M', 'White', 50, 'TP-MOT-M-62');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (62, 'L', 'White', 50, 'TP-MOT-L-62');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (62, 'XL', 'White', 50, 'TP-MOT-XL-62');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (62, 'XXL', 'White', 50, 'TP-MOT-XXL-62');

-- Product 63: Graphic Print (Abstract graphic)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (63, 'Graphic Print (Abstract graphic)', 'Premium 100% pure cotton graphic print (abstract graphic) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/graphic-print-abstract-graphic.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (63, 'S', 'White', 50, 'GP-ABS-S-63');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (63, 'M', 'White', 50, 'GP-ABS-M-63');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (63, 'L', 'White', 50, 'GP-ABS-L-63');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (63, 'XL', 'White', 50, 'GP-ABS-XL-63');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (63, 'XXL', 'White', 50, 'GP-ABS-XXL-63');

-- Product 64: Graphic Print (Retro graphic)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (64, 'Graphic Print (Retro graphic)', 'Premium 100% pure cotton graphic print (retro graphic) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/graphic-print-retro-graphic.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (64, 'S', 'White', 50, 'GP-RET-S-64');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (64, 'M', 'White', 50, 'GP-RET-M-64');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (64, 'L', 'White', 50, 'GP-RET-L-64');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (64, 'XL', 'White', 50, 'GP-RET-XL-64');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (64, 'XXL', 'White', 50, 'GP-RET-XXL-64');

-- Product 65: Graphic Print (Cartoon graphic)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (65, 'Graphic Print (Cartoon graphic)', 'Premium 100% pure cotton graphic print (cartoon graphic) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/graphic-print-cartoon-graphic.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (65, 'S', 'White', 50, 'GP-CAR-S-65');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (65, 'M', 'White', 50, 'GP-CAR-M-65');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (65, 'L', 'White', 50, 'GP-CAR-L-65');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (65, 'XL', 'White', 50, 'GP-CAR-XL-65');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (65, 'XXL', 'White', 50, 'GP-CAR-XXL-65');

-- Product 66: Pattern Print (Geometric pattern)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (66, 'Pattern Print (Geometric pattern)', 'Premium 100% pure cotton pattern print (geometric pattern) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/pattern-print-geometric-pattern.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (66, 'S', 'White', 50, 'PP-GEO-S-66');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (66, 'M', 'White', 50, 'PP-GEO-M-66');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (66, 'L', 'White', 50, 'PP-GEO-L-66');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (66, 'XL', 'White', 50, 'PP-GEO-XL-66');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (66, 'XXL', 'White', 50, 'PP-GEO-XXL-66');

-- Product 67: Pattern Print (All over pattern)
INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (67, 'Pattern Print (All over pattern)', 'Premium 100% pure cotton pattern print (all over pattern) for men. Studio quality craftsmanship, breathable fabric, and perfect fit.', 799, 10, '/images/products/catalog/pattern-print-all-over-pattern.png', 1, 'SR FAB', 'Pure Cotton');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (67, 'S', 'White', 50, 'PP-ALL-S-67');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (67, 'M', 'White', 50, 'PP-ALL-M-67');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (67, 'L', 'White', 50, 'PP-ALL-L-67');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (67, 'XL', 'White', 50, 'PP-ALL-XL-67');
INSERT INTO product_variant (pid, size, color, stock, sku) VALUES (67, 'XXL', 'White', 50, 'PP-ALL-XXL-67');


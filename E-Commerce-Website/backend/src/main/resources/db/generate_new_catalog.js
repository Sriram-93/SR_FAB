/* eslint-disable no-console */
// Generates a full reset-and-rebuild SQL for the Men's cotton catalog.
// Usage:
//   node backend/src/main/resources/db/generate_new_catalog.js > backend/src/main/resources/db/new_catalog.sql

const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const brand = "SR FAB";

const categories = [
  { id: 1, name: "Cotton T-Shirts", image: "cotton_tshirts.jpg" },
  { id: 2, name: "Cotton Shirts", image: "cotton_shirts.jpg" },
  { id: 3, name: "Cotton Pants", image: "cotton_pants.jpg" },
  { id: 4, name: "Cotton Shorts", image: "cotton_shorts.jpg" },
  {
    id: 5,
    name: "Cotton Lounge & Nightwear",
    image: "cotton_lounge_nightwear.jpg",
  },
  { id: 6, name: "Cotton Activewear", image: "cotton_activewear.jpg" },
  { id: 7, name: "Cotton Outerwear", image: "cotton_outerwear.jpg" },
];

const commonPrintColors = ["White", "Black", "Navy", "Olive", "Grey", "Maroon"];
const patternColors = ["White", "Sky Blue", "Navy", "Olive", "Beige"];

const catalog = [
  {
    categoryId: 1,
    group: "TS-BASIC",
    fabric: "Pure Cotton",
    price: "799",
    discount: 10,
    items: [
      "Basic Solid Cotton T-Shirts",
      "Round Neck Cotton T-Shirt",
      "V-Neck Cotton T-Shirt",
      "Crew Neck Cotton T-Shirt",
      "Henley Cotton T-Shirt",
      "Pocket Cotton T-Shirt",
    ],
    colors: [
      "White",
      "Black",
      "Navy Blue",
      "Sky Blue",
      "Olive Green",
      "Bottle Green",
      "Maroon",
      "Mustard Yellow",
      "Grey",
      "Charcoal",
      "Beige",
      "Cream",
    ],
  },
  {
    categoryId: 1,
    group: "TS-POLO",
    fabric: "Pure Cotton",
    price: "999",
    discount: 12,
    items: [
      "Classic Polo Cotton T-Shirt",
      "Slim Fit Polo Cotton T-Shirt",
      "Striped Polo Cotton T-Shirt",
      "Contrast Collar Polo T-Shirt",
      "Tipped Collar Polo T-Shirt",
    ],
    colors: ["White", "Navy", "Black", "Burgundy", "Olive", "Sky Blue"],
  },
  {
    categoryId: 1,
    group: "TS-TYPO",
    fabric: "Pure Cotton",
    price: "899",
    discount: 8,
    items: [
      "Quote Print Cotton T-Shirt",
      "Minimal Text Print T-Shirt",
      "Motivational Quote T-Shirt",
      "Bold Typography T-Shirt",
    ],
    colors: commonPrintColors,
  },
  {
    categoryId: 1,
    group: "TS-GRAPH",
    fabric: "Pure Cotton",
    price: "949",
    discount: 8,
    items: [
      "Cartoon Graphic Cotton T-Shirt",
      "Anime Print Cotton T-Shirt",
      "Retro Graphic Cotton T-Shirt",
      "Vintage Graphic Cotton T-Shirt",
    ],
    colors: commonPrintColors,
  },
  {
    categoryId: 1,
    group: "TS-PATTERN",
    fabric: "Pure Cotton",
    price: "949",
    discount: 10,
    items: [
      "Geometric Print Cotton T-Shirt",
      "Abstract Print Cotton T-Shirt",
      "All Over Print Cotton T-Shirt",
    ],
    colors: patternColors,
  },
  {
    categoryId: 1,
    group: "TS-NATURE",
    fabric: "Pure Cotton",
    price: "949",
    discount: 10,
    items: [
      "Floral Print Cotton T-Shirt",
      "Leaf Print Cotton T-Shirt",
      "Mountain Theme T-Shirt",
      "Ocean Theme T-Shirt",
    ],
    colors: patternColors,
  },
  {
    categoryId: 2,
    group: "SH-FORMAL",
    fabric: "Cotton",
    price: "1499",
    discount: 15,
    items: [
      "Plain White Cotton Formal Shirt",
      "Slim Fit Cotton Formal Shirt",
      "Regular Fit Cotton Shirt",
      "Oxford Cotton Shirt",
      "Spread Collar Cotton Shirt",
    ],
    colors: ["White", "Light Blue", "Pastel Pink", "Cream", "Grey"],
  },
  {
    categoryId: 2,
    group: "SH-CASUAL",
    fabric: "Cotton",
    price: "1399",
    discount: 12,
    items: [
      "Casual Plain Cotton Shirt",
      "Soft Washed Cotton Shirt",
      "Cotton Weekend Shirt",
      "Mandarin Collar Cotton Shirt",
      "Cuban Collar Cotton Shirt",
    ],
    colors: ["Olive", "Navy", "Sky Blue", "Beige", "Brown"],
  },
  {
    categoryId: 2,
    group: "SH-PATTERN",
    fabric: "Cotton",
    price: "1499",
    discount: 10,
    items: [
      "Checked Cotton Shirt",
      "Plaid Cotton Shirt",
      "Vertical Stripe Cotton Shirt",
      "Horizontal Stripe Cotton Shirt",
      "Micro Check Cotton Shirt",
    ],
    colors: patternColors,
  },
  {
    categoryId: 2,
    group: "SH-PRINT",
    fabric: "Cotton",
    price: "1549",
    discount: 10,
    items: [
      "Floral Print Cotton Shirt",
      "Tropical Print Cotton Shirt",
      "Paisley Print Cotton Shirt",
      "Leaf Pattern Cotton Shirt",
      "Abstract Print Cotton Shirt",
    ],
    colors: patternColors,
  },
  {
    categoryId: 3,
    group: "PT-CHINO",
    fabric: "Cotton Twill",
    price: "1799",
    discount: 12,
    items: [
      "Slim Fit Cotton Chinos",
      "Regular Fit Cotton Chinos",
      "Casual Cotton Chinos",
    ],
    colors: ["Khaki", "Beige", "Navy", "Olive", "Black", "Brown"],
  },
  {
    categoryId: 3,
    group: "PT-CASUAL",
    fabric: "Cotton",
    price: "1699",
    discount: 10,
    items: [
      "Straight Fit Cotton Pants",
      "Relaxed Fit Cotton Pants",
      "Elastic Waist Cotton Pants",
    ],
    colors: ["Grey", "Navy", "Cream", "Charcoal", "Dark Brown"],
  },
  {
    categoryId: 3,
    group: "PT-CARGO",
    fabric: "Cotton",
    price: "1999",
    discount: 10,
    items: [
      "Multi Pocket Cargo Pants",
      "Tactical Cargo Pants",
      "Slim Fit Cargo Pants",
    ],
    colors: ["Military Green", "Khaki", "Sand", "Black", "Grey"],
  },
  {
    categoryId: 4,
    group: "SHRT-CASUAL",
    fabric: "Cotton",
    price: "999",
    discount: 10,
    items: [
      "Basic Cotton Shorts",
      "Drawstring Cotton Shorts",
      "Summer Cotton Shorts",
    ],
    colors: ["Navy", "Grey", "Olive", "Beige", "Black"],
  },
  {
    categoryId: 4,
    group: "SHRT-CARGO",
    fabric: "Cotton",
    price: "1149",
    discount: 10,
    items: [
      "Multi Pocket Cotton Shorts",
      "Outdoor Cotton Shorts",
      "Utility Cotton Shorts",
    ],
    colors: ["Navy", "Grey", "Olive", "Beige", "Black"],
  },
  {
    categoryId: 5,
    group: "LNG",
    fabric: "Cotton",
    price: "1099",
    discount: 8,
    items: [
      "Soft Cotton Lounge Pants",
      "Relax Fit Cotton Lounge Pants",
      "Elastic Waist Cotton Lounge Pants",
    ],
    colors: ["Grey", "Navy", "Black", "Striped", "Checked"],
  },
  {
    categoryId: 5,
    group: "NIGHT",
    fabric: "Cotton",
    price: "1199",
    discount: 8,
    items: [
      "Cotton Pyjama Pants",
      "Cotton Night Suit Set",
      "Cotton Sleep Shorts",
      "Cotton Night Shirt",
    ],
    colors: ["Grey", "Navy", "Black", "Striped", "Checked"],
  },
  {
    categoryId: 6,
    group: "ACT",
    fabric: "Cotton",
    price: "1099",
    discount: 10,
    items: [
      "Cotton Gym T-Shirt",
      "Cotton Workout T-Shirt",
      "Cotton Training Shorts",
    ],
    colors: ["Black", "Grey", "Navy", "White"],
  },
  {
    categoryId: 7,
    group: "OUT-JACKET",
    fabric: "Cotton",
    price: "2499",
    discount: 12,
    items: [
      "Cotton Field Jacket",
      "Cotton Utility Jacket",
      "Cotton Casual Jacket",
    ],
    colors: ["Khaki", "Olive", "Navy", "Beige"],
  },
  {
    categoryId: 7,
    group: "OUT-HOOD",
    fabric: "Cotton Fleece",
    price: "1899",
    discount: 12,
    items: ["Cotton Pullover Hoodie", "Cotton Zip Hoodie", "Cotton Sweatshirt"],
    colors: ["Grey", "Black", "Navy", "Olive"],
  },
];

function esc(value) {
  return String(value).replace(/'/g, "''");
}

function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const imagePools = {
  tshirt: [
    "photo-1690366910332-6cb1dc10c000",
    "photo-1629426958003-35a5583b2977",
    "photo-1651761179569-4ba2aa054997",
    "photo-1739047594451-3eb5fb4761b7",
    "photo-1739047593439-4db92342f5d5",
    "photo-1690366910824-ea406d0a61bd",
    "photo-1739047598307-9a6a4bfe5635",
    "photo-1739047595671-b59a810846d4",
    "photo-1688497830977-f9ab9f958ca7",
    "photo-1739047593167-15c05f2abb71",
    "photo-1739047597300-437d7bef0fbe",
    "photo-1739047596684-e723d6f68e7e",
    "photo-1689531916407-d64dedd6126d",
    "photo-1734249026301-e2a05e6a7a68",
    "photo-1739047599736-4e1699c7df56",
    "photo-1739047590650-45bd6464259c",
    "photo-1671656349262-1e1d3e09735c",
    "photo-1734249024828-f89d910cc69c",
    "photo-1734249034108-0cd9d0aa7538",
    "photo-1734249030515-9fdbaa7724aa",
    "photo-1770131091442-e672bd558370",
    "photo-1772490551058-c5de16b885b0",
  ],
  shirt: [
    "photo-1723925110801-110c00d392a3",
    "photo-1768696082783-4313d98341ae",
    "photo-1765175094470-ed3bef04ed40",
    "photo-1765175098379-35eeaf4213db",
    "photo-1760433468572-44d1cf0b8641",
    "photo-1723568617048-8ba7f42e5fec",
    "photo-1765175096109-85677f8b7a5b",
    "photo-1769467304164-deadf943e1eb",
    "photo-1723579340803-5aca8e51cd7c",
    "photo-1758599543147-97eda140ca82",
    "photo-1612766957962-b85888e6b83b",
    "photo-1612766958274-c5f71f8387bb",
    "photo-1771232636387-84d2c67f8c49",
    "photo-1612767809893-d50e8f2bdf62",
    "photo-1612766957916-27a4aa20318f",
    "photo-1612767809387-da2175a1796e",
    "photo-1771232636544-4280b93afe8f",
    "photo-1612767808750-76a6d41e9f86",
    "photo-1612766958570-dc22697d2b8e",
    "photo-1612767809956-6393093d198c",
    "photo-1769708526368-3ec7721e5060",
    "photo-1770155515377-fd16ad76e850",
  ],
  pants: [
    "photo-1695844419276-f8e42c19a1ca",
    "photo-1764816657611-8b1bd2d72cce",
    "photo-1584865288642-42078afe6942",
    "photo-1764816656370-a412c5393aba",
    "photo-1768696081520-76c372aa0d00",
    "photo-1761415382176-9b6ea9488bbc",
    "photo-1729719762110-6ad6e60f4dbd",
    "photo-1768696081901-5be7058d67da",
    "photo-1770411638047-8e47a181d352",
    "photo-1768696081547-f577a38c4eb1",
    "photo-1763901682521-07a3e3f2b7f6",
    "photo-1601979115793-d1e73fe11ff6",
    "photo-1768696082477-935267948a2d",
    "photo-1771924369256-fdd856822db3",
    "photo-1661352754488-4776516fcf31",
    "photo-1763994683145-b8b60797f27d",
    "photo-1608979223338-bb4c889fbd52",
    "photo-1696889450800-e94ec7a32206",
    "photo-1710575478415-366d38849f40",
    "photo-1683318597459-c9ccfd104dee",
    "photo-1762100579793-6bccc9364ee9",
    "photo-1772490551058-c5de16b885b0",
  ],
  shorts: [
    "photo-1727942418332-d71398a73db8",
    "photo-1617953644310-e690da9be982",
    "photo-1617952236317-0bd127407984",
    "photo-1617951907145-53f6eb87a3a3",
    "photo-1617952110637-04a905232888",
    "photo-1727942413448-2f06f240e743",
    "photo-1617951639883-6a10179adb1e",
    "photo-1617952501859-5478bb89654d",
    "photo-1727942411215-0ae49af0687e",
    "photo-1617953556171-ac63ba470a02",
    "photo-1617953734671-9f9d2971454a",
    "photo-1617952385804-1da4f8d71ba9",
    "photo-1727942411290-3f21bd734b3b",
    "photo-1617953350574-d8f032ff3b29",
    "photo-1771710974003-36707a93f37a",
    "photo-1638260753219-bc2ac08ecfc0",
    "photo-1705170973182-7d7cbc40362d",
    "photo-1639337866122-5a4a0afec743",
    "photo-1573594658325-6ff9adf219de",
    "photo-1536685409149-2ca88666aa47",
    "photo-1772490551058-c5de16b885b0",
    "photo-1683318597459-c9ccfd104dee",
    "photo-1762100579793-6bccc9364ee9",
    "photo-1769816703629-6487cc28777e",
    "photo-1769745836625-4cac1ba455a4",
  ],
  lounge: [
    "photo-1702742530633-24509cbfe2cf",
    "photo-1629244032690-1c243449f90a",
    "photo-1735097437946-2dba2d3c3137",
    "photo-1676225680209-19a398a9b38a",
    "photo-1717529136686-0bee0abd9ad9",
    "photo-1770131091442-e672bd558370",
    "photo-1769816703629-6487cc28777e",
  ],
  active: [
    "photo-1663036263525-3059e0c47b96",
    "photo-1612073584622-335da5fadd8a",
    "photo-1584952811178-17383f34d7f4",
    "photo-1637689071204-29c76f78eb05",
    "photo-1680759170077-e9e2d838a34c",
    "photo-1663036286191-9f541be053d8",
    "photo-1734668487893-d686f3c8d0cf",
    "photo-1694712301281-9c3a31363233",
    "photo-1663036261209-e802b09b34bf",
    "photo-1573497622711-5bd615bc70ae",
    "photo-1710253705023-c5c6445c9fad",
    "photo-1694712247863-046c39e04d28",
    "photo-1661581807227-f528470d6b99",
    "photo-1613845205719-8c87760ab728",
    "photo-1585892478446-503a54cd3aea",
    "photo-1667900334692-0bf6afe68cbf",
    "photo-1664300930116-b1fd2621d4c1",
    "photo-1658848507056-24ba67502b1d",
    "photo-1646072508768-d8ed28bc834c",
    "photo-1499290572571-a48c08140a19",
    "photo-1670044658475-0a66f42bb570",
    "photo-1770131091442-e672bd558370",
    "photo-1772490551058-c5de16b885b0",
  ],
  outerwear: [
    "photo-1664477124226-fe4beec4cf58",
    "photo-1584190810197-75f679c058fb",
    "photo-1598539962077-e4185f37104f",
    "photo-1598454444341-9b457c01f7ad",
    "photo-1772521244221-c492db13c7c5",
    "photo-1769868095095-667bf11ef3e4",
    "photo-1766755294029-c28bec396601",
    "photo-1606903073578-7ca9ea9946c0",
    "photo-1769868261650-6365436fe2d6",
    "photo-1761431319758-86bd28efbb52",
    "photo-1723910445358-9ec7840131d4",
    "photo-1769921359930-0ee608639b1c",
    "photo-1670044658475-0a66f42bb570",
    "photo-1769708526368-3ec7721e5060",
  ],
};

const badImageIds = new Set([
  "photo-1661581807227-f528470d6b99",
  "photo-1664300930116-b1fd2621d4c1",
  "photo-1670044658475-0a66f42bb570",
  "photo-1671656349262-1e1d3e09735c",
  "photo-1676225680209-19a398a9b38a",
  "photo-1683318597459-c9ccfd104dee",
  "photo-1688497830977-f9ab9f958ca7",
  "photo-1689531916407-d64dedd6126d",
  "photo-1690366910332-6cb1dc10c000",
  "photo-1690366910824-ea406d0a61bd",
  "photo-1695844419276-f8e42c19a1ca",
  "photo-1702742530633-24509cbfe2cf",
  "photo-1717529136686-0bee0abd9ad9",
  "photo-1723568617048-8ba7f42e5fec",
  "photo-1723579340803-5aca8e51cd7c",
  "photo-1723910445358-9ec7840131d4",
  "photo-1723925110801-110c00d392a3",
  "photo-1761415382176-9b6ea9488bbc",
  "photo-1761431319758-86bd28efbb52",
  "photo-1769868095095-667bf11ef3e4",
  "photo-1769868261650-6365436fe2d6",
  "photo-1762100579793-6bccc9364ee9",
  "photo-1770411638047-8e47a181d352",
  "photo-1771232636387-84d2c67f8c49",
  "photo-1771232636544-4280b93afe8f",
  "photo-1772490551058-c5de16b885b0",
  "photo-1663036261209-e802b09b34bf",
  "photo-1663036263525-3059e0c47b96",
  "photo-1663036286191-9f541be053d8",
  "photo-1664477124226-fe4beec4cf58",
]);

Object.keys(imagePools).forEach((key) => {
  imagePools[key] = imagePools[key].filter((id) => !badImageIds.has(id));
});

function unique(list) {
  return [...new Set(list)];
}

const fallbackPool = unique(
  Object.values(imagePools)
    .flat()
    .concat(imagePools.shirt)
    .concat(imagePools.tshirt),
);

function selectPool(group) {
  if (group.startsWith("TS")) return imagePools.tshirt;
  if (group.startsWith("SH")) return imagePools.shirt;
  if (group.startsWith("PT")) return imagePools.pants;
  if (group.startsWith("SHRT")) return imagePools.shorts;
  if (group === "LNG" || group === "NIGHT") return imagePools.lounge;
  if (group === "ACT") return imagePools.active;
  if (group.startsWith("OUT")) return imagePools.outerwear;
  return fallbackPool;
}

function imageForProduct(group, item, color) {
  const pool = selectPool(group);
  const idx = parseInt(hash(`${group}|${item}|${color}`), 36) % pool.length;
  const id = pool[idx];
  // Direct Unsplash image links are stable and render reliably in the UI.
  return `https://images.unsplash.com/${id}?w=1200&q=80`;
}

function stockForSize(size) {
  if (size === "M") return 60;
  if (size === "L") return 55;
  if (size === "S") return 45;
  if (size === "XL") return 40;
  if (size === "XXL") return 28;
  return 20;
}

const lines = [];
lines.push(
  "-- Auto-generated full catalog reset + rebuild for Men's Pure Cotton",
);
lines.push("USE `srfab`;");
lines.push("SET NAMES utf8mb4;");
lines.push("SET FOREIGN_KEY_CHECKS = 0;");
lines.push("");
lines.push("-- Clear catalog-dependent data first");
lines.push("DELETE FROM cart;");
lines.push("DELETE FROM wishlist;");
lines.push("DELETE FROM product_variant;");
lines.push("DELETE FROM product;");
lines.push("DELETE FROM category;");
lines.push("");
lines.push("ALTER TABLE category AUTO_INCREMENT = 1;");
lines.push("ALTER TABLE product AUTO_INCREMENT = 1;");
lines.push("ALTER TABLE product_variant AUTO_INCREMENT = 1;");
lines.push("");
lines.push("-- Insert fresh categories");
lines.push("INSERT INTO category (cid, name, image) VALUES");
lines.push(
  categories
    .map((c) => `  (${c.id}, '${esc(c.name)}', '${esc(c.image)}')`)
    .join(",\n") + ";",
);
lines.push("");
lines.push("SET @pid := 0;");
lines.push("");

let productCount = 0;
let variantCount = 0;

catalog.forEach((block) => {
  lines.push(`-- ${block.group}`);
  block.items.forEach((item, itemIndex) => {
    const name = item;
    const description = `${item}. 100% ${block.fabric}. Premium comfort for daily wear.`;
    const previewColor = block.colors?.[0] || "Default";
    const image = imageForProduct(block.group, item, previewColor);

    lines.push("SET @pid := @pid + 1;");
    lines.push(
      `INSERT INTO product (pid, name, description, price, discount, image, cid, brand, fabric_type) VALUES (@pid, '${esc(name)}', '${esc(description)}', '${block.price}', ${block.discount}, '${esc(image)}', ${block.categoryId}, '${esc(brand)}', '${esc(block.fabric)}');`,
    );

    lines.push(
      "INSERT INTO product_variant (pid, size, color, stock, sku) VALUES",
    );

    const variants = [];
    block.colors.forEach((color, colorIndex) => {
      sizes.forEach((size) => {
        const skuPrefix = `${block.group}-${itemIndex + 1}-${colorIndex + 1}-${size}`;
        const stock = stockForSize(size);
        variants.push(
          `  (@pid, '${size}', '${esc(color)}', ${stock}, CONCAT('${esc(skuPrefix)}-', LPAD(@pid, 5, '0')))`,
        );
      });
    });

    lines.push(`${variants.join(",\n")};`);
    lines.push("");

    productCount += 1;
    variantCount += variants.length;
  });
});

lines.push("SET FOREIGN_KEY_CHECKS = 1;");
lines.push("");
lines.push(`-- Products inserted: ${productCount}`);
lines.push(`-- Variants inserted: ${variantCount}`);

console.log(lines.join("\n"));

const SHORTS_VARIANTS = {
  "casual-shorts": {
    types: [
      "Basic Cotton Shorts",
      "Relaxed Fit Cotton Shorts",
      "Summer Cotton Shorts",
      "Elastic Waist Cotton Shorts",
      "Drawstring Cotton Shorts",
    ],
    colors: [
      "Navy Blue",
      "Grey",
      "Black",
      "Beige",
      "Olive Green",
      "Light Brown",
    ],
    price: 999,
  },
  "cargo-shorts": {
    types: [
      "Classic Cargo Shorts",
      "Multi Pocket Cargo Shorts",
      "Utility Cargo Shorts",
      "Outdoor Cotton Cargo Shorts",
    ],
    colors: ["Khaki", "Olive Green", "Sand", "Black", "Grey", "Brown"],
    price: 1299,
  },
  "pattern-shorts": {
    types: [
      "Striped Cotton Shorts",
      "Checked Cotton Shorts",
      "Minimal Pattern Cotton Shorts",
      "Tropical Print Cotton Shorts",
    ],
    colors: ["Blue & White", "Black & Grey", "Green & White", "Beige & Brown"],
    price: 1199,
  },
};

const DISCOUNT = 15;
const BRAND = "SR FAB";
const FABRIC_TYPE = "Pure Cotton";
const DEFAULT_START_PID = 401;
const DEFAULT_CID = 1;
const SIZES = ["S", "M", "L", "XL", "XXL"];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTypeCode(type) {
  return type
    .split(" ")
    .map((segment) => segment[0].toUpperCase())
    .join("")
    .substring(0, 3);
}

function getColorCode(color) {
  return color
    .split(/[ &]+/)
    .filter(Boolean)
    .map((segment) => segment[0].toUpperCase())
    .join("")
    .substring(0, 3);
}

function buildShortsManifest(startPid = DEFAULT_START_PID) {
  let pid = startPid;
  const manifest = [];

  Object.entries(SHORTS_VARIANTS).forEach(([prefix, config]) => {
    config.types.forEach((type) => {
      config.colors.forEach((color) => {
        const typeSlug = slugify(type);
        const colorSlug = slugify(color);
        manifest.push({
          pid,
          prefix,
          type,
          color,
          typeSlug,
          colorSlug,
          imageFileName: `${prefix}-${typeSlug}-${colorSlug}.png`,
          imagePath: `/images/products/catalog/${prefix}-${typeSlug}-${colorSlug}.png`,
          productName: `${color} ${type}`,
          price: config.price,
          description: `Premium 100% pure cotton ${color.toLowerCase()} ${type.toLowerCase()} for men. Stay comfortable and stylish with breathable and durable cotton fabric.`,
        });
        pid += 1;
      });
    });
  });

  return manifest;
}

module.exports = {
  SHORTS_VARIANTS,
  DISCOUNT,
  BRAND,
  FABRIC_TYPE,
  DEFAULT_START_PID,
  DEFAULT_CID,
  SIZES,
  slugify,
  getTypeCode,
  getColorCode,
  buildShortsManifest,
};

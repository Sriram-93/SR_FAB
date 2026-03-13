const KNOWN_COLOR_WORDS = new Set([
  "white",
  "black",
  "navy",
  "blue",
  "sky",
  "olive",
  "green",
  "maroon",
  "mustard",
  "yellow",
  "grey",
  "gray",
  "charcoal",
  "beige",
  "cream",
  "burgundy",
  "khaki",
  "brown",
  "sand",
  "military",
  "pink",
  "pastel",
  "light",
  "dark",
  "striped",
  "checked",
]);

export function extractTrailingColor(productName = "") {
  const parts = productName.split(" - ");
  if (parts.length < 2) return "";
  const candidate = parts[parts.length - 1].trim();
  if (!candidate) return "";

  const words = candidate.toLowerCase().split(/\s+/).filter(Boolean);
  const isColorLike =
    words.length > 0 && words.every((w) => KNOWN_COLOR_WORDS.has(w));

  return isColorLike ? candidate : "";
}

export function toBaseProductName(productName = "") {
  const trailingColor = extractTrailingColor(productName);
  if (!trailingColor) return productName.trim();
  return productName.replace(new RegExp(` - ${trailingColor}$`), "").trim();
}

function getPrimaryColor(product) {
  const inStockVariant = product?.variants?.find((v) => (v?.stock || 0) > 0);
  if (inStockVariant?.color) return inStockVariant.color;
  if (product?.variants?.[0]?.color) return product.variants[0].color;
  return extractTrailingColor(product?.productName || "");
}

export function groupProductsByStyle(products = []) {
  const grouped = new Map();

  products.forEach((product) => {
    const baseName = toBaseProductName(product.productName || "");
    const key = [
      product?.category?.categoryId || "na",
      (product?.brand || "").toLowerCase(),
      baseName.toLowerCase(),
    ].join("|");

    if (!grouped.has(key)) {
      grouped.set(key, {
        ...product,
        productName: baseName,
        styleProductIds: [product.productId],
        styleColors: [],
        styleColorCount: 0,
      });
    } else {
      const current = grouped.get(key);
      current.styleProductIds.push(product.productId);

      // Keep the card image stable but upgrade to a richer description if available.
      if (
        (!current.productDescription ||
          current.productDescription.length < 20) &&
        product.productDescription
      ) {
        current.productDescription = product.productDescription;
      }
    }

    const group = grouped.get(key);
    const color = getPrimaryColor(product);
    if (color && !group.styleColors.includes(color)) {
      group.styleColors.push(color);
    }
  });

  return Array.from(grouped.values()).map((item) => ({
    ...item,
    styleColorCount: item.styleColors.length,
  }));
}

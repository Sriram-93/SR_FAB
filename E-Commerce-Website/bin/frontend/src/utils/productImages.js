// Curated Unsplash fashion photos keyed by product ID
const FASHION_IMAGES = [
  'photo-1596755094514-f87e34085b2c', // shirts
  'photo-1594938298603-c8148c4dae35', // chinos / pants
  'photo-1551028719-00167b16eac5', // denim jacket
  'photo-1572804013309-59a88b7e92f1', // floral dress
  'photo-1509631179647-0177331693ae', // palazzo pants
  'photo-1610030469983-98e550d6193c', // saree
  'photo-1583391733956-3750e0ff4e8b', // kurta
  'photo-1519238263530-99bdd11df2ea', // kids wear
  'photo-1614252235316-8c857d38b5f4', // formal shoes
  'photo-1601924582970-9238bcb495d9', // stole / accessories
];

const FALLBACK = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=75';

/**
 * Returns an Unsplash fashion image URL for a product.
 * @param {number} productId - The product's unique ID
 * @param {number} [width=400] - Desired image width
 * @param {number} [height=530] - Desired image height
 */
export const getProductImage = (productId, width = 400, height = 530) => {
  const idx = ((productId || 1) - 1) % FASHION_IMAGES.length;
  return `https://images.unsplash.com/${FASHION_IMAGES[idx]}?w=${width}&h=${height}&fit=crop&q=80`;
};

export const FALLBACK_IMAGE = FALLBACK;

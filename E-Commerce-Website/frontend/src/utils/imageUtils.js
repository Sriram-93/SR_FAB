import { FALLBACK_IMAGE } from "./productImages";

export const toOptimizedImageUrl = (
  imageUrl,
  { width = 640, height = 853, quality = 78 } = {},
) => {
  if (!imageUrl) {
    return FALLBACK_IMAGE;
  }

  if (!imageUrl.includes("images.unsplash.com")) {
    return imageUrl;
  }

  const [base] = imageUrl.split("?");
  return `${base}?w=${width}&h=${height}&fit=crop&q=${quality}&auto=format`;
};

export const buildImageSrcSet = (imageUrl, ratio = "3:4") => {
  if (!imageUrl || !imageUrl.includes("images.unsplash.com")) {
    return undefined;
  }

  const [widthPart, heightPart] = ratio.split(":").map(Number);
  const candidates = [320, 480, 640, 800];
  return candidates
    .map((width) => {
      const height = Math.round((width / widthPart) * heightPart);
      return `${toOptimizedImageUrl(imageUrl, { width, height })} ${width}w`;
    })
    .join(", ");
};

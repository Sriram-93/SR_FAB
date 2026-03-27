/**
 * imageUtils.js
 * Contains utilities for image transformation, optimization, and cropping.
 */

/**
 * Transforms any image URL (Cloudinary, Unsplash, or others) to an optimized version
 * using Cloudinary's dynamic CDN features (Proxy/Fetch for external sources).
 */
export const toOptimizedImageUrl = (
  url,
  { width, height, quality = "auto" } = {},
) => {
  if (!url || typeof url !== "string") return "";

  // 0. Handle double-encoding or malformed starts (e.g. https%3A%2F%2F)
  let cleanUrl = url;
  if (url.startsWith("https%3A%2F%2F") || url.startsWith("http%3A%2F%2F")) {
    try {
      cleanUrl = decodeURIComponent(url);
    } catch {
      // ignore
    }
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const hasWidth = Number.isFinite(width) && width > 0;
  const hasHeight = Number.isFinite(height) && height > 0;

  // 1. Existing Cloudinary URL: Inject transformations directly
  if (cleanUrl.includes("cloudinary.com")) {
    const parts = cleanUrl.split("/upload/");
    if (parts.length === 2) {
      const transforms = ["f_auto", `q_${quality}`];
      if (hasWidth && hasHeight) {
        transforms.push(`w_${width}`, `h_${height}`, "c_fill", "g_auto");
      } else if (hasWidth) {
        transforms.push(`w_${width}`, "c_limit");
      }
      return `${parts[0]}/upload/${transforms.join(",")}/${parts[1]}`;
    }
  }

  // 2. Unsplash optimization fallback
  if (cleanUrl.includes("images.unsplash.com")) {
    const baseUrl = cleanUrl.split("?")[0];
    const params = new URLSearchParams({
      auto: "format,compress",
      q: typeof quality === "number" ? String(quality) : "80",
      cs: "tinysrgb",
    });
    if (hasWidth) params.set("w", String(width));
    if (hasHeight) params.set("h", String(height));
    if (hasWidth && hasHeight) params.set("fit", "crop");
    return `${baseUrl}?${params.toString()}`;
  }

  // 3. Fallback: Use Cloudinary Fetch for other external URLs
  if (cleanUrl.startsWith("http") && cloudName) {
    const transforms = ["f_auto", `q_${quality}`];
    if (hasWidth && hasHeight) {
      transforms.push(`w_${width}`, `h_${height}`, "c_fill", "g_auto");
    } else if (hasWidth) {
      transforms.push(`w_${width}`, "c_limit");
    }
    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transforms.join(",")}/${encodeURIComponent(url)}`;
  }

  return url;
};

/**
 * Builds a robust responsive srcSet for an image.
 */
export const buildImageSrcSet = (url, aspect = "3:4") => {
  if (!url || typeof url !== "string") return "";

  const aspectParts = aspect.split(":").map(Number);
  const ratio =
    aspectParts.length === 2 ? aspectParts[1] / aspectParts[0] : 1.33;

  // Expanded widths for high-DPI and large screens
  const widths = [360, 480, 640, 800, 1080, 1280];
  return widths
    .map((w) => {
      const h = Math.round(w * ratio);
      return `${toOptimizedImageUrl(url, { width: w, height: h })} ${w}w`;
    })
    .join(", ");
};

// ─── Virtual Try-On Cropping Utilities ───────────────────────────

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Performs crop on image and returns a blob URL.
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation,
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file));
    }, "image/jpeg");
  });
}

/**
 * Performs crop on image and returns a base64 string.
 * Added maxWidth to optimize upload size and speed.
 */
export async function getCroppedImgBase64(
  imageSrc,
  pixelCrop,
  maxWidth = 1024,
) {
  const image = await createImage(imageSrc);

  // Calculate new dimensions if it exceeds maxWidth
  let { width, height } = pixelCrop;
  if (width > maxWidth) {
    const scale = maxWidth / width;
    width = maxWidth;
    height = Math.round(pixelCrop.height * scale);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    width,
    height,
  );

  // Use 0.9 quality for a good balance between size and quality
  return canvas.toDataURL("image/jpeg", 0.9);
}

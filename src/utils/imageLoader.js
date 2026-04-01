// src/utils/imageLoader.js
// Utility to provide Vite-friendly URLs for images in src/assets/shop

const modules = import.meta.glob('../assets/shop/*.{jpg,jpeg,png,webp}', { eager: true, as: 'url' });

export function getImageUrl(fileName) {
  const entries = Object.entries(modules);
  if (!fileName) return entries.length ? entries[0][1] : null;

  // Match by filename (e.g., 'Img1.jpg') or full path
  const found = entries.find(([path]) => path.endsWith(`/${fileName}`) || path.endsWith(fileName));

  if (found) return found[1];

  // Fallback to first available asset if filename not found
  return entries.length ? entries[0][1] : null;
}

export default getImageUrl;
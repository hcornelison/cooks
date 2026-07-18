import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*', { eager: true });

export function getRecipeImage(filename: string): ImageMetadata {
  const mod = images[`/src/assets/images/${filename}`];
  if (!mod) {
    throw new Error(`Missing recipe image: ${filename}`);
  }
  return mod.default;
}

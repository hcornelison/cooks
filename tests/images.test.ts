import { describe, expect, it } from 'vitest';
import { getRecipeImage } from '../src/utils/images';

describe('getRecipeImage', () => {
  it('resolves a real image file to its ImageMetadata', () => {
    const image = getRecipeImage('chocolate-chip-cookies.png');
    expect(image.src).toBeTruthy();
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
  });

  it('throws a clear error for a missing image', () => {
    expect(() => getRecipeImage('does-not-exist.png')).toThrow(/Missing recipe image/);
  });
});

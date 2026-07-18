import { describe, expect, it } from 'vitest';
import {
  extractQuantity,
  numberToPretty,
  quantityToNumber,
  scaleIngredient,
  toNumber,
} from '../public/js/scale-recipes.js';

describe('toNumber', () => {
  it('parses whole numbers', () => {
    expect(toNumber('2')).toBe(2);
  });

  it('parses fractions', () => {
    expect(toNumber('1/2')).toBe(0.5);
    expect(toNumber('3/4')).toBe(0.75);
  });
});

describe('quantityToNumber', () => {
  it('sums a whole number and a fraction (mixed number)', () => {
    expect(quantityToNumber('1 1/2')).toBe(1.5);
  });

  it('handles a single fraction', () => {
    expect(quantityToNumber('3/4')).toBe(0.75);
  });

  it('handles a single whole number', () => {
    expect(quantityToNumber('2')).toBe(2);
  });
});

describe('numberToPretty', () => {
  it('renders a whole number with no fraction', () => {
    expect(numberToPretty(2)).toBe('2');
  });

  it('renders a bare fraction with no whole-number part', () => {
    // numberToPretty embeds a leading space in each fraction glyph so it
    // reads naturally after a whole number ("1 &frac12;") - with no whole
    // number that leading space carries through to the output.
    expect(numberToPretty(0.5)).toBe(' &frac12;');
  });

  it('renders a mixed number', () => {
    expect(numberToPretty(1.5)).toBe('1 &frac12;');
  });

  it('falls back to a decimal for a fraction with no glyph', () => {
    // 0.2 isn't one of the known fraction glyphs
    expect(numberToPretty(0.2)).toBe('0.2');
  });
});

describe('extractQuantity', () => {
  it('extracts a leading whole number', () => {
    expect(extractQuantity('2 Cups Sugar')).toBe('2 ');
  });

  it('extracts a leading mixed number', () => {
    expect(extractQuantity('1 1/2 teaspoons Vanilla')).toBe('1 1/2 ');
  });

  it('returns an empty string when there is no leading quantity', () => {
    expect(extractQuantity('Salt to taste')).toBe('');
  });
});

describe('scaleIngredient', () => {
  it('doubles a mixed-number quantity', () => {
    expect(scaleIngredient('Cups All-Purpose Flour', '2 1/4 ', 2)).toBe('4 &frac12; Cups All-Purpose Flour');
  });

  it('scales by a fractional factor', () => {
    expect(scaleIngredient('Cup Sugar', '1 ', 0.5)).toBe(' &frac12; Cup Sugar');
  });

  it('leaves an ingredient with no quantity untouched', () => {
    expect(scaleIngredient('Salt to taste', '', 3)).toBe('Salt to taste');
  });

  it('defaults to scale 1 when unspecified', () => {
    expect(scaleIngredient('Cup Sugar', '1 ')).toBe('1 Cup Sugar');
  });
});

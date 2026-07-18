import { describe, expect, it } from 'vitest';
import { renderInline } from '../src/utils/markdown';

describe('renderInline', () => {
  it('renders a markdown link as a real anchor tag', () => {
    expect(renderInline('Original recipe came from [here](https://example.com)')).toBe(
      'Original recipe came from <a href="https://example.com">here</a>',
    );
  });

  it('leaves plain text untouched', () => {
    expect(renderInline('Preheat oven to 375 degrees.')).toBe('Preheat oven to 375 degrees.');
  });

  it('does not wrap the output in a <p> tag', () => {
    const html = renderInline('Some *emphasized* text');
    expect(html).not.toMatch(/^<p>/);
    expect(html).toContain('<em>emphasized</em>');
  });
});

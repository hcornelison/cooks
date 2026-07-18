import { marked } from 'marked';

// Renders inline markdown (links, emphasis, code) without wrapping the
// result in a <p>, since these strings are used inside <li> items.
export function renderInline(text: string): string {
  return marked.parseInline(text, { async: false }) as string;
}

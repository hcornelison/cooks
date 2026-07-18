import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname, '..');
const RECIPES_DIR = path.join(ROOT, 'src/content/recipes');
const COMPONENTS_DIR = path.join(ROOT, 'src/content/components');
const IMAGES_DIR = path.join(ROOT, 'src/assets/images');

function loadMarkdownDir(dir: string) {
  return readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const { data } = matter.read(path.join(dir, file));
      return { file, data };
    });
}

const recipes = loadMarkdownDir(RECIPES_DIR);
const components = loadMarkdownDir(COMPONENTS_DIR);
const componentTitles = new Set(components.map((c) => c.data.title));

describe('recipe image references', () => {
  for (const { file, data } of recipes) {
    it(`${file}: image "${data.image}" exists in src/assets/images/`, () => {
      expect(existsSync(path.join(IMAGES_DIR, data.image))).toBe(true);
    });
  }
});

describe('recipe component references', () => {
  for (const { file, data } of recipes) {
    for (const name of data.components ?? []) {
      it(`${file}: components entry "${name}" matches a real component title`, () => {
        expect(componentTitles.has(name)).toBe(true);
      });
    }
  }
});

describe('component titles', () => {
  it('are unique, since recipes look components up by title', () => {
    const titles = components.map((c) => c.data.title);
    const duplicates = titles.filter((title, i) => titles.indexOf(title) !== i);
    expect(duplicates).toEqual([]);
  });
});

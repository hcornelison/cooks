// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { init } from '../public/js/checklist.js';

function buildDom() {
  document.body.innerHTML = `
    <ul class="ingredients-list">
      <li data-ingredient-text="2 Cups Flour"><input type="checkbox" /><span class="ingredient-label">2 Cups Flour</span></li>
      <li data-ingredient-text="1 Cup Sugar"><input type="checkbox" /><span class="ingredient-label">1 Cup Sugar</span></li>
    </ul>
    <ul class="directions-list">
      <li><input type="checkbox" />Preheat oven</li>
    </ul>
  `;
}

const storageKey = () => `checklist:${location.pathname}`;

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});

describe('init (checklist persistence)', () => {
  it('restores previously checked items from localStorage by position', () => {
    localStorage.setItem(storageKey(), JSON.stringify([1]));
    buildDom();
    init();
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    expect(checkboxes[0].checked).toBe(false);
    expect(checkboxes[1].checked).toBe(true);
    expect(checkboxes[2].checked).toBe(false);
  });

  it('saves state when a checkbox is clicked directly', () => {
    buildDom();
    init();
    const checkbox = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[0];
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    expect(JSON.parse(localStorage.getItem(storageKey())!)).toEqual([0]);
  });

  it('saves state when clicking elsewhere on the list item, not the checkbox itself', () => {
    buildDom();
    init();
    const li = document.querySelector<HTMLLIElement>('.ingredients-list li')!;
    li.click();
    expect(li.querySelector<HTMLInputElement>('input')!.checked).toBe(true);
    expect(JSON.parse(localStorage.getItem(storageKey())!)).toEqual([0]);
  });

  it('does not double-toggle when clicking directly on the checkbox (li click guard)', () => {
    buildDom();
    init();
    const li = document.querySelector<HTMLLIElement>('.ingredients-list li')!;
    const checkbox = li.querySelector<HTMLInputElement>('input')!;
    // Simulate a real user click landing on the checkbox: the native click
    // flips `checked` first, then the click event bubbles to the <li>.
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('click', { bubbles: true }));
    expect(checkbox.checked).toBe(true);
  });

  it('keeps two checkboxes for the same ingredient text independent, since they persist by DOM position', () => {
    // Reproduces the shopping-list-view vs. per-part-list scenario: the same
    // ingredient can appear in two separate checkbox instances on one page.
    document.body.innerHTML = `
      <ul class="ingredients-list">
        <li data-ingredient-text="Salt"><input type="checkbox" /><span class="ingredient-label">Salt</span></li>
      </ul>
      <ul class="ingredients-list">
        <li data-ingredient-text="Salt"><input type="checkbox" /><span class="ingredient-label">Salt</span></li>
      </ul>
    `;
    init();
    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes[0].checked = true;
    checkboxes[0].dispatchEvent(new Event('change', { bubbles: true }));
    expect(checkboxes[1].checked).toBe(false);
  });

  it('does nothing when there are no checklist items on the page', () => {
    document.body.innerHTML = '<p>No lists here</p>';
    expect(() => init()).not.toThrow();
  });
});

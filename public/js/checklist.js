// Exported (rather than just run inline on DOMContentLoaded) so a test can
// call it directly against a hand-built DOM without racing the real event.
export function init() {
  const items = [...document.querySelectorAll('.ingredients-list li, .directions-list li, .notes-list li')]
    .map((li) => ({ li, checkbox: li.querySelector('input[type="checkbox"]') }))
    .filter((item) => item.checkbox);

  if (!items.length) return;

  // Keyed by path so each recipe persists independently. Keyed by position
  // (not ingredient/direction text) so the two independent checkbox
  // instances that can exist for the same ingredient - the combined
  // shopping-list view and a recipe part's own list - don't get linked.
  const storageKey = `checklist:${location.pathname}`;

  function loadCheckedIndices() {
    try {
      const raw = localStorage.getItem(storageKey);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  function saveCheckedIndices() {
    const checked = items.map((item, i) => (item.checkbox.checked ? i : null)).filter((i) => i !== null);
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      // Ignore write failures (private browsing, quota, storage disabled, etc.)
    }
  }

  const checkedIndices = loadCheckedIndices();
  items.forEach(({ checkbox }, i) => {
    if (checkedIndices.has(i)) checkbox.checked = true;
  });

  items.forEach(({ li, checkbox }) => {
    li.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'A') return;
      checkbox.checked = !checkbox.checked;
      saveCheckedIndices();
    });
    checkbox.addEventListener('change', saveCheckedIndices);
  });
}

// Guarded so this can be imported and unit tested outside a browser (e.g.
// Node/Vitest), where `document` doesn't exist.
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
}

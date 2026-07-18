document.addEventListener('DOMContentLoaded', () => {
  const buttons = [...document.querySelectorAll('.tag-filter-btn')];
  const cards = [...document.querySelectorAll('#recipes-grid .recipe-card')];
  const emptyState = document.getElementById('filter-empty-state');
  if (!buttons.length || !cards.length) return;

  function applyFilter(tag) {
    let visibleCount = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(',');
      const matches = tag === 'all' || tags.includes(tag);
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount++;
    });
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      applyFilter(button.dataset.tag);
    });
  });
});

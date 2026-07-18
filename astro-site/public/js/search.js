document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  let recipes = [];

  fetch('/search.json')
    .then((res) => res.json())
    .then((data) => {
      recipes = data;
    });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function render(matches) {
    results.innerHTML = matches
      .map(
        (recipe) => `
          <a class="recipe-card" href="${recipe.url}">
            <div class="card-image-wrap">
              <img src="${recipe.image}" alt="${escapeHtml(recipe.title)}" loading="lazy" />
            </div>
            <h1 class="title"><span class="title-text">${escapeHtml(recipe.title)}</span></h1>
          </a>
        `,
      )
      .join('');
  }

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML = '';
      return;
    }
    const matches = recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.ingredients.toLowerCase().includes(query) ||
        recipe.tags.toLowerCase().includes(query),
    );
    render(matches);
  });
});

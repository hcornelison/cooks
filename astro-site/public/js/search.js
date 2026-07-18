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

  function render(matches) {
    results.innerHTML = matches
      .map(
        (recipe) => `
          <a class="recipe-card" href="${recipe.url}">
            <div class="image" style="background-image:url(${recipe.image});"></div>
            <h1 class="title"><span class="title-text">${recipe.title}</span></h1>
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

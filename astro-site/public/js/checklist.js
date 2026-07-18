document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ingredients-list li, .directions-list li, .notes-list li').forEach((li) => {
    li.addEventListener('click', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'A') return;
      const checkbox = li.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = !checkbox.checked;
    });
  });
});

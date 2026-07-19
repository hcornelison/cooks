document.addEventListener('DOMContentLoaded', () => {
  if (!('wakeLock' in navigator)) return;

  const button = document.getElementById('wake-lock-toggle');
  if (!button) return;

  const label = button.querySelector('.wake-lock-label');
  let sentinel = null;
  let enabled = false;

  function updateButton() {
    button.classList.toggle('active', enabled);
    button.setAttribute('aria-pressed', String(enabled));
    if (label) label.textContent = enabled ? 'Screen Staying Awake' : 'Keep Screen Awake';
  }

  async function requestWakeLock() {
    try {
      sentinel = await navigator.wakeLock.request('screen');
      sentinel.addEventListener('release', () => {
        sentinel = null;
      });
    } catch {
      // Request can fail (e.g. low battery, permissions policy). Fall back
      // to reflecting "off" rather than claiming a lock we don't have.
      enabled = false;
      updateButton();
    }
  }

  button.hidden = false;

  button.addEventListener('click', async () => {
    enabled = !enabled;
    if (enabled) {
      await requestWakeLock();
    } else if (sentinel) {
      await sentinel.release();
      sentinel = null;
    }
    updateButton();
  });

  // The browser force-releases the lock whenever the tab is hidden. Re-request
  // it when the tab becomes visible again, if the user still has it toggled on.
  document.addEventListener('visibilitychange', async () => {
    if (enabled && document.visibilityState === 'visible' && !sentinel) {
      await requestWakeLock();
      updateButton();
    }
  });
});

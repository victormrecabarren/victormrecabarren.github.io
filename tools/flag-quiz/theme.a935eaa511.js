(() => {
  const key = 'flag-quiz:theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem(key); } catch {}
  if (!['light', 'dark'].includes(preference)) preference = null;
  const isDark = () => document.documentElement.dataset.theme === 'dark';
  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(isDark()));
      toggle.textContent = isDark() ? 'Light mode' : 'Dark mode';
      toggle.title = isDark() ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  system.addEventListener('change', event => {
    if (!preference) apply(event.matches ? 'dark' : 'light');
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.getElementById('theme-toggle').addEventListener('click', () => {
      preference = isDark() ? 'light' : 'dark';
      apply(preference);
      try { localStorage.setItem(key, preference); } catch {}
    });
  });
})();

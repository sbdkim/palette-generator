(function attachThemeApi() {
  const THEME_KEY = 'northline-theme';
  const root = document.documentElement;
  const media =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const themeColors = {
    light: '#f6f3ee',
    dark: '#0f0f0f',
  };

  function getSavedTheme() {
    try {
      const value = window.localStorage.getItem(THEME_KEY);
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }

  function getPreferredTheme() {
    return media && media.matches ? 'dark' : 'light';
  }

  function updateThemeColor(theme) {
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeColors[theme]);
    }
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (document.body) {
      document.body.dataset.theme = theme;
    }

    updateThemeColor(theme);

    const toggle = document.getElementById('themeToggle');
    if (!toggle) {
      return;
    }

    const icon = toggle.querySelector('.theme-toggle__icon');
    const label = toggle.querySelector('.theme-toggle__label');
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    toggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
    toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');

    if (icon) {
      icon.textContent = theme === 'dark' ? '\u2600' : '\u263e';
    }

    if (label) {
      label.textContent = `Switch to ${nextTheme} mode`;
    }
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore storage failures.
    }
  }

  function clearPersistedTheme() {
    try {
      window.localStorage.removeItem(THEME_KEY);
    } catch {
      // Ignore storage failures.
    }
  }

  function mountToggle() {
    if (!document.body || document.getElementById('themeToggle')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'themeToggle';
    button.className = 'theme-toggle';
    button.innerHTML =
      '<span class="theme-toggle__icon" aria-hidden="true"></span>' +
      '<span class="theme-toggle__label"></span>';

    button.addEventListener('click', () => {
      const storedTheme = getSavedTheme();
      const currentTheme = root.dataset.theme || getPreferredTheme();
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      if (storedTheme === nextTheme) {
        clearPersistedTheme();
        applyTheme(getPreferredTheme());
        return;
      }

      persistTheme(nextTheme);
      applyTheme(nextTheme);
    });

    document.body.appendChild(button);
    applyTheme(root.dataset.theme || getPreferredTheme());
  }

  function initTheme() {
    applyTheme(getSavedTheme() || getPreferredTheme());

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountToggle, { once: true });
    } else {
      mountToggle();
    }

    if (media) {
      const handleChange = () => {
        if (!getSavedTheme()) {
          applyTheme(getPreferredTheme());
        }
      };

      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handleChange);
      } else if (typeof media.addListener === 'function') {
        media.addListener(handleChange);
      }
    }
  }

  window.NorthlineTheme = {
    initTheme,
    applyTheme,
    getSavedTheme,
  };
})();
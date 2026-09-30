export type Theme = "light" | "dark";
const storageKey = "matchcv-theme";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // The toggle remains usable when browser storage is unavailable.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const initialTheme = readTheme();
document.documentElement.dataset.theme = initialTheme;

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // Retain the selected theme for this page even without persistence.
  }
}

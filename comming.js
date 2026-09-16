const THEME_KEY = "theme";
const DIR_KEY = "dir";

document.addEventListener("DOMContentLoaded", () => {
  applySavedPreferences();
  createLucideIcons();
  setupDarkMode();
  setupRTL();
});

function createLucideIcons(root = document) {
  if (typeof lucide !== "undefined") {
    lucide.createIcons({ root });
  }
}

function setLucideIcon(element, iconName) {
  if (!element) return;

  element.replaceChildren();

  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", iconName);

  element.appendChild(icon);
  createLucideIcons(element);
}

function getStorageItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : fallback;
  } catch (error) {
    return fallback;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Unable to save "${key}" to localStorage.`, error);
  }
}

function applySavedPreferences() {
  const savedTheme = getStorageItem(THEME_KEY, "light");
  const savedDir = getStorageItem(DIR_KEY, "ltr");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  document.documentElement.dir = savedDir === "rtl" ? "rtl" : "ltr";

  updateToggleIcons();
  updateLogos();
}

function updateToggleIcons() {
  const darkToggle = document.getElementById("darkToggle");

  if (darkToggle) {
    const isDark = document.body.classList.contains("dark-mode");
    setLucideIcon(darkToggle, isDark ? "sun" : "moon");
  }
}

function updateLogos() {
  const logoImg = document.querySelector(".brand-logo");

  if (!logoImg) return;

  const isDarkMode = document.body.classList.contains("dark-mode");
  const logoPath = isDarkMode ? "./images/logo1.png" : "./images/logo.png";

  logoImg.src = logoPath;
}

function setupDarkMode() {
  const darkToggle = document.getElementById("darkToggle");
  if (!darkToggle || darkToggle.dataset.bound === "true") return;

  darkToggle.dataset.bound = "true";

  darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    setStorageItem(THEME_KEY, isDark ? "dark" : "light");
    updateToggleIcons();
    updateLogos();
  });
}

function setupRTL() {
  const rtlToggle = document.getElementById("rtlToggle");
  if (!rtlToggle || rtlToggle.dataset.bound === "true") return;

  rtlToggle.dataset.bound = "true";

  rtlToggle.addEventListener("click", () => {
    const newDir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = newDir;
    setStorageItem(DIR_KEY, newDir);
  });
}

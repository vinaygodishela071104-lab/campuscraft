document.addEventListener("DOMContentLoaded", () => {
  if (typeof applySavedPreferences === "function") {
    applySavedPreferences();
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  setupDarkMode();
  setupRTL();
});

function setupDarkMode() {
  const darkToggle = document.getElementById("darkToggle");
  if (!darkToggle || darkToggle.dataset.bound === "true") return;

  darkToggle.dataset.bound = "true";

  darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    setStorageItem("theme", isDark ? "dark" : "light");

    if (typeof updateToggleIcons === "function") updateToggleIcons();
    if (typeof updateLogos === "function") updateLogos();
  });
}

function setupRTL() {
  const rtlToggle = document.getElementById("rtlToggle");
  if (!rtlToggle || rtlToggle.dataset.bound === "true") return;

  rtlToggle.dataset.bound = "true";

  rtlToggle.addEventListener("click", () => {
    const newDir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";
    document.documentElement.dir = newDir;
    setStorageItem("dir", newDir);
  });
}

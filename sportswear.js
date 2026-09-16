function initializeSportsProductFilters() {
  const tabs = document.querySelectorAll(".sports-tab");
  const cards = document.querySelectorAll(".sports-products .product-card");

  if (!tabs.length || !cards.length) return;

  tabs.forEach((tab) => {
    if (tab.dataset.bound === "true") return;
    tab.dataset.bound = "true";

    tab.addEventListener("click", () => {
      const selectedCategory = tab.dataset.tab;

      tabs.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });

      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      cards.forEach((card) => {
        const cardCategory = card.dataset.category;
        card.hidden = !(
          selectedCategory === "all" || cardCategory === selectedCategory
        );
      });

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    });
  });
}

function initializeSportsSizeSelection() {
  const productCards = document.querySelectorAll(
    ".sports-products .product-card",
  );

  productCards.forEach((card) => {
    const sizeButtons = card.querySelectorAll(".size-chip");
    const addToCartButtons = card.querySelectorAll("[data-add-to-cart]");

    sizeButtons.forEach((sizeButton) => {
      if (sizeButton.dataset.bound === "true") return;
      sizeButton.dataset.bound = "true";

      sizeButton.addEventListener("click", () => {
        sizeButtons.forEach((button) => button.classList.remove("is-active"));
        sizeButton.classList.add("is-active");

        addToCartButtons.forEach((btn) => {
          btn.dataset.size = sizeButton.textContent.trim();
        });
      });
    });
  });
}

function initializeSportsSection() {
  initializeSportsProductFilters();
  initializeSportsSizeSelection();

  if (typeof bindAddToCartButtons === "function") {
    bindAddToCartButtons();
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", initializeSportsSection);

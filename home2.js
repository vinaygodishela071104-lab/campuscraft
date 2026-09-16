(function () {
  const viewMoreBtn = document.getElementById("testiViewMore");
  const viewLessBtn = document.getElementById("testiViewLess");

  if (!viewMoreBtn || !viewLessBtn) return;

  const allCards = Array.from(document.querySelectorAll(".testi-item"));
  const INITIAL_VISIBLE = 3;
  const BATCH_SIZE = 3;

  function countVisible() {
    return allCards.filter((card) => !card.hasAttribute("hidden")).length;
  }

  function updateButtons() {
    const visibleCount = countVisible();
    const totalCount = allCards.length;

    if (visibleCount >= totalCount) {
      // All 6 displayed → show ONLY "View less"
      viewMoreBtn.hidden = true;
      viewLessBtn.hidden = false;
    } else if (visibleCount <= INITIAL_VISIBLE) {
      // Only 3 displayed → show ONLY "View more"
      viewMoreBtn.hidden = false;
      viewLessBtn.hidden = true;
    } else {
      // Intermediate (shouldn't happen with current logic)
      viewMoreBtn.hidden = false;
      viewLessBtn.hidden = true;
    }
  }

  function revealNextBatch() {
    const hiddenCards = allCards.filter((card) => card.hasAttribute("hidden"));
    const next = hiddenCards.slice(0, BATCH_SIZE);

    next.forEach((card, i) => {
      card.removeAttribute("hidden");

      // fade/slide-in animation
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";

      setTimeout(() => {
        card.style.transition = "opacity 400ms ease, transform 400ms ease";
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, i * 80);
    });

    updateButtons();
  }

  function collapseToInitial() {
    allCards.forEach((card, index) => {
      if (index >= INITIAL_VISIBLE) {
        card.setAttribute("hidden", "");
      }
    });

    updateButtons();
  }

  viewMoreBtn.addEventListener("click", revealNextBatch);
  viewLessBtn.addEventListener("click", collapseToInitial);

  // Initialize button visibility on page load
  updateButtons();
})();
function updateHeroImage() {
  const heroImage = document.getElementById("premiumHeroImage");

  if (!heroImage) return;

  heroImage.src = document.body.classList.contains("dark-mode")
    ? heroImage.dataset.dark
    : heroImage.dataset.light;
}

document.addEventListener("DOMContentLoaded", () => {
  updateHeroImage();

  const darkToggle = document.getElementById("darkToggle");

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      setTimeout(() => {
        updateHeroImage();
      }, 0);
    });
  }
});

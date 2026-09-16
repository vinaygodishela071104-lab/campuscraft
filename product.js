const statValues = document.querySelectorAll(".stat-card__value");

const animateCounters = () => {
  statValues.forEach((stat) => {
    const target = +stat.getAttribute("data-target");
    const suffix = stat.getAttribute("data-suffix") || "";
    const duration = 1800;
    const increment = target / (duration / 16);

    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.ceil(current).toLocaleString() + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target.toLocaleString() + suffix;
      }
    };

    updateCounter();
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  },
  { threshold: 0.4 },
);

const statsSection = document.querySelector(".stats-section");
if (statsSection) observer.observe(statsSection);

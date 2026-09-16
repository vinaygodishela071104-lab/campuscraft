 document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll("[data-impact-number]");

    const formatNumber = value => {
      return new Intl.NumberFormat("en-IN").format(value);
    };

    const animateCounter = counter => {
      const target = Number(counter.dataset.impactNumber);
      const suffix = counter.dataset.impactSuffix || "";
      const duration = 1600;
      const startTime = performance.now();

      const updateCounter = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(target * easedProgress);

        counter.textContent = `${formatNumber(currentValue)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = `${formatNumber(target)}${suffix}`;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    const impactSection = document.querySelector(".about-impact");

    if (!impactSection) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return;

        counters.forEach(animateCounter);
        observer.disconnect();
      },
      {
        threshold: 0.3
      }
    );

    observer.observe(impactSection);
  });
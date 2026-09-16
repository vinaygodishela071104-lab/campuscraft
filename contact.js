const faqItems = document.querySelectorAll(".contact-faq__item");

faqItems.forEach((item) => {
  const button = item.querySelector(".contact-faq__question");

  button.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => {
      faq.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
});
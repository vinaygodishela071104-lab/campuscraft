document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const productSelect = document.querySelector("#preview-product");
  const productTitle = document.querySelector("#preview-product-name");
  const productImage = document.querySelector("#product-preview-image");

  const productInfoTitle = document.querySelector(
    "#preview-product-info-title",
  );

  const productDescription = document.querySelector(
    "#preview-product-description",
  );

  const productType = document.querySelector("#preview-product-type");

  const productUse = document.querySelector("#preview-product-use");

  const primaryInput = document.querySelector("#primary-colour");
  const secondaryInput = document.querySelector("#secondary-colour");

  const primaryValue = document.querySelector("#primary-colour-value");
  const secondaryValue = document.querySelector("#secondary-colour-value");

  const logoInput = document.querySelector("#school-logo");
  const logoFileName = document.querySelector("#logo-file-name");

  const schoolTextInput = document.querySelector("#uniform-name");
  const quantityInput = document.querySelector("#uniform-number");

  const quoteButton = document.querySelector("#preview-quote-button");
  const resetButton = document.querySelector("#reset-preview");

  const viewButtons = document.querySelectorAll(".design-preview__view-button");

  const swatches = document.querySelectorAll(".design-preview__swatch");

  const quoteForm = document.querySelector("#custom-quote-form");
  const quoteProduct = document.querySelector("#quote-selected-product");
  const quoteProductValue = document.querySelector("#quote-product-value");
  const quoteMainColour = document.querySelector("#quote-main-colour");
  const quoteAccentColour = document.querySelector("#quote-accent-colour");
  const quoteSchoolText = document.querySelector("#quote-school-text");
  const quoteView = document.querySelector("#quote-view");
  const quoteLogoName = document.querySelector("#quote-logo-name");
  const quoteMessage = document.querySelector("#quote-message");
  const quoteQuantity = document.querySelector("#quote-quantity");
  const quoteStatus = document.querySelector("#custom-quote-status");

  const defaults = {
    product: "performance-tshirt",
    primary: "#062b5c",
    secondary: "#f5a000",
    schoolText: "",
    quantity: "50",
    view: "front",
  };

  let selectedView = defaults.view;

  const getSelectedProduct = () => {
    return productSelect.options[productSelect.selectedIndex];
  };

  const updateProductDetails = () => {
    const selectedProduct = getSelectedProduct();

    const productName = selectedProduct.dataset.name;
    const productTypeValue = selectedProduct.dataset.type;
    const productUseValue = selectedProduct.dataset.use;
    const description = selectedProduct.dataset.description;

    const imagePath =
      selectedView === "front"
        ? selectedProduct.dataset.front
        : selectedProduct.dataset.back;

    productTitle.textContent = productName;
    productInfoTitle.textContent = productName;
    productDescription.textContent = description;
    productType.textContent = productTypeValue;
    productUse.textContent = productUseValue;

    productImage.classList.add("is-changing");

    window.setTimeout(() => {
      productImage.src = imagePath;
      productImage.alt = `${productName} ${selectedView} view`;
      productImage.classList.remove("is-changing");
    }, 160);

    quoteProduct.textContent = productName;
    quoteProductValue.value = productName;
  };

  const updateViewButtons = () => {
    viewButtons.forEach((button) => {
      const isActive = button.dataset.view === selectedView;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive.toString());
    });
  };

  const updateColours = () => {
    primaryValue.textContent = primaryInput.value.toUpperCase();
    secondaryValue.textContent = secondaryInput.value.toUpperCase();

    quoteMainColour.value = primaryInput.value.toUpperCase();
    quoteAccentColour.value = secondaryInput.value.toUpperCase();

    swatches.forEach((swatch) => {
      const isSelected =
        swatch.dataset.primary.toLowerCase() ===
          primaryInput.value.toLowerCase() &&
        swatch.dataset.secondary.toLowerCase() ===
          secondaryInput.value.toLowerCase();

      swatch.classList.toggle("is-selected", isSelected);
    });
  };

  const updateRequestDetails = () => {
    quoteSchoolText.value = schoolTextInput.value.trim() || "Not provided";

    quoteQuantity.value = quantityInput.value || "Not provided";
    quoteView.value = selectedView;

    quoteMessage.value = [
      `Product: ${quoteProductValue.value}`,
      `Main colour: ${quoteMainColour.value}`,
      `Accent colour: ${quoteAccentColour.value}`,
      `School text: ${quoteSchoolText.value}`,
      `Quantity: ${quoteQuantity.value}`,
      `Product view: ${selectedView}`,
      `Logo: ${quoteLogoName.value || "Not uploaded"}`,
    ].join("\n");
  };

  const resetLogo = () => {
    logoInput.value = "";
    logoFileName.textContent = "No file selected";
    quoteLogoName.value = "";
  };

  productSelect.addEventListener("change", () => {
    updateProductDetails();
    updateRequestDetails();
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedView = button.dataset.view;
      updateViewButtons();
      updateProductDetails();
      updateRequestDetails();
    });
  });

  primaryInput.addEventListener("input", () => {
    updateColours();
    updateRequestDetails();
  });

  secondaryInput.addEventListener("input", () => {
    updateColours();
    updateRequestDetails();
  });

  schoolTextInput.addEventListener("input", updateRequestDetails);
  quantityInput.addEventListener("input", updateRequestDetails);

  swatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      primaryInput.value = swatch.dataset.primary;
      secondaryInput.value = swatch.dataset.secondary;

      updateColours();
      updateRequestDetails();
    });
  });

  logoInput.addEventListener("change", () => {
    const selectedFile = logoInput.files[0];

    if (!selectedFile) {
      resetLogo();
      updateRequestDetails();
      return;
    }

    if (selectedFile.size > 5242880) {
      logoInput.value = "";
      logoFileName.textContent = "File is larger than 5MB";
      quoteLogoName.value = "";
      updateRequestDetails();
      return;
    }

    logoFileName.textContent = selectedFile.name;
    quoteLogoName.value = selectedFile.name;
    updateRequestDetails();
  });

  quoteButton.addEventListener("click", () => {
    updateRequestDetails();

    const quoteSection = document.querySelector("#custom-quote");

    quoteSection?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      document.querySelector("#quote-school-name")?.focus();
    }, 500);
  });

  resetButton.addEventListener("click", () => {
    productSelect.value = defaults.product;
    primaryInput.value = defaults.primary;
    secondaryInput.value = defaults.secondary;
    schoolTextInput.value = defaults.schoolText;
    quantityInput.value = defaults.quantity;
    selectedView = defaults.view;

    resetLogo();
    updateViewButtons();
    updateProductDetails();
    updateColours();
    updateRequestDetails();
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    quoteStatus.textContent =
      "Thank you. Your product request has been received. Our team will contact you shortly.";

    quoteForm.reset();

    productSelect.value = defaults.product;
    primaryInput.value = defaults.primary;
    secondaryInput.value = defaults.secondary;
    schoolTextInput.value = defaults.schoolText;
    quantityInput.value = defaults.quantity;
    selectedView = defaults.view;

    resetLogo();
    updateViewButtons();
    updateProductDetails();
    updateColours();
    updateRequestDetails();
  });

  updateViewButtons();
  updateProductDetails();
  updateColours();
  updateRequestDetails();
});

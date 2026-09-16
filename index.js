document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bulkBookingForm");
  const feedback = document.getElementById("bulkBookingFeedback");
  const stepTitle = document.getElementById("bulkStepTitle");

  const steps = [
    document.getElementById("bulkStep1"),
    document.getElementById("bulkStep2"),
    document.getElementById("bulkStep3"),
    document.getElementById("bulkStep4"),
  ];

  const indicators = [
    document.getElementById("stepIndicator1"),
    document.getElementById("stepIndicator2"),
    document.getElementById("stepIndicator3"),
    document.getElementById("stepIndicator4"),
  ];

  const stepTitles = [
    "Step 1: Select the required product categories.",
    "Step 2: Add quantity and customization needs.",
    "Step 3: Fill in school and contact information.",
    "Step 4: Confirm delivery details and final review.",
  ];

  const backBtn = document.getElementById("backStepBtn");
  const nextBtn = document.getElementById("nextStepBtn");
  const submitBtn = document.getElementById("submitStepBtn");

  const productInputs = document.querySelectorAll('input[name="products"]');
  const customizationInputs = document.querySelectorAll(
    'input[name="customization"]',
  );
  const quantityInput = document.getElementById("estimatedQuantity");

  const selectedProductsList = document.getElementById("selectedProductsList");
  const selectedCustomizationsList = document.getElementById(
    "selectedCustomizationsList",
  );
  const quantityCountEl = document.getElementById("selectedQuantityCount");
  const customizationCountEl = document.getElementById(
    "selectedCustomizationCount",
  );

  const reviewProductsCount = document.getElementById("reviewProductsCount");
  const reviewQuantityCount = document.getElementById("reviewQuantityCount");
  const reviewCustomizationCount = document.getElementById(
    "reviewCustomizationCount",
  );

  let currentStep = 0;

  function renderList(container, items, fallbackText) {
    if (!items.length) {
      container.innerHTML = `<li>${fallbackText}</li>`;
      return;
    }
    container.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  }

  function updateSummary() {
    const selectedProducts = [...productInputs]
      .filter((input) => input.checked)
      .map((input) => input.value);

    const selectedCustomizations = [...customizationInputs]
      .filter((input) => input.checked)
      .map((input) => input.value);

    const quantityValue = Number(quantityInput.value) || 0;

    renderList(
      selectedProductsList,
      selectedProducts,
      "No products selected yet",
    );
    renderList(
      selectedCustomizationsList,
      selectedCustomizations,
      "No customization selected yet",
    );

    quantityCountEl.textContent = quantityValue;
    customizationCountEl.textContent = selectedCustomizations.length;

    reviewProductsCount.textContent = `${selectedProducts.length} selected`;
    reviewQuantityCount.textContent = quantityValue;
    reviewCustomizationCount.textContent = `${selectedCustomizations.length} selected`;
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.hidden = i !== index;
      indicators[i].classList.toggle("active", i === index);
    });

    stepTitle.textContent = stepTitles[index];
    backBtn.hidden = index === 0;
    nextBtn.hidden = index === steps.length - 1;
    submitBtn.hidden = index !== steps.length - 1;
    feedback.textContent = "";
    currentStep = index;
  }

  function validateStep1() {
    const hasProducts = [...productInputs].some((input) => input.checked);
    if (!hasProducts) {
      feedback.textContent = "Please select at least one product category.";
      return false;
    }
    return true;
  }

  function validateStep2() {
    if (!quantityInput.checkValidity()) {
      quantityInput.reportValidity();
      return false;
    }
    return true;
  }

  function validateStep3() {
    const fields = [
      document.getElementById("schoolName"),
      document.getElementById("contactPerson"),
      document.getElementById("phoneNumber"),
      document.getElementById("emailAddress"),
      document.getElementById("schoolAddress"),
    ];

    const invalidField = fields.find((field) => !field.checkValidity());
    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus();
      return false;
    }
    return true;
  }

  function validateStep4() {
    const fields = [
      document.getElementById("requiredTimeline"),
      document.getElementById("deliveryMode"),
      document.getElementById("sizeBreakup"),
      document.getElementById("sampleRequired"),
    ];

    const invalidField = fields.find((field) => !field.checkValidity());
    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus();
      return false;
    }
    return true;
  }

  function validateCurrentStep() {
    if (currentStep === 0) return validateStep1();
    if (currentStep === 1) return validateStep2();
    if (currentStep === 2) return validateStep3();
    if (currentStep === 3) return validateStep4();
    return true;
  }

  [...productInputs, ...customizationInputs].forEach((input) => {
    input.addEventListener("change", updateSummary);
  });

  quantityInput.addEventListener("input", updateSummary);

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    showStep(currentStep + 1);
  });

  backBtn.addEventListener("click", () => {
    if (currentStep > 0) showStep(currentStep - 1);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateStep4()) return;

    const formData = new FormData(form);
    const selectedProducts = formData.getAll("products");

    feedback.style.color = "var(--primary)";
    feedback.textContent = `Bulk enquiry submitted for ${selectedProducts.join(", ")}.`;

    form.reset();
    updateSummary();
    showStep(0);
  });

  updateSummary();
  showStep(0);
});

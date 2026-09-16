const CART_STORAGE_KEY = "campusCraftCart";

document.addEventListener("DOMContentLoaded", () => {
  applySavedPreferences();
  createLucideIcons();
  initializeNavbar();
  initializeBackToTop();
  initializeSignatureCollections();
});

function createLucideIcons(root = document) {
  if (typeof lucide !== "undefined") {
    lucide.createIcons({ root });
  }
}

function setLucideIcon(element, iconName) {
  if (!element) {
    return;
  }

  element.replaceChildren();

  const icon = document.createElement("i");
  icon.setAttribute("data-lucide", iconName);

  element.appendChild(icon);
  createLucideIcons(element);
}

function getCartElements() {
  return {
    cartPanel: document.getElementById("cartPanel"),
    cartToggle: document.getElementById("cartToggle"),
    mobileCartToggle: document.getElementById("mobileCartToggle"),
    cartClose: document.getElementById("cartClose"),
    cartCount: document.getElementById("cartCount"),
    mobileCartCount: document.getElementById("mobileCartCount"),
    cartItems: document.getElementById("cartItems"),
    cartEmptyState: document.getElementById("cartEmptyState"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    buyNowBtn: document.getElementById("buyNowBtn"),
  };
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

function getCartData() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setCartData(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(
      new CustomEvent("campusCraftCartUpdated", {
        detail: { cart },
      }),
    );
  } catch (error) {
    console.warn("Unable to save cart data.", error);
  }
}

function updateCartCountUI(count) {
  const { cartCount, mobileCartCount } = getCartElements();

  if (cartCount) {
    cartCount.textContent = count;
    cartCount.hidden = count === 0;
    cartCount.setAttribute(
      "aria-label",
      `${count} item${count === 1 ? "" : "s"} in cart`,
    );
  }

  if (mobileCartCount) {
    mobileCartCount.textContent = count;
    mobileCartCount.hidden = count === 0;
    mobileCartCount.setAttribute(
      "aria-label",
      `${count} item${count === 1 ? "" : "s"} in cart`,
    );
  }
}

function formatPrice(value) {
  return `₹${Number(value).toFixed(2)}`;
}

function createCartItem(item, index) {
  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";

  if (item.image) {
    const thumb = document.createElement("div");
    thumb.className = "cart-item__thumb";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name || "Product";

    thumb.appendChild(image);
    cartItem.appendChild(thumb);
  }

  const info = document.createElement("div");
  info.className = "cart-item__info";

  const title = document.createElement("h4");
  title.textContent = item.name || "Product";

  const size = document.createElement("p");
  size.textContent = `Size: ${item.size || "N/A"}`;

  const quantity = document.createElement("div");
  quantity.className = "cart-item__qty";

  const decreaseButton = document.createElement("button");
  decreaseButton.className = "cart-qty-btn";
  decreaseButton.type = "button";
  decreaseButton.dataset.cartAction = "decrease";
  decreaseButton.dataset.cartIndex = index;
  decreaseButton.setAttribute("aria-label", "Decrease quantity");

  const decreaseIcon = document.createElement("i");
  decreaseIcon.setAttribute("data-lucide", "minus");
  decreaseButton.appendChild(decreaseIcon);

  const quantityValue = document.createElement("span");
  quantityValue.textContent = Number(item.quantity || 1);

  const increaseButton = document.createElement("button");
  increaseButton.className = "cart-qty-btn";
  increaseButton.type = "button";
  increaseButton.dataset.cartAction = "increase";
  increaseButton.dataset.cartIndex = index;
  increaseButton.setAttribute("aria-label", "Increase quantity");

  const increaseIcon = document.createElement("i");
  increaseIcon.setAttribute("data-lucide", "plus");
  increaseButton.appendChild(increaseIcon);

  quantity.append(decreaseButton, quantityValue, increaseButton);
  info.append(title, size, quantity);

  const meta = document.createElement("div");
  meta.className = "cart-item__meta";

  const price = document.createElement("strong");
  price.textContent = formatPrice(
    Number(item.price || 0) * Number(item.quantity || 1),
  );

  const removeButton = document.createElement("button");
  removeButton.className = "cart-item__remove";
  removeButton.type = "button";
  removeButton.dataset.cartAction = "remove";
  removeButton.dataset.cartIndex = index;
  removeButton.setAttribute(
    "aria-label",
    `Remove ${item.name || "product"} from cart`,
  );

  const removeIcon = document.createElement("i");
  removeIcon.setAttribute("data-lucide", "trash-2");

  const removeText = document.createElement("span");
  removeText.textContent = "Remove";

  removeButton.append(removeIcon, removeText);
  meta.append(price, removeButton);

  cartItem.append(info, meta);

  return cartItem;
}

function renderCartPreview() {
  const { cartItems, cartEmptyState, cartSubtotal } = getCartElements();
  const cart = getCartData();

  if (!cartItems || !cartEmptyState || !cartSubtotal) {
    return;
  }

  const totalQty = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );

  updateCartCountUI(totalQty);

  cartItems.replaceChildren();

  if (cart.length === 0) {
    cartItems.hidden = true;
    cartEmptyState.hidden = false;
    cartSubtotal.textContent = formatPrice(0);
    return;
  }

  cartEmptyState.hidden = true;
  cartItems.hidden = false;

  cart.forEach((item, index) => {
    cartItems.appendChild(createCartItem(item, index));
  });

  cartSubtotal.textContent = formatPrice(subtotal);
  createLucideIcons(cartItems);
}

function addItemToCart(product) {
  if (!product || !product.id || !product.name) {
    return false;
  }

  const cart = getCartData();
  const normalizedSize = product.size || "N/A";

  const existingItem = cart.find(
    (item) =>
      String(item.id) === String(product.id) &&
      String(item.size || "N/A") === String(normalizedSize),
  );

  if (existingItem) {
    existingItem.quantity = Number(existingItem.quantity || 1) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price || 0),
      image: product.image || "",
      size: normalizedSize,
      quantity: 1,
    });
  }

  setCartData(cart);
  renderCartPreview();

  return true;
}

function getProductFromButton(button) {
  return {
    id: button.dataset.id,
    name: button.dataset.name,
    price: button.dataset.price,
    image: button.dataset.image || "",
    size: button.dataset.size || "N/A",
  };
}

function bindAddToCartButtons() {
  const buttons = document.querySelectorAll("[data-add-to-cart]");

  buttons.forEach((button) => {
    if (button.dataset.cartBound === "true") {
      return;
    }

    button.dataset.cartBound = "true";

    button.addEventListener("click", () => {
      const wasAdded = addItemToCart(getProductFromButton(button));

      if (wasAdded) {
        openCartPanel();
      }
    });
  });
}

function applySavedPreferences() {
  const savedTheme = getStorageItem("theme", "light");
  const savedDir = getStorageItem("dir", "ltr");

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
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  if (darkToggle) {
    setLucideIcon(
      darkToggle,
      document.body.classList.contains("dark-mode") ? "sun" : "moon",
    );
  }

  if (menuToggle) {
    const isActive = navLinks ? navLinks.classList.contains("active") : false;
    setLucideIcon(menuToggle, isActive ? "x" : "menu");
  }
}

function initializeNavbar() {
  const darkToggle = document.getElementById("darkToggle");
  const rtlToggle = document.getElementById("rtlToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");
  const mobileLogin = document.querySelector(".mobile-login");
  const dropdowns = document.querySelectorAll(".dropdown");

  setActiveNavLink();
  updateToggleIcons();

  if (darkToggle) {
    setupDarkMode(darkToggle);
  }

  if (rtlToggle) {
    setupRTL(rtlToggle);
  }

  if (menuToggle && navLinks) {
    setupMobileMenu(menuToggle, navLinks, mobileLogin, dropdowns);
  }

  setupMobileDropdowns(dropdowns);
  setupCartPanel();
  bindBuyNowButton();
  bindAddToCartButtons();
  renderCartPreview();
}

function setActiveNavLink() {
  const currentPage =
    window.location.pathname.split("/").pop().toLowerCase() || "index.html";

  const allLinks = document.querySelectorAll(".nav-links a");
  const dropdowns = document.querySelectorAll(".dropdown");

  allLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  let homeTrigger = null;
  let productsTrigger = null;

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(":scope > a");

    if (!trigger) {
      return;
    }

    const triggerText = trigger.textContent.trim().toLowerCase();

    if (triggerText.includes("home")) {
      homeTrigger = trigger;
    }

    if (triggerText.includes("products")) {
      productsTrigger = trigger;
    }
  });

  const homePages = ["index.html", "home1.html", "home2.html"];

  const productPages = [
    "collection.html",
    "school-uniforms.html",
    "sportswear.html",
    "accessories.html",
  ];

  if (homePages.includes(currentPage)) {
    if (homeTrigger) {
      homeTrigger.classList.add("active");
      homeTrigger.setAttribute("aria-current", "page");
    }
    return;
  }

  if (productPages.includes(currentPage)) {
    if (productsTrigger) {
      productsTrigger.classList.add("active");
      productsTrigger.setAttribute("aria-current", "page");
    }
    return;
  }

  allLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href === "#" || href.startsWith("javascript:")) {
      return;
    }

    const linkPage = new URL(link.href, window.location.origin).pathname
      .split("/")
      .pop()
      .toLowerCase();

    if (linkPage === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function setupDarkMode(darkToggle) {
  if (darkToggle.dataset.bound === "true") {
    return;
  }

  darkToggle.dataset.bound = "true";

  darkToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");

    setStorageItem("theme", isDark ? "dark" : "light");
    updateToggleIcons();
    updateLogos();
  });
}

function setupRTL(rtlToggle) {
  if (rtlToggle.dataset.bound === "true") {
    return;
  }

  rtlToggle.dataset.bound = "true";

  rtlToggle.addEventListener("click", () => {
    const newDir = document.documentElement.dir === "rtl" ? "ltr" : "rtl";

    document.documentElement.dir = newDir;
    setStorageItem("dir", newDir);
  });
}

function setupMobileMenu(menuToggle, navLinks, mobileLogin, dropdowns) {
  if (menuToggle.dataset.bound === "true") {
    return;
  }

  menuToggle.dataset.bound = "true";

  menuToggle.addEventListener("click", () => {
    const isActive = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isActive ? "true" : "false");

    if (mobileLogin) {
      mobileLogin.classList.toggle("active", isActive);
    }

    setLucideIcon(menuToggle, isActive ? "x" : "menu");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");

      if (mobileLogin) {
        mobileLogin.classList.remove("active");
      }

      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");

        const trigger = dropdown.querySelector(":scope > a");

        if (trigger) {
          trigger.setAttribute("aria-expanded", "false");
        }
      });

      setLucideIcon(menuToggle, "menu");
    }
  });
}

function setupMobileDropdowns(dropdowns) {
  dropdowns.forEach((dropdown) => {
    const topLink = dropdown.querySelector(":scope > a");

    if (!topLink || topLink.dataset.bound === "true") {
      return;
    }

    topLink.dataset.bound = "true";

    topLink.setAttribute(
      "aria-expanded",
      dropdown.classList.contains("active") ? "true" : "false",
    );

    topLink.addEventListener("click", (event) => {
      if (
        window.innerWidth <= 1024 &&
        dropdown.querySelector(".dropdown-menu")
      ) {
        event.preventDefault();

        dropdowns.forEach((item) => {
          if (item !== dropdown) {
            item.classList.remove("active");

            const otherLink = item.querySelector(":scope > a");

            if (otherLink) {
              otherLink.setAttribute("aria-expanded", "false");
            }
          }
        });

        const isOpen = dropdown.classList.toggle("active");
        topLink.setAttribute("aria-expanded", isOpen ? "true" : "false");
      }
    });
  });
}

function syncCartPanelState(isOpen) {
  const { cartPanel, cartToggle, mobileCartToggle } = getCartElements();

  if (!cartPanel) {
    return;
  }

  cartPanel.hidden = !isOpen;
  cartPanel.classList.toggle("active", isOpen);
  cartPanel.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("cart-open", isOpen);

  if (cartToggle) {
    cartToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (mobileCartToggle) {
    mobileCartToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

function openCartPanel() {
  syncCartPanelState(true);
}

function closeCartPanel() {
  syncCartPanelState(false);
}

function setupCartPanel() {
  const { cartPanel, cartToggle, mobileCartToggle, cartClose, cartItems } =
    getCartElements();

  if (!cartPanel) {
    return;
  }

  if (cartToggle && cartToggle.dataset.bound !== "true") {
    cartToggle.dataset.bound = "true";

    cartToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      syncCartPanelState(cartPanel.hidden);
    });
  }

  if (mobileCartToggle && mobileCartToggle.dataset.bound !== "true") {
    mobileCartToggle.dataset.bound = "true";

    mobileCartToggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      syncCartPanelState(cartPanel.hidden);
    });
  }

  if (cartClose && cartClose.dataset.bound !== "true") {
    cartClose.dataset.bound = "true";

    cartClose.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeCartPanel();
    });
  }

  if (cartPanel.dataset.bound !== "true") {
    cartPanel.dataset.bound = "true";

    cartPanel.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

  if (cartItems && cartItems.dataset.bound !== "true") {
    cartItems.dataset.bound = "true";

    cartItems.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-cart-action]");

      if (!actionButton) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const action = actionButton.dataset.cartAction;
      const index = Number(actionButton.dataset.cartIndex);
      const cart = getCartData();

      if (Number.isNaN(index) || !cart[index]) {
        return;
      }

      if (action === "increase") {
        cart[index].quantity = Number(cart[index].quantity || 1) + 1;
      }

      if (action === "decrease") {
        cart[index].quantity = Number(cart[index].quantity || 1) - 1;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }
      }

      if (action === "remove") {
        cart.splice(index, 1);
      }

      setCartData(cart);
      renderCartPreview();
      openCartPanel();
    });
  }

  if (document.documentElement.dataset.cartGlobalBound !== "true") {
    document.documentElement.dataset.cartGlobalBound = "true";

    document.addEventListener("click", (event) => {
      const { cartPanel, cartToggle, mobileCartToggle } = getCartElements();

      if (!cartPanel || cartPanel.hidden) {
        return;
      }

      const clickedInsidePanel = cartPanel.contains(event.target);
      const clickedDesktopToggle =
        cartToggle && cartToggle.contains(event.target);
      const clickedMobileToggle =
        mobileCartToggle && mobileCartToggle.contains(event.target);

      if (
        !clickedInsidePanel &&
        !clickedDesktopToggle &&
        !clickedMobileToggle
      ) {
        closeCartPanel();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeCartPanel();
      }
    });

    window.addEventListener("storage", (event) => {
      if (event.key === CART_STORAGE_KEY) {
        renderCartPreview();
      }
    });

    window.addEventListener("campusCraftCartUpdated", () => {
      renderCartPreview();
    });
  }

  renderCartPreview();
  syncCartPanelState(false);
}

function bindBuyNowButton() {
  const { buyNowBtn } = getCartElements();

  if (!buyNowBtn || buyNowBtn.dataset.bound === "true") {
    return;
  }

  buyNowBtn.dataset.bound = "true";

  buyNowBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const cart = getCartData();

    if (!cart.length) {
      alert("Your cart is empty.");
      return;
    }

    const confirmed = confirm("Are you sure you want to place this order?");

    if (!confirmed) {
      return;
    }

    setCartData([]);
    renderCartPreview();
    updateCartCountUI(0);
    closeCartPanel();

    alert("Your order was placed successfully!");
  });
}

function initializeBackToTop() {
  const topBtn = document.querySelector(".top-btn");

  if (!topBtn || topBtn.dataset.bound === "true") {
    return;
  }

  topBtn.dataset.bound = "true";

  topBtn.addEventListener("click", (event) => {
    event.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function updateLogos() {
  const headerLogo = document.getElementById("headerLogo");
  const footerLogo = document.getElementById("footerLogo");

  const isDarkMode = document.body.classList.contains("dark-mode");
  const logoPath = isDarkMode ? "./images/logo1.png" : "./images/logo.png";

  if (headerLogo) {
    headerLogo.src = logoPath;
  }

  if (footerLogo) {
    footerLogo.src = logoPath;
  }
}

function initializeSignatureCollections() {
  const section = document.querySelector(".signature-collections");

  if (!section) {
    return;
  }

  initializeSignatureCollectionTabs(section);
  initializeSignatureBuyNowButtons(section);
  initializeSignatureAddToCartFeedback(section);
}

function initializeSignatureCollectionTabs(section) {
  const tabs = section.querySelectorAll(".signature-collections__tab");
  const panels = section.querySelectorAll(".signature-collections__panel");

  if (!tabs.length || !panels.length) {
    return;
  }

  tabs.forEach((tab) => {
    if (tab.dataset.signatureTabBound === "true") {
      return;
    }

    tab.dataset.signatureTabBound = "true";

    tab.addEventListener("click", () => {
      const selectedCategory = tab.dataset.category;

      tabs.forEach((item) => {
        const isSelected = item === tab;

        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-selected", String(isSelected));
        item.tabIndex = isSelected ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isSelected = panel.dataset.panel === selectedCategory;

        panel.classList.toggle("is-active", isSelected);
        panel.hidden = !isSelected;
      });

      createLucideIcons(section);
    });
  });
}

function initializeSignatureBuyNowButtons(section) {
  const buyNowButtons = section.querySelectorAll("[data-buy-now]");

  buyNowButtons.forEach((button) => {
    if (button.dataset.signatureBuyBound === "true") {
      return;
    }

    button.dataset.signatureBuyBound = "true";

    button.addEventListener("click", () => {
      const wasAdded = addItemToCart(getProductFromButton(button));

      if (wasAdded) {
        openCartPanel();
      }
    });
  });
}

function initializeSignatureAddToCartFeedback(section) {
  const addButtons = section.querySelectorAll("[data-add-to-cart]");

  addButtons.forEach((button) => {
    if (button.dataset.signatureFeedbackBound === "true") {
      return;
    }

    button.dataset.signatureFeedbackBound = "true";

    button.addEventListener("click", () => {
      const label = button.querySelector("span");

      if (!label || button.classList.contains("is-added")) {
        return;
      }

      const originalLabel = label.textContent;

      button.classList.add("is-added");
      label.textContent = "Added";

      window.setTimeout(() => {
        button.classList.remove("is-added");
        label.textContent = originalLabel;
      }, 1500);
    });
  });
}

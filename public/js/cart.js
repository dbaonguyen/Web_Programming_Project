function addToCart(event) {
  event.preventDefault();

  var productElement = event.target.closest(".product-wrapper");

  var productImage;
  var productName;
  var productPrice;

  // Check for the first HTML structure
  if (productElement.querySelector(".product-img-2")) {
    productImage = productElement.querySelector(".product-img-2 img").src;
    productName = productElement
      .querySelector(".product-content-2 h4 a")
      .textContent.trim();
    productPrice = productElement
      .querySelector(".product-content-2 span")
      .textContent.trim();
  }
  // Check for the second HTML structure
  else if (productElement.querySelector(".product-img")) {
    productImage = productElement.querySelector(".product-img img").src;
    productName = productElement
      .querySelector(".product-content h4 a")
      .textContent.trim();
    productPrice = productElement
      .querySelector(".product-content span")
      .textContent.trim();
  } else {
    // Neither structure recognized, so exit function
    return;
  }

  // Check if product already exists in cart
  var existingProduct = document.querySelector(
    `.cart-item[data-product-name="${productName}"]`
  );
  if (existingProduct) {
    // If product exists, simply return (in this simple cart we don't add duplicates)
    return;
  } else {
    // Clone the product template and fill in the product details
    var cartTable = document.querySelector(".showcart table");
    var newRow = document.querySelector(".cart-item-template").cloneNode(true);
    newRow.style.display = "";
    newRow.classList.remove("cart-item-template");
    newRow.classList.add("cart-item");
    newRow.dataset.productName = productName;

    newRow.querySelector(".product-thumbnail img").src = productImage;
    newRow.querySelector(".product-name a").textContent = productName;
    newRow.querySelector(".product-price-cart .amount").textContent =
      productPrice;

    // Append new product to cart table
    cartTable.appendChild(newRow);
  }

  // Update the cart count
  var cartCountElement = document.querySelector(".shop-count.book-count");
  var currentCount = parseInt(cartCountElement.textContent);
  currentCount += 1;
  cartCountElement.textContent = currentCount;
  document.querySelector(".empty-cart-message").style.display = "none";
  saveCartToLocalStorage();
  updateEmptyCartMessage();
  toggleRemoveAllButton();
}

function saveCartToLocalStorage() {
  var cartItems = document.querySelectorAll(
    ".cart-item:not(.cart-item-template)"
  );
  var cartData = [];
  cartItems.forEach((item) => {
    var product = {
      name: item.dataset.productName,
      image: item.querySelector(".product-thumbnail img").src,
      price: item.querySelector(".product-price-cart .amount").textContent,
    };
    cartData.push(product);
  });
  localStorage.setItem("cartData", JSON.stringify(cartData));
}

var cart = document.querySelector(".showcart");

function showCart() {
  if (cart.style.display === "none" || cart.style.display === "") {
    cart.style.display = "block";
  }
}

function hideCart() {
  if (cart.style.display === "block") {
    cart.style.display = "none";
  }
}

function showMyCart() {}

document.addEventListener("DOMContentLoaded", function () {
  var productsInCart = document.querySelectorAll(".cart-item");
  if (productsInCart.length === 0) {
    document.querySelector(".empty-cart-message").style.display = "";
  }
  loadCartFromLocalStorage();
});

function loadCartFromLocalStorage() {
  var cartData = JSON.parse(localStorage.getItem("cartData") || "[]");
  cartData.forEach((product) => {
    addProductToCart(product);
  });
  updateEmptyCartMessage();
}

function addProductToCart(product) {
  var cartTable = document.querySelector(".showcart table");
  var newRow = document.querySelector(".cart-item-template").cloneNode(true);
  newRow.style.display = "";
  newRow.classList.remove("cart-item-template");
  newRow.classList.add("cart-item");
  newRow.dataset.productName = product.name;

  newRow.querySelector(".product-thumbnail img").src = product.image;
  newRow.querySelector(".product-name a").textContent = product.name;
  newRow.querySelector(".product-price-cart .amount").textContent =
    product.price;

  cartTable.appendChild(newRow);

  var cartCountElement = document.querySelector(".shop-count.book-count");
  var currentCount = parseInt(cartCountElement.textContent);
  currentCount += 1;
  cartCountElement.textContent = currentCount;
}

function updateEmptyCartMessage() {
  var productsInCart = document.querySelectorAll(
    ".cart-item:not(.cart-item-template)"
  );
  if (productsInCart.length === 0) {
    document.querySelector(".empty-cart-message").style.display = "";
  } else {
    document.querySelector(".empty-cart-message").style.display = "none";
  }
  toggleRemoveAllButton();
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("remove-product")) {
    var productRow = e.target.closest(".cart-item");
    productRow.remove();

    // Cập nhật số lượng sản phẩm và thông báo "No product here!"
    updateCartCount();
    updateEmptyCartMessage();
    saveCartToLocalStorage(); // Lưu trạng thái giỏ hàng sau khi xóa sản phẩm
  }
});

function updateCartCount() {
  var cartCountElement = document.querySelector(".shop-count.book-count");
  var currentCount = document.querySelectorAll(
    ".cart-item:not(.cart-item-template)"
  ).length;
  cartCountElement.textContent = currentCount;
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("clear-cart")) {
    var cartItems = document.querySelectorAll(
      ".cart-item:not(.cart-item-template)"
    );
    cartItems.forEach((item) => {
      item.remove();
    });

    // Cập nhật số lượng sản phẩm và thông báo "No product here!"
    updateCartCount();
    updateEmptyCartMessage();
    saveCartToLocalStorage(); // Lưu trạng thái giỏ hàng sau khi xóa toàn bộ sản phẩm
  }
});

function toggleRemoveAllButton() {
  var productsInCart = document.querySelectorAll(
    ".cart-item:not(.cart-item-template)"
  );
  var removeAllButton = document.querySelector(".clear-cart");
  if (productsInCart.length === 0) {
    removeAllButton.style.display = "none";
  } else {
    removeAllButton.style.display = "block";
  }
}

function loadCartToTable() {
  // Get the cart data from Local Storage
  var cartData = JSON.parse(localStorage.getItem("cartData") || "[]");

  // Get the tbody element
  var tbody = document.querySelector(".table-content table tbody");

  // Clear any existing rows
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Populate the tbody with cart data
  cartData.forEach((product) => {
    var tr = document.createElement("tr");

    // Remove button column
    var removeTd = document.createElement("td");
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-product");
    removeButton.onclick = function () {
      tr.remove();
      removeFromLocalStorage(product.name);
      loadCartToTable();
    };
    removeTd.appendChild(removeButton);
    tr.appendChild(removeTd);

    // Image column
    var imageTd = document.createElement("td");
    var img = document.createElement("img");
    img.src = product.image;
    img.width = 85;
    img.height = 101;
    imageTd.appendChild(img);
    tr.appendChild(imageTd);

    // Product name column
    var nameTd = document.createElement("td");
    nameTd.textContent = product.name;
    tr.appendChild(nameTd);

    // Price column
    var priceTd = document.createElement("td");
    priceTd.textContent = product.price;
    tr.appendChild(priceTd);

    // Quantity column (assuming a default of 1 for simplicity)
    var quantityTd = document.createElement("td");
    quantityTd.textContent = "1"; // You might want to extend your cart data to include quantity
    tr.appendChild(quantityTd);

    // Total column (assuming total = price * quantity)
    var totalTd = document.createElement("td");
    totalTd.textContent = product.price; // You might want to multiply by quantity if you store that data
    tr.appendChild(totalTd);

    // Add the row to the tbody
    tbody.appendChild(tr);
    updateCartTotals();
  });
}

// Load cart data when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadCartToTable();
});

function removeFromLocalStorage(productName) {
  var cartData = JSON.parse(localStorage.getItem("cartData") || "[]");
  var updatedCartData = cartData.filter(
    (product) => product.name !== productName
  );
  localStorage.setItem("cartData", JSON.stringify(updatedCartData));
}

function updateCartTotals() {
  var cartData = JSON.parse(localStorage.getItem("cartData") || "[]");
  var subtotal = 0;

  // Calculate subtotal
  cartData.forEach((product) => {
    // Assuming price is stored as a string in the format "$xx.xx"
    subtotal += parseFloat(product.price.replace("$", ""));
  });

  // Get the current coupon code
  var couponCode = document.getElementById("coupon_code").value;

  var total;
  if (couponCode === "COUPON50") {
    total = subtotal * 0.5; // 50% discount
  } else {
    total = subtotal;
  }

  // Update on the page
  document.querySelector(
    ".cart-page-total ul li:nth-child(1) span"
  ).textContent = subtotal.toFixed(2);
  document.querySelector(
    ".cart-page-total ul li:nth-child(2) span"
  ).textContent = total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", function () {
  loadCartToTable();
  // Event for Apply Coupon
  document
    .querySelector('input[name="apply_coupon"]')
    .addEventListener("click", function (e) {
      e.preventDefault();
      updateCartTotals();
    });

  // Event for Update Cart
  document
    .querySelector('input[name="update_cart"]')
    .addEventListener("click", function (e) {
      e.preventDefault();
      updateCartTotals();
    });
});

document.addEventListener("DOMContentLoaded", function () {
  // Event for Checkout
  document
    .querySelector(".cart-page-total a")
    .addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default link action

      // Clear all products from the cart (cart page)
      var cartPageItems = document.querySelectorAll(
        ".table-content table tbody tr"
      );
      cartPageItems.forEach((item) => {
        item.remove();
      });

      // Clear all products from the mini cart
      var miniCartItems = document.querySelectorAll(
        ".cart-item:not(.cart-item-template)"
      );
      miniCartItems.forEach((item) => {
        item.remove();
      });

      // Update cart count and other relevant displays
      updateCartCount();
      updateEmptyCartMessage();

      // Clear the cart from local storage
      localStorage.removeItem("cartData");

      // Reset cart totals
      document.querySelector(
        ".cart-page-total ul li:nth-child(1) span"
      ).textContent = "0";
      document.querySelector(
        ".cart-page-total ul li:nth-child(2) span"
      ).textContent = "0";

      // Show the notification
      var notification = document.getElementById("notification");
      notification.classList.remove("hidden");

      // Hide the notification after 3 seconds (3000 milliseconds)
      setTimeout(function () {
        notification.classList.add("hidden");
      }, 3000);
    });
});

var addToCartButtons = document.querySelectorAll(
  ".product-action .animate-top"
);
addToCartButtons.forEach(function (button) {
  button.addEventListener("click", addToCart);
});

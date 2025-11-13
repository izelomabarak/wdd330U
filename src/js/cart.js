import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter } from "./ShoppingCart.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  cartItemTotalCost(cartItems);
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function cartItemTotalCost(cartItems) {
  let total = 0;
  cartItems.forEach((item) => {
    let cost = parseFloat(item.FinalPrice);
    total = total + cost;
  });

  document.querySelector(".cart_total").innerHTML = `$${total}`;
  const classTotalShow = document.querySelector(".cart_footer");
  classTotalShow.classList.remove("cart_footer");
  classTotalShow.classList.toggle("cart_footer_show");
}

renderCartContents();

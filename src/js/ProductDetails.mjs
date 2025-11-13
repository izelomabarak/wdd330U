import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource){
  this.productId = productId;
  this.product = {};
  this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.asyncaddProductToCart.bind(this));
  }

  asyncaddProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails () {
    productDetails(this.product)
  }

}
  function productDetails(product) {
    document.querySelector("#show").innerHTML = `<section class="product-detail">
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <img class="divider" src="${product.Image}" alt="${product.Name}"/>
    <p class="product-card__price">$${product.ListPrice}</p>
    <p class="product__color">${product.Colors.ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
        <button id="addToCart" data-id="344YJ">Add to Cart</button>
    </div>
    </section>
    `;
  }
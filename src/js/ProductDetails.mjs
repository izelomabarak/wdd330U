import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource){
  this.productId = productId;
  this.product = {};
  this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    console.log(this.product);
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
    <h2>${product.Category.charAt(0).toUpperCase()} ${product.Category.slice(1)}</h2>
    <h3>${product.Brand.Name}</h3>
    <h2 class="divider">${product.NameWithoutBrand}</h2>
    <picture>
    <source media="(min-width: 1200px)" srcset="${product.Images.PrimaryExtraLarge}">
    <source media="(min-width: 800px)" srcset="${product.Images.PrimaryLarge}">
    <source media="(min-width: 480px)" srcset="${product.Images.PrimaryMedium}">
    <img class="divider" src="${product.Images.PrimarySmall}" alt="${product.NameWithoutBrand}"/>
    </picture>     
    <p class="product-card__price">$${new Intl.NumberFormat('de-DE',{ style: 'currency', currency: 'EUR',}).format(Number(product.FinalPrice) * 0.85)}</p>
    <p class="product__color">${product.Colors[0].ColorName}</p>
    <p class="product__description">${product.DescriptionHtmlSimple}</p>
    <div class="product-detail__add">
        <button id="addToCart" data-id=${product.Id}>Add to Cart</button>
    </div>
    </section>
    `;
  }

  // <picture>
  // <source media="(min-width: 1200px)" srcset="${product.Images.PrimaryExtraLarge}">
  // <source media="(min-width: 800px)" srcset="${product.Images.PrimaryLarge}">
  // <source media="(min-width: 480px)" srcset="${product.Images.PrimaryMedium}">
  // <img class="divider" src="${product.Images.PrimaryExtraLarge}" alt="${product.PrimarySmall}"/>
  // </picture>
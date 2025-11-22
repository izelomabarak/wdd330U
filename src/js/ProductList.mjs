import { renderListWithTemplate } from "./utils.mjs";

function productShow(product) {
    return `<li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <picture>
        <source media="(min-width: 1200px)" srcset="${product.Images.PrimaryExtraLarge}">
        <source media="(min-width: 800px)" srcset="${product.Images.PrimaryLarge}">
        <source media="(min-width: 480px)" srcset="${product.Images.PrimaryMedium}">
        <img class="divider" src="${product.Images.PrimarySmall}" alt="${product.NameWithoutBrand}"/>
        </picture>             
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
    `;
}

export default class ProductList {

  constructor(category, dataSource, listElement){
  this.category = category;
  this.dataSource = dataSource;
  this.listElement = listElement;
  }

  async init() {
    const list = await this.dataSource.getData(this.category);
    this.renderProductDetails(list);
    document.querySelector(".title").textContent = this.category;
 }

 renderProductDetails(list) {
    renderListWithTemplate(productShow, this.listElement, list);
 }

}

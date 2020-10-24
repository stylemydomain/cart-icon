
import {AppElement, html} from '@smyd/app-shared/app-element.js';
import {
  listen, 
  wait
}                 from '@smyd/app-functions/utils.js';
import htmlString from './cart-icon.html';
import '@smyd/app-shared/app-icons.js';
import '@polymer/paper-badge/paper-badge.js';
import '@polymer/paper-icon-button/paper-icon-button.js';


class CartIcon extends AppElement {
  static get is() { return 'cart-icon'; }

  static get template() {
    return html([htmlString]);
  }


  static get properties() {
    return {

      cartQuanity: Number,
      // Use in cases such as buylist, where
      // consumer wants to control the overlay opening logic
      disableOpenEvent: Boolean,

      icon: {
        type: String,
        value: 'app-icons:cart'
      },

      showLabel: Boolean
      
    };
  }
  

  async connectedCallback() {
    super.connectedCallback();
    // fixes badge text misalignment in ios safari
    const badges = this.selectAll('.badges');
    badges.forEach(badge => {
      const text = this.select('#badge-text', badge);
      // match line-hight with default hight of container to vertically center text in its span
      text.style['line-height'] = '11px'; // default paper-badge hight
    });
    // wait for cart badge at home screen starting in wrong position
    await wait(100);
    this.$.cartBadge.notifyResize();
    this.cartQuanity   = 0;
    this.style.opacity = '1'; // wait til badge is correctly positioned in relation to its button

    if (!this.disableOpenEvent) {
      listen(this, 'click', this.__openCart.bind(this));
    }
  }


  __computeCartBadgeClass(number) {
    return number ? 'show-cart-badge' : '';
  }


  __computeCartBadgeWarn(label) {
    return label ? 'show-cart-badge' : '';
  }


  async __openCart() {
    try {
      if (this.disableOpenEvent) { return; }
      await this.clicked();
      this.fire('open-overlay', {id: 'cart'});
    }
    catch (error) {
      if (error === 'click debounced') { return; }
      console.error('__cartIconOpenCart', error);
    }
  }

}

window.customElements.define(CartIcon.is, CartIcon);

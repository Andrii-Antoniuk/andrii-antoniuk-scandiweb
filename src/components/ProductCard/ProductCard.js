import React from 'react';
import { connect, shallowEqual } from 'react-redux';
import {
  changeActivePage,
  changeActiveProduct,
} from '../../features/activeSlice';
import { addProductToCart, changeCount } from '../../features/cartSlice';
import { ReactComponent as CartClick } from '../../images/cartBuy.svg';
import { toCamelCase } from '../../utils/toCamelCase';
import Price from '../Price/Price';
import './ProductCard.css';

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleClickToPage = this.handleClickToPage.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  handleClickToPage(event) {
    if (event.target.tagName !== 'circle' && event.target.tagName !== 'path') {
      this.props.dispatch(changeActivePage('pdp'));
      this.props.dispatch(changeActiveProduct(this.props.product.id));
    }
  }

  handleAddToCart() {
    let myAttributes = {};
    const attributesKeys = this.props.product.attributes.map((attribute) =>
      toCamelCase(attribute.id)
    );
    for (let i = 0; i < attributesKeys.length; i++) {
      myAttributes[attributesKeys[i]] =
        this.props.product.attributes[i].items[0].id;
    }

    const sameProduct = Object.values(this.props.cartProducts).find(
      (cartProduct) =>
        cartProduct.product.name === this.props.product.name &&
        shallowEqual(cartProduct.attributes, myAttributes)
    );
    if (sameProduct) {
      this.props.dispatch(changeCount({ id: sameProduct.id, change: 1 }));
    } else
      this.props.dispatch(
        addProductToCart({
          product: this.props.product,
          attributes: myAttributes,
        })
      );
  }

  productAddCheck() {
    return !this.props.product.inStock ? (
      <div>Out of stock</div>
    ) : this.props.whichHovered === this.props.product.id ? (
      <CartClick onClick={this.handleAddToCart} />
    ) : (
      <CartClick />
    );
  }

  render() {
    return (
      this.props.product && (
        <div
          className={`product-card ${this.props.product.id} ${
            this.props.product.inStock ? '' : ' not-available'
          }`}
          key={this.props.product.name}
          onMouseEnter={this.props.handleEnter}
          onMouseLeave={this.props.handleLeave}
          onClick={this.handleClickToPage}
        >
          <div className="image-card">
            <img
              src={this.props.product.gallery[0]}
              alt={this.props.product.name}
            />
          </div>
          <span>
            {this.props.product.brand} {this.props.product.name}
          </span>
          {this.props.product && (
            <span>
              <Price
                prices={this.props.product.prices}
                currency={this.props.active.currency}
              />
            </span>
          )}
          {this.productAddCheck()}
        </div>
      )
    );
  }
}

const mapStateToProps = (state) => {
  const { active, cart } = state;
  return { active: active.active, cartProducts: cart.cart };
};

export default connect(mapStateToProps)(ProductCard);

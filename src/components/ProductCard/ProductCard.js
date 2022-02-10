import React from 'react';
import { connect, shallowEqual } from 'react-redux';
import {
  changeActivePage,
  changeActiveProduct,
} from '../../features/activeSlice';
import { addProductToCart, changeCount } from '../../features/cartSlice';
import { ReactComponent as CartClick } from '../../images/cartBuy.svg';
import { toCamelCase } from '../../utils/toCamelCase';
import './ProductCard.css';

class ProductCard extends React.Component {
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
          onClick={(event) => {
            if (
              event.target.tagName !== 'circle' &&
              event.target.tagName !== 'path'
            ) {
              this.props.dispatch(changeActivePage('pdp'));
              this.props.dispatch(changeActiveProduct(this.props.product.id));
            }
          }}
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
          <span>
            {Object.values(
              Object.values(this.props.product.prices).filter(
                (elementObj) =>
                  elementObj.currency.label === this.props.active.currency.label
              )[0]
            )
              .slice(-2)
              .map((element) => {
                if (typeof element === 'number' && isFinite(element)) {
                  return element;
                }
                return element.symbol;
              })}
          </span>
          {!this.props.product.inStock ? (
            <div>Out of stock</div>
          ) : this.props.whichHovered === this.props.product.id ? (
            <CartClick
              style={{ opacity: 1 }}
              onClick={() => {
                let myAttributes = {};
                const attributesKeys = this.props.product.attributes.map(
                  (attribute) => toCamelCase(attribute.id)
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
                  this.props.dispatch(
                    changeCount({ id: sameProduct.id, change: 1 })
                  );
                } else
                  this.props.dispatch(
                    addProductToCart({
                      product: this.props.product,
                      attributes: myAttributes,
                    })
                  );
              }}
            />
          ) : (
            <CartClick style={{ opacity: 0 }} />
          )}
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

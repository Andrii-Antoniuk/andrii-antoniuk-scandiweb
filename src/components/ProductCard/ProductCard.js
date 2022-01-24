import React from 'react';
import { ReactComponent as CartClick } from '../../images/cartBuy.svg';
import './ProductCard.css';

export class ProductCard extends React.Component {
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
              this.props.pageChange();
              this.props.productChange(this.props.product.id);
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
              Object.values(
                this.props.product.prices.filter(
                  (elementObj) =>
                    elementObj.currency.label === this.props.activeCurrency
                )[0]
              )
                .slice(-2)
                .map((element) => {
                  if (typeof element === 'number' && isFinite(element)) {
                    return element;
                  }
                  return element.symbol;
                })
            )}
          </span>
          {!this.props.product.inStock ? (
            <div>Out of stock</div>
          ) : this.props.whichHovered === this.props.product.id ? (
            <CartClick style={{ opacity: 1 }} />
          ) : (
            <CartClick style={{ opacity: 0 }} />
          )}
        </div>
      )
    );
  }
}

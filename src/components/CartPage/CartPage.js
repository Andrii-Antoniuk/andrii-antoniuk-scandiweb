import React from 'react';
import { ReactComponent as Plus } from '../../images/plus.svg';
import { ReactComponent as Minus } from '../../images/minus.svg';
import { toCamelCase } from '../../utils/toCamelCase';
import './CartPage.css';
import { connect } from 'react-redux';
import { changeCount } from '../../features/cartSlice';

class CartPage extends React.Component {
  render() {
    return this.props.products.length !== 0 ? (
      <div className="page">
        <div className="cart">
          <div className="cart-info">
            <h2>Cart</h2>
            {Object.values(this.props.products).map((myProduct) => {
              const product = myProduct.product;
              const attributes = myProduct.attributes;
              return (
                <div className="cart-product" key={myProduct.id}>
                  <div className="product-attributes">
                    <h3>{product.brand}</h3>
                    <h4>{product.name}</h4>
                    <span>
                      {Object.values(
                        Object.values(
                          product.prices.filter((elementObj) => {
                            return (
                              elementObj.currency.label ===
                              this.props.active.currency.label
                            );
                          })[0]
                        )
                          .slice(-2)
                          .map((price) => {
                            if (typeof price === 'number' && isFinite(price)) {
                              return price;
                            }
                            return price.symbol;
                          })
                      )}
                    </span>
                    {product.attributes.map((attribute) => (
                      <div key={attribute.id} className="attributes">
                        {attribute.id}
                        <div className="attribute">
                          {attribute.type === 'swatch'
                            ? attribute.items.map((item) => {
                                return (
                                  <div
                                    key={`swatch ` + item.id}
                                    className={`attribute-value swatch${
                                      attributes[toCamelCase(attribute.id)] ===
                                      item.id
                                        ? ' active'
                                        : ''
                                    }`}
                                    style={{ backgroundColor: item.value }}
                                    title={item.id}
                                  ></div>
                                );
                              })
                            : attribute.items.map((item) => {
                                return (
                                  <div
                                    key={item.id}
                                    className={`attribute-value${
                                      attributes[toCamelCase(attribute.id)] ===
                                      item.id
                                        ? ' active'
                                        : ''
                                    }`}
                                  >
                                    {item.value}
                                  </div>
                                );
                              })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="product-info">
                    <div className="counter">
                      <div
                        onClick={() =>
                          this.props.dispatch(
                            changeCount({ id: myProduct.id, change: 1 })
                          )
                        }
                      >
                        <Plus />
                      </div>
                      <div className="counter-value">{myProduct.count}</div>
                      <div
                        onClick={() => {
                          if (myProduct.count > 0)
                            this.props.dispatch(
                              changeCount({ id: myProduct.id, change: -1 })
                            );
                        }}
                      >
                        <Minus />
                      </div>
                    </div>
                    <div className="product-gallery">
                      <img src={product.gallery[0]} alt={product.name} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : (
      'Loading...'
    );
  }
}

const mapStateToProps = (state) => {
  const { cart, active } = state;
  return { active: active.active, products: cart.cart };
};

export default connect(mapStateToProps)(CartPage);

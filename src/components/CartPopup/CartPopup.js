import React from 'react';
import { connect, shallowEqual } from 'react-redux';
import { changeActivePage } from '../../features/activeSlice';
import { toCamelCase } from '../../utils/toCamelCase';
import { ReactComponent as Plus } from '../../images/plus.svg';
import { ReactComponent as Minus } from '../../images/minus.svg';
import { changeCount } from '../../features/cartSlice';
import handleButtonAnimation from '../../utils/handleButtonAnimation';

class CartPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { total: 0 };
  }

  componentDidMount() {
    let total = 0;
    for (let myProduct in this.props.products) {
      total +=
        this.props.products[myProduct].product.prices.find(
          (price) => price.currency.label === this.props.active.currency.label
        ).amount * this.props.products[myProduct].count;
    }
    this.setState({ total: total.toFixed(2) });
  }

  componentDidUpdate(prevProps) {
    if (
      shallowEqual(prevProps.products, this.props.products) &&
      shallowEqual(prevProps.active.currency, this.props.active.currency)
    ) {
      return;
    }
    let total = 0;
    for (let myProduct in this.props.products) {
      total +=
        this.props.products[myProduct].product.prices.find(
          (price) => price.currency.label === this.props.active.currency.label
        ).amount * this.props.products[myProduct].count;
    }
    this.setState({ total: total.toFixed(2) });
  }

  render() {
    return (
      <div id="cart-popup" className="popup">
        <span>
          <b>My Bag,</b>
          {` ${Object.keys(this.props.products).length} item${
            Object.keys(this.props.products).length === 1 ? '' : 's'
          }`}
        </span>
        {Object.values(this.props.products).map((myProduct) => {
          const product = myProduct.product;
          const attributes = myProduct.attributes;
          return (
            <div className="mini-cart-product" key={myProduct.id}>
              <div className="product-attributes">
                <span>{product.brand}</span>
                <span>{product.name}</span>
                <span className="mini-price">
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
                                } mini`}
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
                                } mini`}
                              >
                                {item.value.slice(0, 3)}
                              </div>
                            );
                          })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="product-info">
                <div className="counter">
                  <Plus
                    onClick={() =>
                      this.props.dispatch(
                        changeCount({ id: myProduct.id, change: 1 })
                      )
                    }
                    className="plus"
                  />

                  <div className="counter-value">{myProduct.count}</div>

                  <Minus
                    className="minus"
                    onClick={() => {
                      if (myProduct.count > 0)
                        this.props.dispatch(
                          changeCount({ id: myProduct.id, change: -1 })
                        );
                    }}
                  />
                </div>
                <div className="product-gallery">
                  <img src={product.gallery[0]} alt={product.name} />
                </div>
              </div>
            </div>
          );
        })}
        <div id="total">
          <span> Total</span>
          <span>
            {this.props.active.currency.symbol}
            {this.state.total}
          </span>
        </div>
        <div className="buttons ">
          <button
            className="transparent"
            onClick={(event) => {
              handleButtonAnimation(event);
              this.props.dispatch(changeActivePage('cart'));
              this.props.handleClickCart();
            }}
          >
            view bag
          </button>
          <button
            className="green"
            onClick={(event) => {
              handleButtonAnimation(event);
            }}
          >
            check out
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { cart, active } = state;
  return { active: active.active, products: cart.cart };
};

export default connect(mapStateToProps)(CartPopup);

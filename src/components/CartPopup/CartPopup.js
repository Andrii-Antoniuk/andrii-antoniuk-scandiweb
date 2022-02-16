import React from 'react';
import { connect, shallowEqual } from 'react-redux';
import { changeActivePage } from '../../features/activeSlice';
import { toCamelCase } from '../../utils/toCamelCase';
import { ReactComponent as Plus } from '../../images/plus.svg';
import { ReactComponent as Minus } from '../../images/minus.svg';
import { changeCount, deleteProduct } from '../../features/cartSlice';
import handleButtonAnimation from '../../utils/handleButtonAnimation';
import OutsideAlerter from '../OutsideHandler/OutsideHandler';
import PopupWithTransition from '../PopupWithTransition/PopupWithTransition';
import DeleteItem from '../DeleteItem/DeleteItem';

class CartPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = { total: 0, showDelete: false, style: {}, idToDelete: null };
    this.showDelete = this.showDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
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

  showDelete(event, id) {
    const child = event.currentTarget.getBoundingClientRect();
    const scrollTop = document.getElementById('cart-popup').scrollTop;
    const parent = document
      .getElementById('cart-popup')
      .getBoundingClientRect();
    let style = {
      top: `${(scrollTop + child.top - parent.top - 35).toFixed(0)}px`,
      left: `${(child.left - parent.left - 50).toFixed(0)}px`,
    };
    this.setState({ showDelete: true, style, idToDelete: id });
  }

  cancelDelete(event) {
    if (event.target.classList[0] === 'minus') {
      return;
    }
    this.setState({ showDelete: false, style: {}, idToDelete: null });
  }

  confirmDelete() {
    this.props.dispatch(deleteProduct({ id: this.state.idToDelete }));
    this.setState({ showDelete: false, style: {}, idToDelete: null });
  }

  render() {
    return (
      <div id="cart-popup" className="popup">
        <span>
          <b>My Bag,</b>
          {` ${Object.values(this.props.products)
            .map((product) => product.count)
            .reduce((prevValue, currValue) => {
              return prevValue + currValue;
            }, 0)} item${
            Object.values(this.props.products).length !== 0
              ? !(
                  Object.values(this.props.products)[0].count > 1 ||
                  Object.values(this.props.products).length > 1
                )
                ? ''
                : 's'
              : 's'
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
                    onClick={(event) => {
                      if (myProduct.count > 0)
                        if (myProduct.count === 1) {
                          this.showDelete(event, myProduct.id);
                        } else
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
        {Object.keys(this.props.products).length !== 0 ? (
          <>
            <div className="total">
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
          </>
        ) : (
          <div className="total">
            <span>
              <i> Your cart is empty</i>
            </span>
          </div>
        )}
        <OutsideAlerter handleClickOutside={this.cancelDelete}>
          <PopupWithTransition mounted={this.state.showDelete}>
            <DeleteItem
              style={this.state.style}
              cancelDelete={this.cancelDelete}
              confirmDelete={this.confirmDelete}
            />
          </PopupWithTransition>
        </OutsideAlerter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { cart, active } = state;
  return { active: active.active, products: cart.cart };
};

export default connect(mapStateToProps)(CartPopup);

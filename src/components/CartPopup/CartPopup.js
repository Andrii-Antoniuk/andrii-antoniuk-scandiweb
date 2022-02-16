import React from 'react';
import { Cart as PureCart } from '../Cart/Cart';
import { connect, shallowEqual } from 'react-redux';
import { changeActivePage } from '../../features/activeSlice';
import handleButtonAnimation from '../../utils/handleButtonAnimation';
import OutsideAlerter from '../OutsideHandler/OutsideHandler';
import PopupWithTransition from '../PopupWithTransition/PopupWithTransition';
import DeleteItem from '../DeleteItem/DeleteItem';
import Price from '../Price/Price';
import Attributes from '../Attributes/Attributes';
import Counter from '../Counter/Counter';

class CartPopup extends PureCart {
  constructor(props) {
    super(props);
    this.state = { total: 0, showDelete: false, style: {}, idToDelete: null };
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

  renderBagInfo() {
    return (
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
    );
  }

  renderProducts() {
    return Object.values(this.props.products).map((myProduct) => {
      const product = myProduct.product;
      const attributes = myProduct.attributes;
      return (
        <div className="mini-cart-product" key={myProduct.id}>
          <div className="product-attributes">
            <span>{product.brand}</span>
            <span>{product.name}</span>
            <span className="mini-price">
              <Price product={product} currency={this.props.active.currency} />
            </span>
            <Attributes mini="mini" attributes={attributes} product={product} />
          </div>
          <div className="product-info">
            <Counter myProduct={myProduct} showDelete={this.showDelete} />
            <div className="product-gallery">
              <img src={product.gallery[0]} alt={product.name} />
            </div>
          </div>
        </div>
      );
    });
  }

  renderTotalAndButtons() {
    return Object.keys(this.props.products).length !== 0 ? (
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
    );
  }

  render() {
    return (
      <div id="cart-popup" className="popup">
        {this.renderBagInfo()}
        {this.renderProducts()}
        {this.renderTotalAndButtons()}
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

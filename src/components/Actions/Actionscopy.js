import React from 'react';
import { ReactComponent as CartIcon } from '../../images/cart.svg';
import CurrencySwitch from '../CurrencySwitch/CurrencySwitch';
import { getCurrencies } from '../../features/currenciesSlice';
import { changeActiveCurrency } from '../../features/activeSlice';
import OutsideAlerter from '../OutsideHandler/OutsideHandler';
import CartPopup from '../CartPopup/CartPopup';
import { connect } from 'react-redux';
import './Actions.css';
import PopupWithTransition from '../PopupWithTransition/PopupWithTransition';

class Actionscopy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingCurrency: false,
      isShowingCart: false,
      timer: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.cancelLeave = this.cancelLeave.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleClickOutsideCart = this.handleClickOutsideCart.bind(this);
    this.handleClickCart = this.handleClickCart.bind(this);
  }

  handleClickCart() {
    this.setState((prevState) => {
      return { isShowingCart: prevState.isShowingCart ? false : true };
    });
  }

  handleLeave() {
    this.setState({
      timer: setTimeout(
        function () {
          this.setState({ isShowingCurrency: false });
        }.bind(this),
        3000
      ),
    });
  }

  handleClickOutside(event) {
    if (
      event.target.nodeName !== 'HTML' &&
      (event.target.parentElement.id === 'currency' ||
        event.target.id === 'currency')
    ) {
      return;
    }
    this.setState({ isShowingCurrency: false });
  }

  handleClick() {
    if (!this.state.isShowingCurrency) {
      this.setState({ isShowingCurrency: true });
    } else {
      this.setState({ isShowingCurrency: false });
    }
  }

  handleClickOutsideCart(event) {
    console.log();
    if (
      event.target.nodeName !== 'HTML' &&
      (event.target.parentElement.id === 'cart-icon' ||
        event.target.parentElement.nodeName === 'svg')
    ) {
      return;
    }
    this.setState({ isShowingCart: false });
  }

  cancelLeave() {
    clearTimeout(this.state.timer);
  }

  componentDidMount() {
    this.props
      .dispatch(getCurrencies())
      .then((result) =>
        this.props.dispatch(changeActiveCurrency(result.payload[0]))
      )
      .catch((error) => {
        console.log(`Something went wrong. Your backend is not working`);
      });
  }

  render() {
    return (
      <div className="dd-wrapper">
        <div id="currency" onClick={this.handleClick}>
          <span id="currency-symbol">
            {this.props.active.currency
              ? this.props.active.currency.symbol.slice(-1)
              : '...'}
          </span>
          <div
            id="arrow"
            className={this.state.isShowingCurrency ? 'reverse' : ''}
          ></div>
        </div>

        <OutsideAlerter handleClickOutside={this.handleClickOutside}>
          <PopupWithTransition
            mounted={this.state.isShowingCurrency}
            handleLeave={this.handleLeave}
            cancelLeave={this.cancelLeave}
          >
            <CurrencySwitch currencies={this.props.currencies} />
          </PopupWithTransition>
        </OutsideAlerter>
        <div id="cart-icon" onClick={this.handleClickCart}>
          <CartIcon />
          {Object.keys(this.props.cart).length === 0 ? null : (
            <div id="item-counter">{Object.keys(this.props.cart).length}</div>
          )}
        </div>
        <OutsideAlerter handleClickOutside={this.handleClickOutsideCart}>
          <PopupWithTransition mounted={this.state.isShowingCart}>
            <CartPopup handleClickCart={this.handleClickCart} />
          </PopupWithTransition>
        </OutsideAlerter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { active, currencies, cart } = state;
  return {
    active: active.active,
    currencies: currencies.currencies,
    cart: cart.cart,
  };
};

export default connect(mapStateToProps)(Actionscopy);

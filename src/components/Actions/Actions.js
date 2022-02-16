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

class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingCurrency: false,
      isShowingCart: false,
      timer: null,
    };
    this.handleClickSwitch = this.handleClickSwitch.bind(this);
    this.handleLeaveSwitch = this.handleLeaveSwitch.bind(this);
    this.cancelLeaveSwitch = this.cancelLeaveSwitch.bind(this);
    this.handleClickOutsideSwitch = this.handleClickOutsideSwitch.bind(this);
    this.handleClickOutsideCart = this.handleClickOutsideCart.bind(this);
    this.handleClickCart = this.handleClickCart.bind(this);
  }

  handleClickCart() {
    this.setState((prevState) => {
      return { isShowingCart: prevState.isShowingCart ? false : true };
    });
    document.querySelector('.container').classList.toggle('backdrop');
  }

  handleLeaveSwitch() {
    this.setState({
      timer: setTimeout(
        function () {
          this.setState({ isShowingCurrency: false });
        }.bind(this),
        3000
      ),
    });
  }

  handleClickOutsideSwitch(event) {
    if (
      event.target.nodeName !== 'HTML' &&
      (event.target.parentElement.id === 'currency' ||
        event.target.id === 'currency')
    ) {
      return;
    }
    this.setState({ isShowingCurrency: false });
  }

  handleClickSwitch() {
    if (!this.state.isShowingCurrency) {
      this.setState({ isShowingCurrency: true });
    } else {
      this.setState({ isShowingCurrency: false });
    }
  }

  handleClickOutsideCart(event) {
    if (
      event.target.nodeName !== 'HTML' &&
      (event.target.parentElement.id === 'cart-icon' ||
        event.target.parentElement.nodeName === 'svg')
    ) {
      return;
    }
    this.setState({ isShowingCart: false });
    document.querySelector('.container').classList.remove('backdrop');
  }

  cancelLeaveSwitch() {
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

  renderCartIconCounter() {
    return Object.keys(this.props.cart).length === 0 ? null : (
      <div id="item-counter">
        {Object.values(this.props.cart)
          .map((product) => product.count)
          .reduce((prevValue, currValue) => {
            return prevValue + currValue;
          }, 0)}
      </div>
    );
  }

  render() {
    return (
      <div className="dd-wrapper">
        <div id="currency" onClick={this.handleClickSwitch}>
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

        <OutsideAlerter handleClickOutside={this.handleClickOutsideSwitch}>
          <PopupWithTransition
            mounted={this.state.isShowingCurrency}
            handleLeave={this.handleLeaveSwitch}
            cancelLeave={this.cancelLeaveSwitch}
          >
            <CurrencySwitch
              currencies={this.props.currencies}
              handleClick={this.handleClickSwitch}
            />
          </PopupWithTransition>
        </OutsideAlerter>
        <div id="cart-icon" onClick={this.handleClickCart}>
          <CartIcon />
          {this.renderCartIconCounter()}
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

export default connect(mapStateToProps)(Actions);

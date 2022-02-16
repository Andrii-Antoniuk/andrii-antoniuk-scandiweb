import React from 'react';
import { connect } from 'react-redux';
import { changeActiveCurrency } from '../../features/activeSlice';

class CurrencySwitch extends React.Component {
  renderCurrencies() {
    return this.props.currencies.map((element) => (
      <li
        key={element.label}
        onClick={() => {
          this.props.dispatch(changeActiveCurrency(element));
          this.props.handleClick();
        }}
      >
        <span>
          {element.symbol.slice(-1)} {element.label}
        </span>
      </li>
    ));
  }

  render() {
    return (
      Object.keys(this.props.currencies).length && (
        <div id="switch" className="popup">
          <ul>{this.renderCurrencies()}</ul>
        </div>
      )
    );
  }
}

export default connect()(CurrencySwitch);

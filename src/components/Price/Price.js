import React from 'react';

export default class Price extends React.Component {
  render() {
    return this.props.prices && this.props.currency
      ? Object.values(
          Object.values(
            this.props.prices.filter((elementObj) => {
              return elementObj.currency.label === this.props.currency.label;
            })[0]
          )
            .slice(-2)
            .map((price) => {
              if (typeof price === 'number' && isFinite(price)) {
                return price;
              }
              return price.symbol;
            })
        )
      : null;
  }
}

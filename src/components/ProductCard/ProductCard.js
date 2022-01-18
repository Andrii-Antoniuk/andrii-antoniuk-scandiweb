import React from 'react';

export class ProductCard extends React.Component {
  render() {
    return (
      <div className="product-card">
        {this.props.product.name}
        {this.props.product.id}
      </div>
    );
  }
}

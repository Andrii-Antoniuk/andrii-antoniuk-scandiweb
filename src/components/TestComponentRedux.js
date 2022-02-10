import React from 'react';
import { connect } from 'react-redux';
import { addProductToCart } from '../features/cartSlice';
import { getCurrencies } from '../features/currenciesSlice';
import { getProducts } from '../features/productsSlice';

class Test extends React.Component {
  componentDidMount() {
    this.props.dispatch(getProducts());
    this.props.dispatch(getCurrencies());
    this.props.dispatch(addProductToCart());
  }
  render() {
    return <div>I am working...</div>;
  }
}

const mapStateToProps = (state) => {
  const { products } = state;
  return { products: products };
};

export default connect(mapStateToProps)(Test);

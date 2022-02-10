import React from 'react';
import './App.css';
import './components/Page/Page.css';

import { connect } from 'react-redux';
import { CategoryPage } from './components/CategoryPage/CategoryPage';
import ProductPage from './components/ProductPage/ProductPage';
import CartPage from './components/CartPage/CartPage';
import Headercopy from './components/Header/Headercopy';
import CategoryPagecopy from './components/CategoryPage/CategoryPagecopy';

class AppCopy extends React.Component {
  render() {
    return (
      <>
        <Headercopy />
        {this.props.active.page === '' || this.props.active.page === 'plp' ? (
          <CategoryPagecopy />
        ) : this.props.active.page === 'pdp' ? (
          <ProductPage />
        ) : (
          <CartPage />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { active } = state;
  return { active: active.active };
};

export default connect(mapStateToProps)(AppCopy);

//I know that I can use Redux for state, but I don't want to use connectAPI right now with class components

import React from 'react';
import './App.css';
import './components/Page/Page.css';
import { connect } from 'react-redux';
import ProductPage from './components/ProductPage/ProductPage';
import CartPage from './components/CartPage/CartPage';
import Header from './components/Header/Header';
import CategoryPage from './components/CategoryPage/CategoryPage';

class App extends React.Component {
  render() {
    return (
      <>
        <Header />

        {/* added this div to have compatibility with Firefox*/}
        {this.props.active.page === '' || this.props.active.page === 'plp' ? (
          <CategoryPage />
        ) : this.props.active.page === 'pdp' ? (
          <ProductPage />
        ) : (
          <CartPage />
        )}
        <div className="container"></div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { active } = state;
  return { active: active.active };
};

export default connect(mapStateToProps)(App);

//I know that I can use Redux for state, but I don't want to use connectAPI right now with class components

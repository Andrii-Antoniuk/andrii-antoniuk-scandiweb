import React from 'react';
import { queryProducts } from '../../utils/apolloClient';
import { CartPage } from '../CartPage/CartPage';
import { CategoryPage } from '../CategoryPage/CategoryPage';
import { ProductPage } from '../ProductPage/ProductPage';
import './Page.css';
export class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      whichHovered: '',
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  componentDidMount() {
    const categories = this.props.categoriesNames;

    for (let i = 1; i < categories.length; i++) {
      queryProducts(categories[i]).then((result) =>
        this.setState({
          products: [...this.state.products, result],
        })
      );
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.categoriesNames !== prevProps.categoriesNames &&
      !this.state.products.length
    ) {
      const categories = this.props.categoriesNames;

      for (let i = 1; i < categories.length; i++) {
        queryProducts(categories[i]).then((result) =>
          this.setState({
            products: [...this.state.products, result],
          })
        );
      }
    }
  }

  handleEnter(event) {
    const targetId = event.currentTarget.classList[1];
    const allProductsArray = this.state.products;
    for (let i = 0; i < allProductsArray.length; i++) {
      for (
        let productIndex = 0;
        productIndex < allProductsArray[i].length;
        productIndex++
      )
        if (this.state.products[i][productIndex].id === targetId) {
          this.setState({
            whichHovered: targetId,
          });
        }
    }
  }
  handleLeave(event) {
    this.setState({ whichHovered: '' });
  }

  render() {
    return this.props.activePage === 'category' ? (
      <CategoryPage
        activeCategory={this.props.activeCategory}
        products={this.state.products}
        handleEnter={this.handleEnter}
        handleLeave={this.handleLeave}
        activeCurrency={this.props.activeCurrency}
        whichHovered={this.state.whichHovered}
        pageChange={() => this.props.pageChange('product')}
        productChange={this.props.productChange}
        countChange={this.props.countChange}
      />
    ) : this.props.activePage === 'product' ? (
      <ProductPage
        pageChange={() => this.props.pageChange('cart')}
        activeProduct={this.props.activeProduct}
        activeCurrency={this.props.activeCurrency}
        countChange={this.props.countChange}
      />
    ) : (
      <CartPage
        activeCurrency={this.props.activeCurrency}
        countChange={this.props.countChange}
        cartProducts={this.props.cartProducts}
      />
    );
  }
}

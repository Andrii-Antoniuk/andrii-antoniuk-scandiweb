import React from 'react';
import { getCategoryProducts } from '../../utils/apolloClient';
import { ProductCard } from '../ProductCard/ProductCard';
import './CategoryPage.css';
export class CategoryPage extends React.Component {
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
      getCategoryProducts(categories[i]).then((result) =>
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
        getCategoryProducts(categories[i]).then((result) =>
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
    return (
      <div id="category-page">
        <h1>{this.props.activeCategory}</h1>
        <div id="products">
          {this.props.activeCategory === 'all' ? (
            <>
              {this.state.products.map((productsArray) => {
                return productsArray.map((product) => (
                  <ProductCard
                    key={product.name}
                    product={product}
                    activeCurrency={this.props.activeCurrency}
                    handleEnter={this.handleEnter}
                    handleLeave={this.handleLeave}
                    whichHovered={this.state.whichHovered}
                  />
                ));
              })}
            </>
          ) : (
            <>
              {/*this may be very dummy way to solve it, but I didn't find another */}
              {this.state.products
                .filter(
                  (productsArray) =>
                    productsArray[0].category === this.props.activeCategory
                )[0]
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    activeCurrency={this.props.activeCurrency}
                    handleEnter={this.handleEnter}
                    handleLeave={this.handleLeave}
                    whichHovered={this.state.whichHovered}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

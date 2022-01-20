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
              {/*I know, that I can use index of category instead of name, but then I'll also check is array item with that index exist, so i decided not to change everything*/}
              {this.state.products.find(
                /*Because of render is the first method in component lifecycle (after constructor, of course), I have to check is my product already fetched. 
                I don't have to do it if I'm not using LocalStorage.
                Also, I have a question about that, because I don't have to add same checking in line 71 and below, and I don't truly understand why.
                */
                (productsArray) =>
                  productsArray[0].category === this.props.activeCategory
              )
                ? this.state.products /*this may be very dummy way to solve it, but I didn't find another */
                    .find((productsArray) => {
                      return (
                        productsArray[0].category === this.props.activeCategory
                      );
                    })
                    .map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        activeCurrency={this.props.activeCurrency}
                        handleEnter={this.handleEnter}
                        handleLeave={this.handleLeave}
                        whichHovered={this.state.whichHovered}
                      />
                    ))
                : 'Loading...'}
            </>
          )}
        </div>
      </div>
    );
  }
}

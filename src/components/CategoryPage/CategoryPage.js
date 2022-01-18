import React from 'react';
import { getCategoryProducts } from '../../utils/apolloClient';
import { ProductCard } from '../ProductCard/ProductCard';
import './CategoryPage.css';
export class CategoryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {
        all: [],
      },
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.categoriesNames !== prevProps.categoriesNames) {
      const categories = this.props.categoriesNames;

      for (let i = 1; i < categories.length; i++) {
        getCategoryProducts(categories[i]).then((result) =>
          this.setState({
            products: { all: [...this.state.products.all, result] },
          })
        );
      }
    }
  }
  render() {
    return (
      <div id="category-page">
        <h1>{this.props.activeCategory}</h1>
        {this.props.activeCategory === 'all' ? (
          <>
            {this.state.products.all.map((elementObj) => {
              const productsArray = elementObj.products;
              return productsArray.map((product) => (
                <ProductCard key={product.name} product={product} />
              ));
            })}
          </>
        ) : (
          <>
            {/*this may be very dummy way to solve it, but I didn't find another */}
            {this.state.products.all
              .filter(
                (elementObj) => elementObj.name === this.props.activeCategory
              )[0]
              .products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
          </>
        )}
      </div>
    );
  }
}

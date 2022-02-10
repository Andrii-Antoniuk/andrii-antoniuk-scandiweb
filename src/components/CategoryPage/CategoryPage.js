import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
export class CategoryPage extends React.Component {
  render() {
    return (
      <div className="page">
        <h1>{this.props.activeCategory}</h1>
        <div id="products">
          {this.props.activeCategory === 'all' ? (
            <>
              {this.props.products.map((productsArray) => {
                return productsArray.map((product) => (
                  <ProductCard
                    key={product.name}
                    product={product}
                    activeCurrency={this.props.activeCurrency}
                    handleEnter={this.props.handleEnter}
                    handleLeave={this.props.handleLeave}
                    whichHovered={this.props.whichHovered}
                    pageChange={this.props.pageChange}
                    productChange={this.props.productChange}
                  />
                ));
              })}
            </>
          ) : (
            <>
              {/*I know, that I can use index of category instead of name, but then I'll also check is array item with that index exist, so i decided not to change everything*/}
              {this.props.products.find(
                /*Because of render is the first method in component lifecycle (after constructor, of course), I have to check is my product already fetched. 
                      I don't have to do it if I'm not using LocalStorage.
                      Also, I have a question about that, because I don't have to add same checking in line 71 and below, and I don't truly understand why.
                      */
                (productsArray) =>
                  productsArray[0].category === this.props.activeCategory
              )
                ? this.props.products /*this may be very dummy way to solve it, but I didn't find another */
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
                        handleEnter={this.props.handleEnter}
                        handleLeave={this.props.handleLeave}
                        whichHovered={this.props.whichHovered}
                        pageChange={this.props.pageChange}
                        productChange={this.props.productChange}
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

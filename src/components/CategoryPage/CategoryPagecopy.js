import React from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../features/productsSlice';
import ProductCard from '../ProductCard/ProductCard';
class CategoryPagecopy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whichHovered: '',
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getProducts());
  }

  handleEnter(event) {
    const targetId = event.currentTarget.classList[1];
    const allProductsArray = Object.values(this.props.products);
    for (let i = 0; i < allProductsArray.length; i++) {
      for (let product in allProductsArray[i]) {
        if (allProductsArray[i][product].id === targetId) {
          this.setState({
            whichHovered: targetId,
          });
        }
      }
    }
  }

  handleLeave(event) {
    this.setState({ whichHovered: '' });
  }

  render() {
    return (
      <div className="page">
        <h1>{this.props.active.category}</h1>
        {this.props.products ? (
          <div id="products">
            {this.props.active.category === 'all' ? (
              Object.keys(this.props.products).length ? (
                <>
                  {Object.values(this.props.products).map((productsObject) => {
                    return Object.values(productsObject).map((product) => (
                      <ProductCard
                        key={product.name}
                        product={product}
                        handleEnter={this.handleEnter}
                        handleLeave={this.handleLeave}
                        whichHovered={this.state.whichHovered}
                      />
                    ));
                  })}
                </>
              ) : (
                'Loading...'
              )
            ) : (
              <>
                {/*I know, that I can use index of category instead of name, but then I'll also check is array item with that index exist, so i decided not to change everything*/}
                {Object.values(this.props.products).find(
                  /*Because of render is the first method in component lifecycle (after constructor, of course), I have to check is my product already fetched. 
                      I don't have to do it if I'm not using LocalStorage.
                      Also, I have a question about that, because I don't have to add same checking in line 71 and below, and I don't truly understand why.
                      */
                  (productsObject) => {
                    return (
                      Object.values(productsObject)[0].category ===
                      this.props.active.category
                    );
                  }
                )
                  ? Object.values(
                      Object.values(
                        this.props.products
                      ) /*this may be very dummy way to solve it, but I didn't find another */
                        .find((productsObject) => {
                          return (
                            Object.values(productsObject)[0].category ===
                            this.props.active.category
                          );
                        })
                    ).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        handleEnter={this.handleEnter}
                        handleLeave={this.handleLeave}
                        whichHovered={this.state.whichHovered}
                      />
                    ))
                  : 'Loading...'}
              </>
            )}
          </div>
        ) : (
          'Loading'
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { active, products } = state;
  return { active: active.active, products: products.products };
};

export default connect(mapStateToProps)(CategoryPagecopy);

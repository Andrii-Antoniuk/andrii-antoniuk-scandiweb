import React from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../features/productsSlice';
import ProductCard from '../ProductCard/ProductCard';
class CategoryPage extends React.Component {
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

  handleLeave() {
    this.setState({ whichHovered: '' });
  }

  findActiveCategory() {
    return Object.values(this.props.products).find(
      (productsObject) =>
        Object.values(productsObject)[0].category === this.props.active.category
    );
  }

  renderCategory() {
    if (this.props.active.category === 'all') {
      return Object.keys(this.props.products).length ? (
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
      );
    } else {
      let categoryArray;
      const category = this.findActiveCategory();
      category
        ? (categoryArray = Object.values(category))
        : (categoryArray = []);
      return categoryArray.map((product) => (
        <ProductCard
          key={product.name}
          product={product}
          handleEnter={this.handleEnter}
          handleLeave={this.handleLeave}
          whichHovered={this.state.whichHovered}
        />
      ));
    }
  }

  render() {
    return (
      <div className="page">
        <h1>{this.props.active.category}</h1>
        {this.props.products ? (
          <div id="products">{this.renderCategory()}</div>
        ) : (
          'Loading...'
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  const { active, products } = state;
  return { active: active.active, products: products.products };
};

export default connect(mapStateToProps)(CategoryPage);

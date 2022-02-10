import React from 'react';
import './ProductPage.css';
import parse from 'html-react-parser';
import { toCamelCase } from '../../utils/toCamelCase';
import { connect, shallowEqual } from 'react-redux';
import { getProduct } from '../../features/productsSlice';
import { addProductToCart, changeCount } from '../../features/cartSlice';
import handleButtonAnimation from '../../utils/handleButtonAnimation';
class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveImageChange = this.handleActiveImageChange.bind(this);
    this.handleAttributeChange = this.handleAttributeChange.bind(this);
    this.state = {
      activeImage: '',
      activeAttributes: {},
    };
  }
  componentDidMount() {
    this.props.dispatch(getProduct(this.props.active.productId)).then(() => {
      const activeAttributes = {};
      for (let attribute of this.props.product.attributes) {
        activeAttributes[toCamelCase(attribute.id)] = '';
      }
      this.setState({
        activeImage: this.props.product.gallery[0],
        activeAttributes,
      });
    });
    window.scrollTo(0, 0);
  }

  handleActiveImageChange(event) {
    this.setState({ activeImage: event.currentTarget.src });
  }

  handleAttributeChange(attribute, id) {
    this.setState({
      activeAttributes: {
        ...this.state.activeAttributes,
        [toCamelCase(attribute)]: id,
      },
    });
  }

  render() {
    return Object.keys(this.props.product).length !== 0 ? (
      <div className="page">
        <div className="product">
          <div className="gallery">
            {this.props.product.gallery.map((imageUrl) => (
              <div className="gallery-image" key={imageUrl}>
                <img
                  src={imageUrl}
                  alt={this.props.product.name}
                  onClick={this.handleActiveImageChange}
                />
              </div>
            ))}
          </div>
          <div className="image">
            <img src={this.state.activeImage} alt={this.props.product.name} />
          </div>
          <div className="info">
            <h2 className="brand">{this.props.product.brand}</h2>
            <h3 className="product-name">{this.props.product.name}</h3>

            {this.props.product.attributes.map((attribute) => (
              <div
                key={attribute.id + this.props.product.id}
                className="attributes"
              >
                {attribute.id}:
                <div className="attribute">
                  {attribute.type === 'swatch'
                    ? attribute.items.map((item) => {
                        return (
                          <div
                            key={item.id + this.props.product.id}
                            className={`attribute-value swatch ${
                              this.state.activeAttributes[
                                toCamelCase(attribute.id)
                              ] === item.id
                                ? ' active'
                                : ''
                            } `}
                            style={{ backgroundColor: item.value }}
                            title={item.id}
                            onClick={(event) => {
                              handleButtonAnimation(event);
                              this.handleAttributeChange(attribute.id, item.id);
                            }}
                          ></div>
                        );
                      })
                    : attribute.items.map((item) => {
                        return (
                          <div
                            key={item.id + this.props.product.id}
                            className={`attribute-value${
                              this.state.activeAttributes[
                                toCamelCase(attribute.id)
                              ] === item.id
                                ? ' active'
                                : ''
                            } `}
                            onClick={(event) => {
                              handleButtonAnimation(event);
                              this.handleAttributeChange(attribute.id, item.id);
                            }}
                          >
                            {item.value}
                          </div>
                        );
                      })}
                </div>
              </div>
            ))}
            <div className="price">Price:</div>
            <div className="price-value">
              {Object.values(
                Object.values(
                  this.props.product.prices.filter(
                    (elementObj) =>
                      elementObj.currency.label ===
                      this.props.active.currency.label
                  )[0]
                )
                  .slice(-2)
                  .map((price) => {
                    if (typeof price === 'number' && isFinite(price)) {
                      return price;
                    }
                    return price.symbol;
                  })
              )}
            </div>
            {this.props.product.inStock ? (
              <button
                className="green"
                onClick={(event) => {
                  if (
                    Object.values(this.state.activeAttributes).some(
                      (element) => element === ''
                    )
                  ) {
                    Array.from(
                      document.querySelectorAll('.attribute-value')
                    ).forEach((element) =>
                      handleButtonAnimation(
                        { currentTarget: element },
                        'shadow-drop-2-center-warning'
                      )
                    );
                  } else {
                    const sameProduct = Object.values(
                      this.props.cartProducts
                    ).find(
                      (cartProduct) =>
                        cartProduct.product.name === this.props.product.name &&
                        shallowEqual(
                          cartProduct.attributes,
                          this.state.activeAttributes
                        )
                    );
                    if (sameProduct) {
                      this.props.dispatch(
                        changeCount({ id: sameProduct.id, change: 1 })
                      );
                    } else
                      this.props.dispatch(
                        addProductToCart({
                          product: this.props.product,
                          attributes: this.state.activeAttributes,
                        })
                      );
                    handleButtonAnimation(event);
                  }
                }}
              >
                add to cart
              </button>
            ) : (
              <button className="not-availble">out of stock</button>
            )}
            <div className="description">
              {parse(this.props.product.description)}
            </div>
          </div>
        </div>
      </div>
    ) : (
      'Loading...'
    );
  }
}

const mapStateToProps = (state) => {
  const { active, products, cart } = state;
  return {
    active: active.active,
    product: products.product,
    cartProducts: cart.cart,
  };
};

export default connect(mapStateToProps)(ProductPage);

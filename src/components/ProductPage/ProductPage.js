import React from 'react';
import { getProduct } from '../../utils/apolloClient';
import './ProductPage.css';
import parse from 'html-react-parser';
import { toCamelCase } from '../../utils/toCamelCase';
export class ProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveImageChange = this.handleActiveImageChange.bind(this);
    this.state = {
      product: {},
      activeImage: '',
      activeAttributes: {},
    };
  }
  componentDidMount() {
    getProduct(this.props.activeProduct).then((result) =>
      this.setState(
        {
          product: result,
          activeImage: result.gallery[0],
        },
        () => {
          this.state.product.attributes.forEach((attribute) => {
            this.setState((prevState) => ({
              activeAttributes: {
                ...prevState.activeAttributes,
                [toCamelCase(attribute.id)]: '',
              },
            }));
          });
        }
      )
    );
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
    return Object.keys(this.state.product).length !== 0 ? (
      <div className="page">
        <div className="product">
          <div className="gallery">
            {this.state.product.gallery.map((imageUrl) => (
              <div className="gallery-image" key={imageUrl}>
                <img
                  src={imageUrl}
                  alt={this.state.product.name}
                  onClick={this.handleActiveImageChange}
                />
              </div>
            ))}
          </div>
          <div className="image">
            <img src={this.state.activeImage} alt={this.state.product.name} />
          </div>
          <div className="info">
            <h2 className="brand">{this.state.product.brand}</h2>
            <h3 className="product-name">{this.state.product.name}</h3>

            {this.state.product.attributes.map((attribute) => (
              <div key={attribute.id} className="attributes">
                {attribute.id}:
                <div className="attribute">
                  {attribute.type === 'swatch'
                    ? attribute.items.map((item) => {
                        return (
                          <div
                            key={item.id}
                            className={`attribute-value swatch ${
                              this.state.activeAttributes[
                                toCamelCase(attribute.id)
                              ] === item.id
                                ? ' active'
                                : ''
                            } `}
                            style={{ backgroundColor: item.value }}
                            title={item.id}
                            onClick={() =>
                              this.handleAttributeChange(attribute.id, item.id)
                            }
                          ></div>
                        );
                      })
                    : attribute.items.map((item) => (
                        <div
                          key={item.id}
                          className={`attribute-value${
                            this.state.activeAttributes[
                              toCamelCase(attribute.id)
                            ] === item.id
                              ? ' active'
                              : ''
                          } `}
                          onClick={() =>
                            this.handleAttributeChange(attribute.id, item.id)
                          }
                        >
                          {item.value}
                        </div>
                      ))}
                </div>
              </div>
            ))}
            <div className="price">Price:</div>
            <div className="price-value">
              {Object.values(
                Object.values(
                  this.state.product.prices.filter(
                    (elementObj) =>
                      elementObj.currency.label === this.props.activeCurrency
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
            {this.state.product.inStock ? (
              <button
                className="add"
                onClick={() => {
                  if (
                    Object.values(this.state.activeAttributes).some(
                      (element) => element === ''
                    )
                  ) {
                    alert('You should choose all of the attributes');
                  } else
                    this.props.countChange(
                      this.state.product.id,
                      this.state.activeAttributes
                    );
                }}
              >
                add to cart
              </button>
            ) : (
              <button className="not-availble">out of stock</button>
            )}
            <div className="description">
              {parse(this.state.product.description)}
            </div>
          </div>
        </div>
      </div>
    ) : (
      'Loading...'
    );
  }
}

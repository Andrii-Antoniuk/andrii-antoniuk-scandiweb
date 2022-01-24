import React from 'react';
import { ReactComponent as Plus } from '../../images/plus.svg';
import { ReactComponent as Minus } from '../../images/minus.svg';
import { getProductForCart } from '../../utils/apolloClient';
import { toCamelCase } from '../../utils/toCamelCase';
import './CartPage.css';

export class CartPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
    };
  }
  componentDidMount() {
    Object.keys(this.props.cartProducts).map((product) =>
      getProductForCart(product).then((newProduct) => {
        console.log(newProduct);
        const oldProducts = this.state.products;
        oldProducts.push(newProduct);
        this.setState({ products: oldProducts });
      })
    );
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState);
  }

  render() {
    return this.state.products.length !== 0 ? (
      <div className="page">
        <div className="cart">
          <div className="cart-info">
            <h2>Cart</h2>
            {this.state.products.map((product) => (
              <div className="cart-product" key={product.id}>
                <div className="product-attributes">
                  <h3>{product.brand}</h3>
                  <h4>{product.name}</h4>
                  <span>
                    {Object.values(
                      Object.values(
                        product.prices.filter(
                          (elementObj) =>
                            elementObj.currency.label ===
                            this.props.activeCurrency
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
                  </span>
                  {product.attributes.map((attribute) => (
                    <div key={attribute.id} className="attributes">
                      {attribute.id}
                      <div className="attribute">
                        {attribute.type === 'swatch'
                          ? attribute.items.map((item) => {
                              return (
                                <div
                                  key={item.id`swatch`}
                                  className={`attribute-value swatch ${
                                    this.props.cartProducts[product.id]
                                      .attributes[toCamelCase(attribute.id)] ===
                                    item.id
                                      ? ' active'
                                      : ''
                                  } `}
                                  style={{ backgroundColor: item.value }}
                                  title={item.id}
                                ></div>
                              );
                            })
                          : attribute.items.map((item) => {
                              return (
                                <div
                                  key={item.id}
                                  className={`attribute-value${
                                    this.props.cartProducts[product.id]
                                      .attributes[toCamelCase(attribute.id)] ===
                                    item.id
                                      ? ' active'
                                      : ''
                                  } `}
                                >
                                  {item.value}
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="product-info">
                  <div className="counter">
                    <Plus />
                    <div className="counter-value">1</div>
                    <Minus />
                  </div>
                  <div className="product-gallery">
                    <img src="" alt="hello" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      'Loading...'
    );
  }
}

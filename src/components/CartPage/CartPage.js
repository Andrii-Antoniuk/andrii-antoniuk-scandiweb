import React from 'react';
import { ReactComponent as Plus } from '../../images/plus.svg';
import { ReactComponent as Minus } from '../../images/minus.svg';
import { ReactComponent as ArrowLeft } from '../../images/arrowLeft.svg';
import { ReactComponent as ArrowRight } from '../../images/arrowRight.svg';
import { toCamelCase } from '../../utils/toCamelCase';
import './CartPage.css';
import { connect } from 'react-redux';
import { changeCount, deleteProduct } from '../../features/cartSlice';
import { shallowEqual } from 'react-redux';
import DeleteItem from '../DeleteItem/DeleteItem';
import OutsideAlerter from '../OutsideHandler/OutsideHandler';
import PopupWithTransition from '../PopupWithTransition/PopupWithTransition';

class CartPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0,
      showDelete: false,
      style: {},
      idToDelete: null,
      galleriesLengths: {},
    };
    this.showDelete = this.showDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleGalleryChange = this.handleGalleryChange.bind(this);
  }

  componentDidMount() {
    let total = 0;
    let galleries = {};
    for (let myProduct in this.props.products) {
      total +=
        this.props.products[myProduct].product.prices.find(
          (price) => price.currency.label === this.props.active.currency.label
        ).amount * this.props.products[myProduct].count;
      galleries[myProduct] = {
        l: this.props.products[myProduct].product.gallery.length,
        i: 0,
        hide: this.props.products[myProduct].product.gallery.length - 1 === 0,
      };
      console.log(galleries[myProduct].hide);
    }

    this.setState({ total: total.toFixed(2), galleriesLengths: galleries });
  }

  componentDidUpdate(prevProps) {
    if (
      shallowEqual(prevProps.products, this.props.products) &&
      shallowEqual(prevProps.active.currency, this.props.active.currency)
    ) {
      return;
    }
    let total = 0;
    let galleries = {};
    for (let myProduct in this.props.products) {
      total +=
        this.props.products[myProduct].product.prices.find(
          (price) => price.currency.label === this.props.active.currency.label
        ).amount * this.props.products[myProduct].count;
      galleries[myProduct] = {
        l: this.props.products[myProduct].product.gallery.length,
        i: 0,
      };
    }

    this.setState({ total: total.toFixed(2), galleriesLengths: galleries });
  }

  showDelete(event, id) {
    const child = event.currentTarget.getBoundingClientRect();
    const parent = document.querySelector('.cart').getBoundingClientRect();
    let style = {
      top: `${(child.top - parent.top - 35).toFixed(0)}px`,
      left: `${(child.left - parent.left - 50).toFixed(0)}px`,
    };
    this.setState({ showDelete: true, style, idToDelete: id });
  }

  cancelDelete(event) {
    if (event.target.classList[0] === 'minus') {
      return;
    }
    this.setState({ showDelete: false, style: {}, idToDelete: null });
  }

  confirmDelete() {
    this.props.dispatch(deleteProduct({ id: this.state.idToDelete }));
    this.setState({ showDelete: false, style: {}, idToDelete: null });
  }

  handleGalleryChange(id, direction) {
    this.setState({
      galleriesLengths: {
        ...this.state.galleriesLengths,
        [id]: {
          ...this.state.galleriesLengths[id],
          i:
            this.state.galleriesLengths[id].i + direction > -1
              ? this.state.galleriesLengths[id].i + direction <
                this.state.galleriesLengths[id].l
                ? this.state.galleriesLengths[id].i + direction
                : 0
              : this.state.galleriesLengths[id].l - 1,
        },
      },
    });
  }

  render() {
    return this.props.products.length !== 0 ? (
      <div className="page">
        <div className="cart">
          <div className="cart-info">
            <h2>Cart</h2>
            {Object.keys(this.props.products).length === 0 ? (
              <h1>You don't have anything in your cart =(</h1>
            ) : (
              Object.values(this.props.products).map((myProduct) => {
                const product = myProduct.product;
                const attributes = myProduct.attributes;
                return (
                  <div className="cart-product" key={myProduct.id}>
                    <div className="product-attributes">
                      <h3>{product.brand}</h3>
                      <h4>{product.name}</h4>
                      <span>
                        {Object.values(
                          Object.values(
                            product.prices.filter((elementObj) => {
                              return (
                                elementObj.currency.label ===
                                this.props.active.currency.label
                              );
                            })[0]
                          )
                            .slice(-2)
                            .map((price) => {
                              if (
                                typeof price === 'number' &&
                                isFinite(price)
                              ) {
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
                                      key={`swatch ` + item.id}
                                      className={`attribute-value swatch${
                                        attributes[
                                          toCamelCase(attribute.id)
                                        ] === item.id
                                          ? ' active'
                                          : ''
                                      }`}
                                      style={{
                                        backgroundColor: item.value,
                                      }}
                                      title={item.id}
                                    ></div>
                                  );
                                })
                              : attribute.items.map((item) => {
                                  return (
                                    <div
                                      key={item.id}
                                      className={`attribute-value${
                                        attributes[
                                          toCamelCase(attribute.id)
                                        ] === item.id
                                          ? ' active'
                                          : ''
                                      }`}
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
                        <div
                          onClick={() =>
                            this.props.dispatch(
                              changeCount({ id: myProduct.id, change: 1 })
                            )
                          }
                        >
                          <Plus />
                        </div>
                        <div className="counter-value">{myProduct.count}</div>
                        <div
                          onClick={(event) => {
                            if (myProduct.count > 0)
                              if (myProduct.count === 1) {
                                this.showDelete(event, myProduct.id);
                              } else
                                this.props.dispatch(
                                  changeCount({ id: myProduct.id, change: -1 })
                                );
                          }}
                        >
                          <Minus />
                        </div>
                      </div>
                      <div className="product-gallery">
                        <img
                          src={
                            product.gallery[
                              Object.keys(this.state.galleriesLengths)
                                .length !== 0
                                ? this.state.galleriesLengths[myProduct.id].i
                                : 0
                            ]
                          }
                          alt={product.name}
                        />
                        {Object.keys(this.state.galleriesLengths).length !==
                        0 ? (
                          this.state.galleriesLengths[myProduct.id]
                            .hide ? null : (
                            <>
                              <ArrowLeft
                                onClick={() =>
                                  this.handleGalleryChange(myProduct.id, -1)
                                }
                              />
                              <ArrowRight
                                onClick={() =>
                                  this.handleGalleryChange(myProduct.id, 1)
                                }
                              />
                            </>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div className="total">
              <span> </span>
              <h3>
                Total: &nbsp;
                {this.props.active.currency.symbol}
                {this.state.total}
              </h3>
            </div>
          </div>
          <OutsideAlerter handleClickOutside={this.cancelDelete}>
            <PopupWithTransition mounted={this.state.showDelete}>
              <DeleteItem
                style={this.state.style}
                cancelDelete={this.cancelDelete}
                confirmDelete={this.confirmDelete}
              />
            </PopupWithTransition>
          </OutsideAlerter>
        </div>
      </div>
    ) : (
      'Loading...'
    );
  }
}

const mapStateToProps = (state) => {
  const { cart, active } = state;
  return { active: active.active, products: cart.cart };
};

export default connect(mapStateToProps)(CartPage);

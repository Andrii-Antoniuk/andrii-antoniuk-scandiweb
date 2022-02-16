import React from 'react';
import { ReactComponent as ArrowLeft } from '../../images/arrowLeft.svg';
import { ReactComponent as ArrowRight } from '../../images/arrowRight.svg';
import './CartPage.css';
import { connect } from 'react-redux';
import { shallowEqual } from 'react-redux';
import DeleteItem from '../DeleteItem/DeleteItem';
import OutsideAlerter from '../OutsideHandler/OutsideHandler';
import PopupWithTransition from '../PopupWithTransition/PopupWithTransition';
import { Cart as PureCart } from '../Cart/Cart';
import Price from '../Price/Price';
import Counter from '../Counter/Counter';
import Attributes from '../Attributes/Attributes';

class CartPage extends PureCart {
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

  renderTotal() {
    return (
      <div className="total">
        <span> </span>
        <h3>
          Total: &nbsp;
          {this.props.active.currency.symbol}
          {this.state.total}
        </h3>
      </div>
    );
  }

  renderProducts() {
    return (
      <div className="cart-info">
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
                    <Price
                      product={product}
                      currency={this.props.active.currency}
                    />
                  </span>
                  <Attributes attributes={attributes} product={product} />
                </div>
                <div className="product-info">
                  <Counter myProduct={myProduct} showDelete={this.showDelete} />

                  <div className="product-gallery">
                    <img
                      src={
                        product.gallery[
                          Object.keys(this.state.galleriesLengths).length !== 0
                            ? this.state.galleriesLengths[myProduct.id].i
                            : 0
                        ]
                      }
                      alt={product.name}
                    />
                    {Object.keys(this.state.galleriesLengths).length !== 0 ? (
                      this.state.galleriesLengths[myProduct.id].hide ? null : (
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
        {this.renderTotal()}
      </div>
    );
  }

  render() {
    return this.props.products.length !== 0 ? (
      <div className="page">
        <div className="cart">
          <h2>Cart</h2>
        </div>
        {this.renderProducts()}
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

import React from 'react';
import { deleteProduct } from '../../features/cartSlice';
export class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.showDelete = this.showDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

  showDelete(event, id) {
    const child = event.currentTarget.getBoundingClientRect();
    const scrollTop = document.getElementById('cart-popup')
      ? document.getElementById('cart-popup').scrollTop
      : 0;
    const parent = document.getElementById('cart-popup')
      ? document.getElementById('cart-popup').getBoundingClientRect()
      : document.querySelector('.page').getBoundingClientRect();
    let style = {
      top: `${(scrollTop + child.top - parent.top - 35).toFixed(0)}px`,
      left: `${(child.left - parent.left - 50).toFixed(0)}px`,
    };
    console.log(style.top);

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
  render() {
    return;
  }
}

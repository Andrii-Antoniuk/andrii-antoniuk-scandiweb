import React from 'react';

import { ReactComponent as Plus } from '../../images/plus.svg';
import { ReactComponent as Minus } from '../../images/minus.svg';
import { changeCount } from '../../features/cartSlice';
import { connect } from 'react-redux';
class Counter extends React.Component {
  render() {
    return (
      <div className="counter">
        <Plus
          onClick={() =>
            this.props.dispatch(
              changeCount({ id: this.props.myProduct.id, change: 1 })
            )
          }
          className="plus"
        />

        <div className="counter-value">{this.props.myProduct.count}</div>

        <Minus
          className="minus"
          onClick={(event) => {
            if (this.props.myProduct.count > 0)
              if (this.props.myProduct.count === 1) {
                this.props.showDelete(event, this.props.myProduct.id);
              } else
                this.props.dispatch(
                  changeCount({ id: this.props.myProduct.id, change: -1 })
                );
          }}
        />
      </div>
    );
  }
}

export default connect()(Counter);

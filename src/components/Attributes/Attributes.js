import React from 'react';
import { toCamelCase } from '../../utils/toCamelCase';

export default class Attributes extends React.Component {
  render() {
    return this.props.product.attributes.map((attribute) => (
      <div key={attribute.id} className="attributes">
        <div className="attribute">
          {attribute.type === 'swatch'
            ? attribute.items.map((item) => {
                return (
                  <div
                    key={`swatch ` + item.id}
                    className={`attribute-value swatch${
                      this.props.attributes[toCamelCase(attribute.id)] ===
                      item.id
                        ? ' active'
                        : ''
                    } ${this.props.mini}`}
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
                      this.props.attributes[toCamelCase(attribute.id)] ===
                      item.id
                        ? ' active'
                        : ''
                    } ${this.props.mini}`}
                  >
                    {item.value.slice(0, 3)}
                  </div>
                );
              })}
        </div>
      </div>
    ));
  }
}

Attributes.defaultProps = {
  mini: '',
};

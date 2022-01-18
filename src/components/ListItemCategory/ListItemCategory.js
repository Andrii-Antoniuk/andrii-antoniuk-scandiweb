import React from 'react';

import './ListItemCategory.css';

export class ListItemCategory extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      style: {
        width: this.props.widths[0],
        left: 0,
      },
    };
  }
  handleClick(event) {
    const liItemIndex = parseInt(event.target.classList[0]);

    let widths = this.props.widths;
    let widthLeft = 0;
    for (let i = 0; i < widths.length; i++) {
      if (i === liItemIndex) {
        break;
      }
      widthLeft += widths[i];
    }
    this.setState({
      style: {
        width: widths[liItemIndex],
        left: widthLeft,
      },
    });
  }
  render() {
    return (
      <>
        <nav>
          {this.props.categories ? (
            <ul className="list-elements">
              {this.props.categories.map((element, index) => (
                <li
                  key={element}
                  onClick={(event) => {
                    this.props.catChange(event);
                    this.handleClick(event);
                  }}
                  className={
                    element === this.props.activeCategory
                      ? `${index} active`
                      : index
                  }
                >
                  {element}
                </li>
              ))}
              <div style={this.state.style}></div>
            </ul>
          ) : null}
        </nav>
      </>
    );
  }
}

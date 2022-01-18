import React from 'react';
import getSymbolFromCurrency from 'currency-symbol-map';

export class CurrencySwitch extends React.Component {
  constructor(props) {
    super(props);
    this.transitionEnd = this.transitionEnd.bind(this);
    this.mountStyle = this.mountStyle.bind(this);
    this.unMountStyle = this.unMountStyle.bind(this);
    this.state = {
      style: {
        opacity: 0,
        transition: 'all 1s ease',
      },
      show: false,
    };
  }
  // all stuff about transition copied from StackOverflow, then I made some changes due to React v17 (I don't want to use UNSAFE_*** methods). I understand how this work
  componentDidUpdate(prevProps) {
    if (this.props.mounted === false && prevProps.mounted === true) {
      return this.unMountStyle();
    }
    if (this.props.mounted === true && prevProps.mounted === false) {
      this.setState({ show: true });
      setTimeout(this.mountStyle, 10);
    }
  }

  unMountStyle() {
    // css for unmount animation
    this.setState({
      style: {
        opacity: 0,
        transition: 'all 1s ease',
      },
    });
  }

  mountStyle() {
    // css for mount animation
    this.setState({
      style: {
        opacity: 1,
        transition: 'all 2s ease',
      },
    });
  }

  /* componentDidMount() {
    setTimeout(this.mountStyle, 10); // call the into animation
  } */

  transitionEnd() {
    if (!this.props.mounted) {
      // remove the node on transition end when the mounted prop is false
      this.setState({
        show: false,
      });
    }
  }

  render() {
    return (
      this.state.show && (
        <div
          id="switch"
          onMouseLeave={this.props.handleLeave}
          onMouseEnter={this.props.cancelLeave}
          style={this.state.style}
          onTransitionEnd={this.transitionEnd}
        >
          {this.props.currencies && (
            <ul>
              {this.props.currencies.map((element) => (
                <li key={element} onClick={this.props.curChange}>
                  <span>
                    {getSymbolFromCurrency(element)} {element}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    );
  }
}

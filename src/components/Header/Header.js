import React from 'react';
import { ReactComponent as Logo } from '../../images/logo.svg';
import { Actions } from '../Actions/Actions';
import { ListItemCategory } from '../ListItemCategory/ListItemCategory';
import { getCurrencyNames } from '../../utils/apolloClient';
import './Header.css';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriesNames: [],
      categoriesWidths: [],
      currencyNames: [],
    };
  }
  componentDidMount() {
    getCurrencyNames().then((result) =>
      this.setState({ currencyNames: result })
    );
  }

  componentDidUpdate() {
    //Not into componentDidMount because after first render items from graphQL are not fetched yet.
    /* Here: if I don't get width yet I mapping throw categoriesNames array and for each Name get li element via query selector, than returning its ceiled width to use in animation
     */
    if (
      this.state.categoriesWidths.length !== this.props.categoriesNames.length
    ) {
      this.setState({
        categoriesWidths: this.props.categoriesNames.map((elem, index) =>
          Math.ceil(
            document
              .querySelector(`.${CSS.escape(index)}`)
              .getBoundingClientRect().width
          )
        ),
      });
    }
  }

  render() {
    return (
      <header>
        <ListItemCategory
          categories={this.props.categoriesNames}
          catChange={this.props.catChange}
          activeCategory={this.props.activeCategory}
          widths={this.state.categoriesWidths}
          pageChange={() => this.props.pageChange('category')}
        />

        <Logo />
        <Actions
          currencies={this.state.currencyNames}
          curChange={this.props.curChange}
          activeCurrency={this.props.activeCurrency}
          pageChange={() => this.props.pageChange('cart')}
        />
      </header>
    );
  }
}

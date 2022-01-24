import React from 'react';
import { Header } from './components/Header/Header';
import './App.css';
import { Page } from './components/Page/Page';
import { getCategoryNames } from './utils/apolloClient';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveCategoryChange =
      this.handleActiveCategoryChange.bind(this);
    this.handleActiveCurrencyChange =
      this.handleActiveCurrencyChange.bind(this);
    this.handleActivePageChange = this.handleActivePageChange.bind(this);
    this.handleActiveProductChange = this.handleActiveProductChange.bind(this);
    this.handleProductCountChange = this.handleProductCountChange.bind(this);

    this.state = {
      activeCurrency:
        JSON.parse(localStorage.getItem('activeCurrency')) || 'USD',
      activeCategory:
        JSON.parse(localStorage.getItem('activeCategory')) || 'all',
      activePage: JSON.parse(localStorage.getItem('activePage')) || 'category',
      activeProduct: JSON.parse(localStorage.getItem('activeProduct')) || '',
      cartProducts: JSON.parse(localStorage.getItem('cartProducts')) || {},
      categoriesNames: [],
      isShowingCart: false,
    };
  }

  componentDidMount() {
    getCategoryNames().then((result) =>
      this.setState({ categoriesNames: result })
    );
  }

  handleActiveCurrencyChange(event) {
    this.setState(
      {
        activeCurrency: event.target.textContent.toString().slice(-3),
      },
      () => {
        localStorage.setItem(
          'activeCurrency',
          JSON.stringify(this.state.activeCurrency)
        );
      }
    );
  }

  handleActiveCategoryChange(event) {
    this.setState(
      {
        activeCategory: event.target.textContent,
      },
      () => {
        localStorage.setItem(
          'activeCategory',
          JSON.stringify(this.state.activeCategory)
        );
      }
    );
  }

  handleActivePageChange(page) {
    this.setState({ activePage: page }, () => {
      localStorage.setItem('activePage', JSON.stringify(this.state.activePage));
    });
  }

  handleActiveProductChange(product) {
    this.setState({ activeProduct: product }, () => {
      localStorage.setItem(
        'activeProduct',
        JSON.stringify(this.state.activeProduct)
      );
    });
  }

  handleProductCountChange(product, attributes = {}, addOrSubstract = 1) {
    if (this.state.cartProducts[product]) {
      this.setState(
        (prevState) => ({
          cartProducts: {
            ...this.state.cartProducts,
            [product]: {
              ...this.state.cartProducts[product],
              count: prevState.cartProducts[product].count + addOrSubstract,
            },
          },
        }),
        () => {
          if (this.state.cartProducts[product] === 0) {
            this.setState(
              {
                cartProducts: {
                  ...this.state.cartProducts,
                  [product]: undefined,
                },
              },
              () => {
                localStorage.setItem(
                  'cartProducts',
                  JSON.stringify(this.state.cartProducts)
                );
              }
            );
          } else
            localStorage.setItem(
              'cartProducts',
              JSON.stringify(this.state.cartProducts)
            );
        }
      );
    } else {
      this.setState(
        {
          cartProducts: {
            ...this.state.cartProducts,
            [product]: { count: 1, attributes: attributes },
          },
        },
        () => {
          localStorage.setItem(
            'cartProducts',
            JSON.stringify(this.state.cartProducts)
          );
        }
      );
    }
  }

  render() {
    return (
      <>
        <Header
          curChange={this.handleActiveCurrencyChange}
          catChange={this.handleActiveCategoryChange}
          activeCurrency={this.state.activeCurrency}
          activeCategory={this.state.activeCategory}
          categoriesNames={this.state.categoriesNames}
          pageChange={this.handleActivePageChange}
        />

        <Page
          pageChange={this.handleActivePageChange}
          categoriesNames={this.state.categoriesNames}
          activeCategory={this.state.activeCategory}
          activeCurrency={this.state.activeCurrency}
          activePage={this.state.activePage}
          activeProduct={this.state.activeProduct}
          productChange={this.handleActiveProductChange}
          countChange={this.handleProductCountChange}
          cartProducts={this.state.cartProducts}
        />
      </>
    );
  }
}

export default App;

//I know that I can use Redux for state, but I don't want to use connectAPI right now with class components

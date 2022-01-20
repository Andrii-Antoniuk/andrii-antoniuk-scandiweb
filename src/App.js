import React from 'react';
import { Header } from './components/Header/Header';
import './App.css';
import { CategoryPage } from './components/CategoryPage/CategoryPage';
import { getCategoryNames } from './utils/apolloClient';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveCategoryChange =
      this.handleActiveCategoryChange.bind(this);

    this.handleActiveCurrencyChange =
      this.handleActiveCurrencyChange.bind(this);
    this.state = {
      activeCurrency:
        JSON.parse(localStorage.getItem('activeCurrency')) || 'USD',
      activeCategory:
        JSON.parse(localStorage.getItem('activeCategory')) || 'all',
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

  render() {
    return (
      <>
        <Header
          curChange={this.handleActiveCurrencyChange}
          catChange={this.handleActiveCategoryChange}
          activeCurrency={this.state.activeCurrency}
          activeCategory={this.state.activeCategory}
          categoriesNames={this.state.categoriesNames}
        />

        <CategoryPage
          categoriesNames={this.state.categoriesNames}
          activeCategory={this.state.activeCategory}
          activeCurrency={this.state.activeCurrency}
        />
      </>
    );
  }
}

export default App;

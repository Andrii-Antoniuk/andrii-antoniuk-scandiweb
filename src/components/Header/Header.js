import React from 'react';
import { ReactComponent as Logo } from '../../images/logo.svg';
import Actions from '../Actions/Actions';
import ListItemCategory from '../ListItemCategory/ListItemCategory';
import './Header.css';
import { connect } from 'react-redux';
import { getProducts } from '../../features/productsSlice';

class Header extends React.Component {
  componentDidMount() {
    this.props.dispatch(getProducts());
  }
  render() {
    return (
      <header>
        <ListItemCategory />

        <Logo />
        <Actions />
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  const { active, categories } = state;
  return { active: active.active, categories: categories.categories };
};

export default connect(mapStateToProps)(Header);

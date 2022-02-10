import React from 'react';
import { ReactComponent as Logo } from '../../images/logo.svg';
import Actionscopy from '../Actions/Actionscopy';
import ListItemCategorycopy from '../ListItemCategory/ListItemCategorycopy';
import './Header.css';
import { connect } from 'react-redux';

class Headercopy extends React.Component {
  render() {
    return (
      <header>
        <ListItemCategorycopy />

        <Logo />
        <Actionscopy />
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  const { active, categories } = state;
  return { active: active.active, categories: categories.categories };
};

export default connect(mapStateToProps)(Headercopy);

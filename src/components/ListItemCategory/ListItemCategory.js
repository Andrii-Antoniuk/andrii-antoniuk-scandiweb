import React from 'react';
import { connect } from 'react-redux';
import {
  changeActiveCategory,
  changeActivePage,
  changeActiveProduct,
} from '../../features/activeSlice';
import { getCategoriesNames } from '../../features/categoriesSlice';
import './ListItemCategory.css';

class ListItemCategory extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      categoriesWidths: [],
      style: {
        width: '',
        left: 0,
      },
    };
  }

  componentDidMount() {
    this.props
      .dispatch(getCategoriesNames())
      .then((result) =>
        this.props.dispatch(changeActiveCategory(result.payload[0]))
      )
      .catch((error) => {
        console.log('Yes, backend is not working');
      });
  }

  componentDidUpdate() {
    if (!this.state.categoriesWidths.length && this.props.categories.names) {
      this.setState(
        {
          categoriesWidths: this.props.categories.names.map((elem, index) =>
            Math.ceil(
              document
                .querySelector(`.${CSS.escape(index)}`)
                .getBoundingClientRect().width
            )
          ),
        },
        () => {
          this.setState({
            style: {
              ...this.state.style,
              width: this.state.categoriesWidths[0],
            },
          });
        }
      );
    }
  }

  handleClick(event) {
    const liItemIndex = parseInt(event.target.classList[0]);

    let widths = this.state.categoriesWidths;
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

  renderCategoriesNames() {
    return this.props.categories.names.map((element, index) => (
      <li
        key={element}
        onClick={(event) => {
          this.props.dispatch(changeActiveCategory(element));
          this.props.dispatch(changeActivePage('plp'));
          this.props.dispatch(changeActiveProduct(''));
          this.handleClick(event);
        }}
        className={
          element === this.props.active.category ? `${index} active` : index
        }
      >
        {element}
      </li>
    ));
  }

  render() {
    return (
      <nav>
        {this.props.categories.names ? (
          <ul className="list-elements">
            {this.renderCategoriesNames()}
            <div style={this.state.style}></div>
          </ul>
        ) : null}
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  const { active, categories } = state;
  return { active: active.active, categories: categories.categories };
};

export default connect(mapStateToProps)(ListItemCategory);

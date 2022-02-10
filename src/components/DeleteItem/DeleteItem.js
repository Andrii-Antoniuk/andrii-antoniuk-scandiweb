import React from 'react';

export default class DeleteItem extends React.Component {
  render() {
    return (
      <div className="confirm-delete popup" style={this.props.style}>
        <div className="buttons">
          <button className="transparent" onClick={this.props.cancelDelete}>
            Cancel
          </button>
          <button className="transparent" onClick={this.props.confirmDelete}>
            Delete
          </button>
        </div>
      </div>
    );
  }
}

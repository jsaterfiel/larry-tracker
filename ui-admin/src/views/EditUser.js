import React, { Component } from 'react';

class EditUser extends Component {

  render() {
    let id = this.props.match.params.id;
    return (
      <div className="EditUserPage">
        EditUser page for {id}
      </div>
    );
  }
}

export default EditUser;
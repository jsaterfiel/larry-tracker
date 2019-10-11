import React, { Component } from 'react';
//import { Form, Button, Alert } from 'react-bootstrap';
import './Users.css';


class Users extends Component {
  constructor(props) {
    super(props);

    this.showUsers = this.showUsers.bind(this);

    this.state = { showNames: false };
  }

  showUsers() {
    this.setState({
      showNames: true
    });
  }

  render() {
    return (
      <div className="UsersPage">
        Users page
        <img src="https://via.placeholder.com/20x20" alt='Testing any images'/>
              <h1>{this.props.title}</h1>
              {this.state.showNames ?
                  <p>
                      <span className="userRow">Mickey Mouse</span>
                      <span className="userRow">Donald Duck</span>
                      <span className="userRow">Minnie Mouse</span>
                      <span className="userRow">Princess Meghan</span>
                      <span className="userRow">Prince Charles</span>
                      <span className="userRow">Princess Diane</span>
                  </p>
                  :
                  <button onClick={this.showUsers}>Click to see this list of users</button>
              }
      </div>
    );
  }
}

export default Users;



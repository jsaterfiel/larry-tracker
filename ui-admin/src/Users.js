import React, { Component } from 'react';
//import { Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class Users extends Component {
  constructor(props) {
    super(props);

    this.doUsers = this.doUsers.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    this.state = { showAlert: false };
  }
  componentWillUpdate(nextProps) {
  }

  doUsers() {
    this.setState({
      showAlert: true
    });
  }

  dismissAlert() {
    this.setState({
      showAlert: false
    });
  }

  render() {
    console.log(this.state)
  const tech = {
      background: '#4db1e8',
      color: '#fff',
      padding: '5px',
      marginRight: '5px'
  }
    return (
      <div className="UsersPage">
        Users page
        <img src={this.props.img_url} alt='Testing any images' height="250px"/>
              <h1>{this.props.title}</h1>
              {this.state.show_technologies ?
                  <p>
                      <span style={tech}>Mickey Mouse</span>
                      <span style={tech}>Donald Duck</span>
                      <span style={tech}>Minnie Mouse</span>
                      <span style={tech}>Princess Meghan</span>
                      <span style={tech}>Prince Charles</span>
                      <span style={tech}>Princess Diane</span>
                  </p>
                  :
                  <button onClick={this.see_our_technologies}>Click to see this list of users</button>
              }
      </div>
    );
  }
}

export default Users;



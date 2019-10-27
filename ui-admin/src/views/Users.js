import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import AuthAPI from '../services/auth';
import UsersAPI from '../services/users';
import "./Users.css"

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [], errorMsg: '' };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    UsersAPI.getUsers()
      .then( data => {
        if (!this._isMounted || !data) return;
        this.setState({
          users: data
        })
      })
      .catch( err => {
        if (!this._isMounted) return;
        if (err && err.response && err.response.data) {
          this.setState({
            errorMsg: err.response.data.error
          });
        } else {
          this.setState({
            errorMsg: 'Unknown Error'
          });
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    // check if the user is logged in and is an admin.  Using a redirect below to take non admins back to home.
    const loginData = AuthAPI.getLoginData();
    return (
      <div className="UsersPage container">
        { (!loginData || loginData.userType !== 'admin') ? (
          <Redirect to='/' />
        ) : (
        <div className="col">
          <div className="row mt-5">
          {this.state.errorMsg &&
            <div className="col text-center">
              <Alert variant="danger" onClose={this.dismissAlert} dismissible className="col-xs">
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  {this.state.errorMsg}
                </p>
              </Alert>
            </div>}
            <ul>
            {this.state.users.map((user) => 
              <li key={user.username}>{user.username}</li>
            )}
            </ul>
          </div>
        </div>)}
      </div>
    );
  }
}

export default Users;



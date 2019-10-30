import React, { Component } from 'react';
import { Alert, Table, Button, Badge } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import AuthAPI from '../services/auth';
import UsersAPI from '../services/users';
import "./Users.css"

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      errorMsg: '',
      redirectAddUser: false
    };
    this._isMounted = false;

    this.doAddUser = this.doAddUser.bind(this);
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

  doAddUser() {
    this.setState({
      redirectAddUser: true
    })
  }

  render() {
    // check if the user is logged in and is an admin.  Using a redirect below to take non admins back to home.
    const loginData = AuthAPI.getLoginData();
    if (!loginData || loginData.userType !== 'admin') {
      return  <Redirect to='/' />;
    }
    if (this.state.redirectAddUser) {
      return <Redirect to='/add-user' />;
    }
    return (
      <div className="UsersPage container">
        <div className="col">
          {this.state.errorMsg &&
          <div className="row mt-5 text-center BasicWidth">
            <Alert variant="danger" onClose={this.dismissAlert} dismissible className="col-xs">
              <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
              <p>
                {this.state.errorMsg}
              </p>
            </Alert>
          </div>}
          <div className="row">
            <div className="col">
              <h1>Users</h1>
            </div>
            <div className="col text-right mt-2">
              <Button onClick={this.doAddUser}>Add User</Button>
            </div>
          </div>
          <div className="row">
            <Table striped boardered="true" hover>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
              {this.state.users.map((user) => 
                <tr key={user.username}>
                  <td><Link to={'/dashboard/' + user.username}>{user.username}</Link></td>
                  <td>{user.name}</td>
                  <td>{user.company}</td>
                  <td>{user.userType === "admin" ?
                    (<Badge pill variant="danger">Admin</Badge>) : (<Badge pill variant="info">User</Badge>)}</td>
                  <td>{user.active === 1 ?
                    (<Badge pill variant="primary">Active</Badge>) : (<Badge pill variant="secondary">Inactive</Badge>)}</td>
                  <td><Link to={'/users/' + user.username}>Edit</Link></td>
                </tr>
              )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default Users;



import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import AuthAPI from '../services/auth';
import UsersAPI from '../services/users';

class AddUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: '',
      username: false,
      name: false,
      company: false,
      userType: 'user',
      email: false,
      clientCode: false,
      redirectUsers: false
    };

    this.getUsername = this.getUsername.bind(this);
    this.getUserType = this.getUserType.bind(this);
    this.getEmail = this.getEmail.bind(this);
    this.getName = this.getName.bind(this);
    this.getClientCode = this.getClientCode.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.doAddUser = this.doAddUser.bind(this);
  }

  getUsername(evt) {
    this.setState({
      username: evt.target.value
    });
  }

  getUserType(evt) {
    const type = evt.target.value;
    if (type === 'admin') {
      this.setState({
        userType: type,
        clientCode: ''
      });
    } else {
      this.setState({
        userType: type
      });
    }
  }

  getName(evt) {
    this.setState({
      name: evt.target.value
    });
  }

  getCompany(evt) {
    this.setState({
      company: evt.target.value
    });
  }

  getEmail(evt) {
    this.setState({
      email: evt.target.value
    });
  }
  
  getClientCode(evt) {
    this.setState({
      clientCode: evt.target.value
    });
  }

  dismissAlert() {
    this.setState({
      errorMsg: ''
    });
  }

  async doAddUser() {
    if (!this.state.name) {
      this.setState({
        errorMsg: 'Name is required'
      });
      return;
    }
    if (!this.state.email) {
      this.setState({
        errorMsg: 'Email is required'
      });
      return;
    }
    if (!this.state.company) {
      this.setState({
        errorMsg: 'Company is required'
      });
      return;
    }
    if (this.state.userType === "user" && !this.state.clientCode) {
      this.setState({
        errorMsg: 'Client Code is required'
      });
      return;
    }

    try {
      await UsersAPI.addUser(this.state.username, this.state.name, this.state.company, this.state.userType, this.state.email, this.state.clientCode);
    } catch (err) {
      if (err && err.response && err.response.data) {
        this.setState({
          errorMsg: err.response.data.error
        });
      } else {
        this.setState({
          errorMsg: 'Unknown Error'
        });
      }
      return;
    }
    this.setState({
      redirectUsers: true
    });
  }

  render() {
    const loginData = AuthAPI.getLoginData();
    if (!loginData || loginData.userType !== 'admin') {
      return  <Redirect to='/' />;
    }
    if (this.state.redirectUsers) {
      return <Redirect to ='/users' />
    }
    return (
      <div className="AddUserPage BasicWidth container">
        <div className="col">
          <div className="row mt-1">
            <div className="col text-center">
              <h1 className="primary">Add User</h1>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <Form className="text-left">
                {this.state.errorMsg &&
                <Alert variant="danger" onClose={this.dismissAlert} dismissible className="col-xs">
                  <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                  <p>
                    {this.state.errorMsg}
                  </p>
                </Alert>}
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" onChange={this.getUsername}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Name" onChange={this.getName}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" placeholder="Email" onChange={this.getEmail}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Company</Form.Label>
                  <Form.Control type="text" placeholder="Company" onChange={this.getCompany}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>User Type</Form.Label>
                  <Form.Control as="select" onChange={this.getUserType}>
                    <option></option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </Form.Control>
                </Form.Group>
                {this.state.userType === "user" &&
                <Form.Group>
                  <Form.Label>Client Code</Form.Label>
                  <Form.Control type="text" placeholder="Client Code" onChange={this.getClientCode}/>
                </Form.Group>}
              </Form>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Button variant="primary" onClick={this.doAddUser}>
                Create
              </Button>
            </div>
            <div className="col text-right mt-2">
              <Link to="/users">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddUser;

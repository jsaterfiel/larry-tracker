import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthAPI from '../services/auth';
import logoPic from '../larry.png';

class Login extends Component {
  constructor(props) {
    super(props);

    this.doLogin = this.doLogin.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getPassword = this.getPassword.bind(this);

    this.state = { errorMsg: '', username: '', password: '' };
  }
  
  doLogin() {
    // ignore if we don't have the data to make the call
    if (!this.state.username || !this.state.password) return;

    AuthAPI.login(this.state.username, this.state.password)
      .then( data => {
        this.setState({
          login: data
        });
      })
      .catch( err => {
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

  dismissAlert() {
    this.setState({
      errorMsg: ''
    });
  }

  getUsername(username) {
    this.setState({
      username: username.target.value
    });
  }

  getPassword(password) {
    this.setState({
      password: password.target.value
    });
  }

  render() {
    if (this.state.login) {
      if (this.state.login.userType === 'user') {
        return <Redirect to={'/dashboard/' + this.state.login.username} />;
      }
      return <Redirect to='/users' />;
    }
    return (
      <div className="LoginPage container">
        <div className="col">
          <div className="row">
            <div className="col text-center">
              <h1 className="primary">Welcome to<br/>Larry Tracker!</h1>
            </div>
          </div>
          <div className="row">
            <div className="col text-center">
              <img src={logoPic} alt="site logo" className="logo"/>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col text-center">
              <Form className="text-left">
              {this.state.errorMsg &&
              <Alert variant="danger" onClose={this.dismissAlert} dismissible className="col-xs">
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                  {this.state.errorMsg}
                </p>
              </Alert>}
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Login</Form.Label>
                <Form.Control type="text" placeholder="Enter username" onChange={this.getUsername}/>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.getPassword}/>
              </Form.Group>
              <Button variant="primary" onClick={this.doLogin}>
                Login
              </Button>
            </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

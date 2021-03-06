import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthAPI from '../services/auth';
import logoPic from '../larry.png';

class Login extends Component {
  constructor(props) {
    super(props);

    this.loggedIn = props.loggedIn;
    this.doLogin = this.doLogin.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getPassword = this.getPassword.bind(this);

    this.state = { errorMsg: '', username: '', password: '' };

    this._isMounted = false;
  }
  
  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  doLogin() {
    // ignore if we don't have the data to make the call
    if (!this.state.username || !this.state.password) return;

    AuthAPI.login(this.state.username, this.state.password)
      .then( data => {
        if (this._isMounted) {
          this.loggedIn();
        }
        if (this._isMounted) {
          this.setState({
            login: data
          });
        }
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
    const loginData = AuthAPI.getLoginData();
    let loginType;
    let username;
    if (loginData && loginData.userType) {
      loginType = loginData.userType;
      username = loginData.username;
    }
    if (this.state.login && this.state.login.userType) {
      loginType = this.state.login.userType;
      username = this.state.login.username;
    }
    if (loginType) {
      if (loginType === 'user') {
        return <Redirect to={'/dashboard/' + username} />;
      }
      return <Redirect to='/users' />;
    }
    return (
      <div className="LoginPage BasicWidth container">
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
              </Form>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Button variant="primary" onClick={this.doLogin}>Login</Button>
            </div>
            <div className="col text-right mt-2">
              <Link to="/reset-password">Reset Password</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

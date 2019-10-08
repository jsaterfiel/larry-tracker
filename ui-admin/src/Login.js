import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.doLogin = this.doLogin.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);

    this.state = { showAlert: false };
  }
  componentWillUpdate(nextProps) {
  }

  doLogin() {
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
    return (
      <div className="LoginPage center_div">
        <Form>
          {this.state.showAlert &&
        <Alert variant="danger" onClose={this.dismissAlert} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p>
        </Alert>}
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Login</Form.Label>
            <Form.Control type="text" placeholder="Enter username" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" onClick={this.doLogin}>
            Login
          </Button>
        </Form>
      </div>
    );
  }
}

export default Login;

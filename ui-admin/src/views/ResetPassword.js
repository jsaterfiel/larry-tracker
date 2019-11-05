import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthAPI from '../services/auth';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMsg: '',
      username: false,
      securityQuestion: false,
      securityAnswer: false,
      newPassword: false,
      redirectHome: false
    };

    this.getUsername = this.getUsername.bind(this);
    this.getSecurityQuestion = this.getSecurityQuestion.bind(this);
    this.getSecurityAnswer = this.getSecurityAnswer.bind(this);
    this.getNewPassword = this.getNewPassword.bind(this);
    this.doResetPassword = this.doResetPassword.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
  }

  getUsername(evt) {
    this.setState({
      username: evt.target.value
    });
  }

  getSecurityQuestion(evt) {
    this.setState({
      securityQuestion: evt.target.value
    });
  }

  getSecurityAnswer(evt) {
    this.setState({
      securityAnswer: evt.target.value
    });
  }

  getNewPassword(evt) {
    this.setState({
      newPassword: evt.target.value
    });
  }

  async doResetPassword() {
    if (!this.state.username) {
      this.setState({
        errorMsg: 'Login is required'
      });
      return;
    }
    if (!this.state.securityQuestion) {
      this.setState({
        errorMsg: 'Security Question is required'
      });
      return;
    }
    if (!this.state.securityAnswer) {
      this.setState({
        errorMsg: 'Security Answer is required'
      });
      return;
    }
    if (!this.state.newPassword) {
      this.setState({
        errorMsg: 'New Password is required'
      });
      return;
    }

    try {
      await AuthAPI.resetPassword(this.state.username, this.state.securityQuestion, this.state.securityAnswer, this.state.newPassword);
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
      redirectHome: true
    })
  }

  dismissAlert() {
    this.setState({
      errorMsg: ''
    })
  }

  render() {
    if (this.state.redirectHome) {
      return <Redirect to='/' />;
    }
    return (
      <div className="ResetPasswordPage BasicWidth container">
        <div className="col">
          <div className="row">
            <div className="col text-center">
              <h1 className="primary">Reset Password</h1>
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
                <Form.Group>
                  <Form.Label>Login</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" onChange={this.getUsername}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Your Security Question</Form.Label>
                  <Form.Control as="select" onChange={this.getSecurityQuestion}>
                    <option></option>
                    <option>What is your favorite color?</option>
                    <option>What is your favorite movie?</option>
                    <option>Who is your favorite teacher?</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Your Security Answer</Form.Label>
                  <Form.Control type="text" placeholder="Security Answer" onChange={this.getSecurityAnswer}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" placeholder="New Password" onChange={this.getNewPassword}/>
                </Form.Group>
                <Button variant="primary" onClick={this.doResetPassword}>
                  Reset Password
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;

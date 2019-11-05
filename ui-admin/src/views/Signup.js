import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import AuthAPI from '../services/auth';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.username = props.location.search.substring(10);
    this.signupHash = props.match.params.signupHash;

    this.state = {
      errorMsg: '',
      securityQuestion: false,
      securityAnswer: false,
      password: false,
      confirmPassword: false,
      redirectHome: false
    };

    this.getSecurityQuestion = this.getSecurityQuestion.bind(this);
    this.getSecurityAnswer = this.getSecurityAnswer.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.getConfirmPassword = this.getConfirmPassword.bind(this);
    this.doSignup = this.doSignup.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
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

  getPassword(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  getConfirmPassword(evt) {
    this.setState({
      confirmPassword: evt.target.value
    });
  }

  async doSignup() {
    if (!this.username) {
      this.setState({
        errorMsg: 'Invalid link'
      });
      return;
    }
    if (!this.signupHash) {
      this.setState({
        errorMsg: 'Invalid link'
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
    if (!this.state.password) {
      this.setState({
        errorMsg: 'Password is required'
      });
      return;
    }
    if (!this.state.confirmPassword || this.state.confirmPassword !== this.state.password) {
      this.setState({
        errorMsg: 'Must confirm password'
      });
      return;
    }

    try {
      await AuthAPI.signup(this.signupHash, this.username, this.state.securityQuestion, this.state.securityAnswer, this.state.password);
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
      <div className="SignupPage BasicWidth container">
        <div className="col">
          <div className="row">
            <div className="col text-center">
              <h1 className="primary">Welcome to Larry Tracker</h1>
              <p>Please finish setting up your account</p>
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
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={this.getPassword}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm Password" onChange={this.getConfirmPassword}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Security Question</Form.Label>
                  <Form.Control as="select" onChange={this.getSecurityQuestion}>
                    <option></option>
                    <option>What is your favorite color?</option>
                    <option>What is your favorite movie?</option>
                    <option>Who is your favorite teacher?</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Security Answer</Form.Label>
                  <Form.Control type="text" placeholder="Security Answer" onChange={this.getSecurityAnswer}/>
                </Form.Group>
                <Button variant="primary" onClick={this.doSignup}>
                  Finish
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;

import React, { Component } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import AuthAPI from '../services/auth';
import UsersAPI from '../services/users';

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      userType: '',
      name: '',
      email: '',
      company: '',
      clientCode: '',
      active: 1,
      signupHash: '',
      copySuccess: false,
      redirectUsers: false
    };

    this.getEmail = this.getEmail.bind(this);
    this.getName = this.getName.bind(this);
    this.getClientCode = this.getClientCode.bind(this);
    this.getCompany = this.getCompany.bind(this);
    this.getActive = this.getActive.bind(this);
    this.copySignupHash = this.copySignupHash.bind(this);
    this.dismissAlert = this.dismissAlert.bind(this);
    this.doUpdateUser = this.doUpdateUser.bind(this);
    this.handleCopySuccess = this.handleCopySuccess.bind(this);

    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    let user;
    try {
      user = await UsersAPI.getUser(this.props.match.params.username);
      // fix to ensure the component actually loaded
      if (!this._isMounted || !user) return;
    } catch (err) {
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
      return;
    }

    this.setState({
      username: user.username,
      userType: user.userType,
      name: user.name,
      email: user.email,
      company: user.company,
      clientCode: user.clientCode,
      signupHash: user.signupHash,
      active: user.active
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  getActive() {
    // this will toggle instead of reading the incomming even due to how checkboxes work
    this.setState({
      active: this.state.active === 1 ? 0 : 1
    });
  }

  /**
   * created from https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
   */
  copySignupHash() {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = document.location.protocol + "//" + document.location.host + "/signup/" + this.state.signupHash;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);

    this.setState({
      copySuccess: true
    });

    setTimeout(this.handleCopySuccess, 2000);
  }

  handleCopySuccess() {
    this.setState({
      copySuccess: false
    })
  }

  dismissAlert() {
    this.setState({
      errorMsg: ''
    });
  }

  async doUpdateUser() {
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
      await UsersAPI.updateUser(this.state.username, this.state.name, this.state.company, this.state.email, this.state.clientCode, this.state.active);
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
      <div className="EditUserPage BasicWidth container">
        <div className="col">
          <div className="row mt-1">
            <div className="col text-center">
              <h1 className="primary">Edit User</h1>
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
                  <Form.Control type="text" readOnly value={this.state.username} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Name" onChange={this.getName} value={this.state.name}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" placeholder="Email" onChange={this.getEmail} value={this.state.email}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Company</Form.Label>
                  <Form.Control type="text" placeholder="Company" onChange={this.getCompany} value={this.state.company}/>
                </Form.Group>
                <Form.Group>
                  <Form.Label>User Type</Form.Label>
                  <Form.Control type="text" readOnly value={this.state.userType}/>
                </Form.Group>
                {this.state.userType !== "admin" &&
                <Form.Group>
                  <Form.Label>Client Code</Form.Label>
                  <Form.Control type="text" placeholder="Client Code" onChange={this.getClientCode} value={this.state.clientCode}/>
                </Form.Group>}
                <Form.Group>
                  <Form.Check type="checkbox" onChange={this.getActive} label="Active" checked={this.state.active}/>
                </Form.Group>
              </Form>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Button variant="primary" onClick={this.doUpdateUser}>
                Update
              </Button>
              </div>
              { this.state.signupHash &&
                <div className="col-6">
                  {this.state.copySuccess ? 
                    ( <Button variant="success" onClick={this.copySignupHash}>Copied!</Button>)
                    : (<Button variant="outline-secondary" onClick={this.copySignupHash}>Signup Link</Button>)}
                </div>
              }
            <div className="col text-right mt-2">
              <Link to="/users">Cancel</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditUser;
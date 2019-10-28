import React, { Component } from 'react';
import { Alert, ListGroup } from 'react-bootstrap';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
class EditUser extends Component {
  constructor(props) {
    super(props);

    this.validateEmail = this.validateEmail.bind(this);

    this.state = { invalidEmail: false, invalidPassword: false, userID: this.props.match.params.id, email: "tim@test.com",
      users: [
        {id: 1, name: "bob"},
        {id: 2, name: "tim"}
      ]
    };
  }
  
  validateEmail(evt) {
    if ( evt.target.value === "" ||  EMAIL_REGEX.test(String(evt.target.value).toLowerCase()) ) {
      this.setState({
        invalidEmail: false
      });
    } else {
      this.setState({
        invalidEmail: true
      });
    }
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <ListGroup>
          {/* This is dynamic */}
          {this.state.users.map((user) =>
            <ListGroup.Item key={user.id}>{user.name}</ListGroup.Item>
          )}
          </ListGroup>
          <label htmlFor="exampleInputEmail1">Email address</label>
          {this.state.invalidEmail &&
        <Alert variant="danger" dismissible>
          <Alert.Heading>Oh snap! You got an error User {this.state.userID}!</Alert.Heading>
          <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p>
        </Alert>}
          <input type="email" autoComplete="off" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.validateEmail} value={this.state.email}/>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" autoComplete="off" className="form-control" id="exampleInputPassword1" placeholder="Password" />
        </div>
        <div className="form-group form-check">
          <input type="checkbox" autoComplete="off" className="form-check-input" id="exampleCheck1" />
          <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    );
  }
}

export default EditUser;
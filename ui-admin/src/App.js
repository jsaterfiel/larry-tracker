import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import Login from './views/Login';
import EditUser from './views/EditUser';
import AddUser from './views/AddUser';
import Users from './views/Users';
import Dashboard from './views/Dashboard';
import ResetPassword from './views/ResetPassword';
import { createBrowserHistory } from 'history';
import { Navbar, Nav } from 'react-bootstrap';
import AuthAPI from './services/auth';

// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory()

class App extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);

    this.state = {
      loggedOut: false
    }
  }

  logout() {
    AuthAPI.logout()
      .finally( () => {
        window.location = '/';
      });
  }

  render() {
    return (
        <div className="App">
          <Router history={history}>
            <div className="container">
              <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">Larry-Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Login</Nav.Link>
                    <Nav.Link as={Link} to="/reset-password">ResetPassword</Nav.Link>
                    <Nav.Link as={Link} to="/users">Users</Nav.Link>
                    <Nav.Link as={Link} to="/dashboard/testUser">User Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/users/testUser">Edit User</Nav.Link>
                    <Nav.Link as={Link} to="/add-user">Add User</Nav.Link>
                    <Nav.Link onClick={this.logout}>Logout</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <Switch>
                <Route exact path='/' component={Login} />
                <Route exact path='/reset-password' component={ResetPassword} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/dashboard/:username' component={Dashboard} />
                <Route exact path='/add-user' component={AddUser} />
                <Route exact path='/users/:username' component={EditUser} />
              </Switch>
            </div>
          </Router>
        </div>
    );
  }
}

export default App;

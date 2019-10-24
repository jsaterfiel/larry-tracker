import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';

import Login from './views/Login';
import EditUser from './views/EditUser';
import AddUser from './views/AddUser';
import Users from './views/Users';
import Dashboard from './views/Dashboard';
import ResetPassword from './views/ResetPassword';
import { createBrowserHistory } from 'history'
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'



// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory()

class App extends Component {
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
                    <NavDropdown title="Profile" id="basic-nav-dropdown">
                      <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.2">Setting</NavDropdown.Item>
                      <NavDropdown.Item href="#action/3.3">Support</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
              <Switch>
                <Route exact path='/' component={Login} />
                <Route exact path='/reset-password' component={ResetPassword} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/dashboard/:id' component={Dashboard} />
                <Route exact path='/add-user' component={AddUser} />
                <Route exact path='/users/:id' component={EditUser} />
              </Switch>
            </div>
          </Router>
        </div>
    );
  }
}

export default App;

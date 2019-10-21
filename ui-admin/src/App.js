import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import Login from './Login';
import EditUser from './EditUser';
import AddUser from './AddUser';
import Users from './Users';
import Dashboard from './Dashboard';
import ResetPassword from './ResetPassword';
import { createBrowserHistory } from 'history'


// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory()

class App extends Component {
  previousLocation = this.props.location;
  UNSAFE_componentWillUpdate(nextProps) {
    let { location } = this.props;

    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== "POP" &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location;
    }
  }

  render() {

    return (
      <div className="App">
        <Router history={history}>
          <Nav>
            <Nav.Item>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/reset-password" className="nav-link">
                Reset Password
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/users" className="nav-link">
                Users
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/dashboard/1" className="nav-link">
                User Dashboard
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/users/1" className="nav-link">
                Edit User
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/add-user" className="nav-link">
                Add User
              </Link>
            </Nav.Item>
          </Nav>
          <div className="container">
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

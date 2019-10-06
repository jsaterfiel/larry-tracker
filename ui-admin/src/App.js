import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import Login from './Login';
import EditUser from './EditUser';
import Users from './Users';
import Dashboard from './Dashboard';
import ResetPassword from './ResetPassword';
import createHistory from 'history/createBrowserHistory'
import './App.css';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

class App extends Component {
  previousLocation = this.props.location;
  componentWillUpdate(nextProps) {
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
          <ul className="menu">
            <li><Link to="/">Login</Link></li>
            <li><Link to="/reset-password">Reset Password</Link></li>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/dashboard/1">User Dashboard</Link></li>
            <li><Link to="/users/1">Edit User</Link></li>
          </ul>
          <Switch>
            <Route exact path='/' component={Login} />
            <Route exact path='/reset-password' component={ResetPassword} />
            <Route exact path='/users' component={Users} />
            <Route exact path='/dashboard/:id' component={Dashboard} />
            <Route exact path='/users/:id' component={EditUser} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;

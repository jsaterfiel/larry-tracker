import React, { Component } from 'react';
import { Router, Route, Switch, Link } from 'react-router-dom';
import Login from './views/Login';
import EditUser from './views/EditUser';
import AddUser from './views/AddUser';
import Users from './views/Users';
import Dashboard from './views/Dashboard';
import ResetPassword from './views/ResetPassword';
import Signup from './views/Signup';
import { createBrowserHistory } from 'history';
import { Navbar, Nav } from 'react-bootstrap';
import AuthAPI from './services/auth';

// Create a history of your choosing (we're using a browser history in this case)
const history = createBrowserHistory()

class App extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
    this.loggedIn = this.loggedIn.bind(this);

    this.state = {
      loggedOut: false,
      homeLink: "/",
      loggedIn: false
    }
  }

  componentDidMount() {
    const loginData = AuthAPI.getLoginData();
    let homeLink = "/";
    if (loginData && loginData.userType) {
      homeLink = "/users";
      if (loginData && loginData.userType === 'user') {
        homeLink = `/dashboard/${loginData.username}`;
      }
    }
    if (this.state.homeLink !== homeLink) {
      this.setState({
        homeLink: homeLink
      });
    }
  }
  componentDidUpdate() {
    const loginData = AuthAPI.getLoginData();
    let homeLink = "/";
    if (loginData && loginData.userType) {
      homeLink = "/users";
      if (loginData && loginData.userType === 'user') {
        homeLink = `/dashboard/${loginData.username}`;
      }
    }
    if (this.state.homeLink !== homeLink) {
      this.setState({
        homeLink: homeLink
      });
    }
  }

  loggedIn() {
    this.setState({
      loggedIn: true
    })
  }

  logout(evt) {
    evt.preventDefault();
    AuthAPI.logout()
      .finally( () => {
        window.location = '/';
      });
  }

  render() {
    const loginData = AuthAPI.getLoginData();

    return (
        <div className="App">
          <Router history={history}>
            <div className="container">
              <Navbar bg="light" expand="lg">
                <Navbar.Brand as={Link} to={this.state.homeLink}>Larry-Tracker</Navbar.Brand>
                <Nav className="mr-auto" fill={true}>
                  {loginData &&
                  <Nav.Link href="/" onClick={this.logout}>Logout</Nav.Link>}
                </Nav>
              </Navbar>
              <Switch>
                <Route exact path='/' render={() => <Login loggedIn={this.loggedIn} />}/>
                <Route exact path='/reset-password' component={ResetPassword} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/dashboard/:username' component={Dashboard} />
                <Route exact path='/add-user' component={AddUser} />
                <Route exact path='/signup/:hash' component={Signup} />
                <Route exact path='/users/:username' component={EditUser} />
              </Switch>
            </div>
          </Router>
        </div>
    );
  }
}

export default App;

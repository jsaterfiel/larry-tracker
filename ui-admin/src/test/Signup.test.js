import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import util from './utils';
import Signup from '../views/Signup';


it('renders without crashing', () => {
  util.clearLogin();
  const div = document.createElement('div');
  ReactDOM.render( <MemoryRouter initialEntries={["/sign-up/123123123?username=testUser"]}>
    <Switch>
      <Route exact path='/signup/:signupHash' component={Signup} />
    </Switch></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});

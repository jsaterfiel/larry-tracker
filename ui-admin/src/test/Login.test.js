import React from 'react';
import ReactDOM from 'react-dom';
import Login from '../views/Login';
import TestRouter from './TestRouter';
import util from './utils';

it('renders without crashing', () => {
  util.clearLogin();
  const div = document.createElement('div');
  ReactDOM.render( <TestRouter
    ComponentWithRedirection={() => <Login />}
    RedirectUrl="/"
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
import React from 'react';
import ReactDOM from 'react-dom';
import ResetPassword from '../views/ResetPassword';
import TestRouter from './TestRouter';
import util from './utils';

it('renders without crashing', () => {
  util.clearLogin();
  const div = document.createElement('div');
  ReactDOM.render( <TestRouter
    ComponentWithRedirection={() => <ResetPassword />}
    RedirectUrl="/"
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
import React from 'react';
import ReactDOM from 'react-dom';
import AddUser from '../views/AddUser';
import TestRouter from './TestRouter';
import util from './utils';

it('renders without crashing', () => {
  util.clearLogin();
  const div = document.createElement('div');
  ReactDOM.render( <TestRouter
    ComponentWithRedirection={() => <AddUser />}
    RedirectUrl="/"
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
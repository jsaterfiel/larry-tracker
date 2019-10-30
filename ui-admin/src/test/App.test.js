import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';
import TestRouter from './TestRouter';
import util from './utils';

it('renders without crashing', () => {
  util.clearLogin();
  const div = document.createElement('div');
  ReactDOM.render( <TestRouter
    ComponentWithRedirection={() => <App />}
    RedirectUrl="/"
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
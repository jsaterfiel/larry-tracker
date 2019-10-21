import React from 'react';
import ReactDOM from 'react-dom';
import ResetPassword from '../views/ResetPassword';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ResetPassword />, div);
  ReactDOM.unmountComponentAtNode(div);
});
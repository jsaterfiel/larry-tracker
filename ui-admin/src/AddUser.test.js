import React from 'react';
import ReactDOM from 'react-dom';
import AddUser from './AddUser';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddUser />, div);
  ReactDOM.unmountComponentAtNode(div);
});
import React from 'react';
import ReactDOM from 'react-dom';
import EditUser from '../views/EditUser';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const componentProps = {
    match: {
      params: {
        id: "1"
      }
    }
  }
  ReactDOM.render(<EditUser {...componentProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
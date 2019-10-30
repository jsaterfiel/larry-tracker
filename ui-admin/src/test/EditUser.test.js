import React from 'react';
import ReactDOM from 'react-dom';
import mockAxios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import util from './utils';
import EditUser from '../views/EditUser';


it('renders without crashing', () => {
  util.makeAdmin();
  mockAxios.get.mockImplementationOnce(() => {
    Promise.resolve({
      data: {"username":"testUser","email":"test@test.com","clientCode":"","userType":"admin","company":"Larry Tracker","name":"Larry the CEO","active":1}
    })
  });
  const div = document.createElement('div');
  ReactDOM.render( <MemoryRouter initialEntries={["/users/testUser"]}>
      <EditUser />
    </MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
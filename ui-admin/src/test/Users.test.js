import React from 'react';
import ReactDOM from 'react-dom';
import mockAxios from 'axios';
import TestRouter from './TestRouter';
import util from './utils';
import Users from '../views/Users';


it('renders without crashing', () => {
  util.makeAdmin();
  mockAxios.get.mockImplementationOnce(() => {
    Promise.resolve({
      data: [
        {"username":"larry","email":"","clientCode":"","userType":"admin","company":"Larry Tracker","name":"Larry the CEO","active":1},
        {"username":"bobby","email":"testUserAdd299704@tracker.com","clientCode":"client_1","userType":"user","company":"Larry Tracker","name":"Test User Add 299704","active":1},
        {"username":"british.spies","email":"007@mi6.gov.uk","clientCode":"client_2","userType":"user","company":"MI-6","name":"James Bond","active":1}
      ]
    })
  });
  const div = document.createElement('div');
  ReactDOM.render( <TestRouter
    ComponentWithRedirection={() => <Users />}
    RedirectUrl="/"
  />, div);
  ReactDOM.unmountComponentAtNode(div);
});
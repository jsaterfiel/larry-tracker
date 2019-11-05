import React from 'react';
import ReactDOM from 'react-dom';
import mockAxios from 'axios';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import util from './utils';
import Dashboard from '../views/Dashboard';

it('renders without crashing', () => {
  util.makeUser();
  mockAxios.get.mockImplementationOnce(() => {
    Promise.resolve({
      data: [{"startDate":"2019-09-28","impressions":2,"dentsuOTSCount":0,"avgTotalDwellTime":1.5,"avgHalfInViewTime":1.5,"clicks":1,"interactions":1,"wasEverFullyInViewCount":2,"ivtCount":0},{"startDate":"2019-09-29","impressions":1,"dentsuOTSCount":1,"avgTotalDwellTime":0,"avgHalfInViewTime":0,"clicks":1,"interactions":1,"wasEverFullyInViewCount":0,"ivtCount":1},{"startDate":"2019-09-30","impressions":1,"dentsuOTSCount":0,"avgTotalDwellTime":2,"avgHalfInViewTime":2,"clicks":1,"interactions":1,"wasEverFullyInViewCount":1,"ivtCount":0}]
    })
  });
  const div = document.createElement('div');
  ReactDOM.render( <MemoryRouter initialEntries={["/dashboard/testUser"]}>
    <Switch>
      <Route exact path='/dashboard/:signupHash' component={Dashboard} />
    </Switch>
    </MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
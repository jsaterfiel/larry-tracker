const request = require('supertest');

//must set these before require runs
process.env.API_PORT = 3000;
process.env.API_DB_URL = 'http://localhost';

const server = require('./index.js');

/**
 * NOTE: Remember to load the server schema and sample1.sql or these tests will fail
 */

describe('loading express', () => {
  it('responds to /', done => {
    request(server)
      .get('/')
      .expect(200, done);
  });
  it('404 everything else', done => {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
  it('Ping test', done => {
    request(server)
      .get('/api/ping')
      .expect(200, {
        pong: true
      },done);
  });
  it('byLevel basic', done => {
    request(server)
      .get('/api/by-level?clientCode=client_1&level1=1111&startDate=2019-09-28&endDate=2019-09-30')
      .set('x-session-id', '1323268850077976000000')
      .expect(200, [
        {
          startDate: '2019-09-28',
          impressions: 1,
          dentsuOTSCount: 0,
          avgTotalDwellTime: 1,
          avgHalfInViewTime: 1,
          clicks: 0,
          interactions: 0,
          wasEverFullyInViewCount: 1,
          ivtCount: 0
        },
        {
          startDate: '2019-09-30',
          impressions: 1,
          dentsuOTSCount: 0,
          avgTotalDwellTime: 2,
          avgHalfInViewTime: 2,
          clicks: 1,
          interactions: 1,
          wasEverFullyInViewCount: 1,
          ivtCount: 0
        }
      ], done);
  });
  it('lookup getClients basic', done => {
    request(server)
      .get('/api/clients')
      .set('x-session-id', '1323268850077976000000')
      .expect(resp => {
        // need to limit the results to client_1 as there could be several clients since the data is live
        for (let item of resp.body) {
          if (item.clientCode == 'client_1') {
            resp.body = item;
            break;
          }
        }
      })
      .expect(200, {
        clientCode: 'client_1'
      }, done);
  });
  it('lookup getLevels basic', done => {
    request(server)
      .get('/api/client-levels?clientCode=client_1')
      .set('x-session-id', '1323268850077976000000')
      .expect(resp => {
        // need to limit the results to client_1 as there could be several clients since the data is live
        for (let item of resp.body) {
          if (item.level1ID == '1111') {
            resp.body = item;
            break;
          }
        }
      })
      .expect(200, {
        level1ID: '1111'
      }, done);
  });
  it('login', done => {
    request(server)
      .post('/api/login')
      .send({
        username: 'testUserLogin',
        password: 'P@ssw0rd'
      })
      .expect('x-session-id', /.?/)
      .expect(200, {
        username: 'testUserLogin',
        name: 'Test User Login',
        company: 'Larry Tracker',
        userType: 'user'
      }, done);
  });
  it('logout', done => {
    // can only do negative test automated as this testing tool isn't able to run multiple requests in the same test
    request(server)
      .get('/api/logout')
      .set('x-session-id', /.?/)
      .expect(500, { error: 'Session Error.  Try logging in again.' }, done);
  });
  it('reset password', done => {
    request(server)
      .post('/api/resetPassword')
      .send({
        username: 'testUserLogin',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Rainbow',
        newPassword: 'P@ssw0rd'
      })
      .expect(200, done);
  });
});
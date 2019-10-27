const request = require('supertest');

//must set these before require runs
process.env.API_PORT = 3000;
process.env.API_DB_URL = 'http://localhost';

const server = require('./index.js');

/**
 * NOTE: Remember to load the server schema and sample1.sql or these tests will fail
 */

describe('loading express', () => {
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
  it('get users', done => {
    request(server)
      .get('/api/getUsers')
      .set('x-session-id', '1323268850077976000000')
      .expect(resp => {
        // throw Error(JSON.stringify(resp));
        // need to limit the results to client_1 as there could be several clients since the data is live
        for (let item of resp.body) {
          if (item.username == 'testAdmin') {
            resp.body = item;
            break;
          }
        }
      })
      .expect(200, {
        active: 1,
        clientCode: '',
        company: 'Larry Tracker',
        email: 'testAdmin@tracker.com',
        name: 'Test Admin',
        userType: 'admin',
        username: 'testAdmin'
      }, done);
  });
  it('get users - not authorized', done => {
    request(server)
      .get('/api/getUsers')
      .set('x-session-id', '32132328850077976000000')
      .expect(500, {
        error: 'Unauthorized'
      }, done);
  });
  it('get user', done => {
    request(server)
      .get('/api/getUser?username=monsters')
      .set('x-session-id', '1323268850077976000000')
      .expect(200, {
        username: 'monsters',
        email: 'mikey@monsters.inc',
        clientCode: 'client_1',
        userType: 'user',
        company: 'Monsters Inc.',
        name: 'Mikey',
        active: 1
      }, done);
  });
  it('get user - not authorized', done => {
    request(server)
      .get('/api/getUser?username=testUser')
      .set('x-session-id', '32132328850077976000000')
      .expect(500, {
        error: 'Unauthorized'
      }, done);
  });
  it('update user', done => {
    request(server)
      .post('/api/updateUser')
      .set('x-session-id', '1323268850077976000000')
      .send({
        username: 'testUserUpdate',
        name: 'Bob',
        email: 'bob@bob.com'
      })
      .expect(200, done);
  });
  it('update user - not authorized', done => {
    request(server)
      .post('/api/updateUser')
      .set('x-session-id', '32132328850077976000000')
      .send({
        username: 'testUserUpdate',
        name: 'Bob',
        email: 'bob@bob.com'
      })
      .expect(500, {
        error: 'Unauthorized'
      }, done);
  });
  it('add user', done => {
    const userId = Math.floor(Math.random()*1000000);
    request(server)
      .post('/api/addUser')
      .set('x-session-id', '1323268850077976000000')
      .send({
        username: 'testUserAdd' + userId,
        name: 'Test User Add ' + userId,
        email: 'testUserAdd' + userId + '@tracker.com',
        company: 'Larry Tracker',
        clientCode: 'client_1',
        userType: 'user',

      })
      .expect(200, done);
  });
  it('add user - not authorized', done => {
    const userId = Math.floor(Math.random()*1000000);
    request(server)
      .post('/api/addUser')
      .set('x-session-id', '32132328850077976000000')
      .send({
        username: 'testUserAdd' + userId,
        name: 'Test User Add ' + userId,
        email: 'testUserAdd' + userId + '@tracker.com',
        company: 'Larry Tracker',
        clientCode: 'client_1',
        userType: 'user',

      })
      .expect(500, {
        error: 'Unauthorized'
      }, done);
  });
  it('signup user', done => {
    request(server)
      .post('/api/signup')
      .send({
        signupHash: '1234567890',
        username: 'testUserSignup',
        securityQuestion: 'What is your favorite movie?',
        securityAnswer: 'Star Wars',
        password: 'P@ssw0rd'
      })
      .expect(200, done);
  });
  it('signup user -- password err', done => {
    request(server)
      .post('/api/signup')
      .send({
        signupHash: '1234567890',
        username: 'testUserSignup',
        securityQuestion: 'What is your favorite movie?',
        securityAnswer: 'Star Wars',
        password: 'test'
      })
      .expect(500, {
        error: 'password must be at least 8 characters long'
      },done);
  });
});
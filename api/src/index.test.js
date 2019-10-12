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
      .get('/api/by-level?pcode=client_1&level1=1111&startDate=2019-09-28&endDate=2019-09-30')
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
      .get('/api/client-levels?pcode=client_1')
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
});
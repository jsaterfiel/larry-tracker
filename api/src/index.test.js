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
          start_date: '2019-09-28',
          dentsu_ots: 0,
          total_dwell_time: 1,
          half_in_view_time: 1,
          clicked: 0,
          interaction: 0,
          was_ever_fully_in_view: 1,
          ivt: 0
        },
        {
          start_date: '2019-09-30',
          dentsu_ots: 0,
          total_dwell_time: 2,
          half_in_view_time: 2,
          clicked: 1,
          interaction: 1,
          was_ever_fully_in_view: 1,
          ivt: 0
        }
      ], done);
  });
  it('lookup getClients basic', done => {
    request(server)
      .get('/api/clients')
      .expect(resp => {
        // need to limit the results to client_1 as there could be several clients since the data is live
        for (let item of resp.body) {
          if (item.client_code == 'client_1') {
            resp.body = item;
            break;
          }
        }
      })
      .expect(200, {
        client_code: 'client_1'
      }, done);
  });
  it('lookup getLevels basic', done => {
    request(server)
      .get('/api/client-levels?pcode=client_1')
      .expect(200, [
        { level1_id: '1111' },
        { level1_id: '1112' }
      ], done);
  });
});
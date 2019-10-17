const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const collection = require('./collection');
const byLevel = require('./byLevel');
const lookup = require('./lookup');
const users = require('./auth');
const app = express();
const expressSwagger = require('express-swagger-generator')(app);


let options = {
  swaggerDefinition: {
    info: {
      description: 'Larry Tracker API',
      title: 'Swagger',
      version: '1.0.0',
    },
    host: 'localhost:8181',
    basePath: '/api',
    produces: [
      'application/json'
    ],
    schemes: ['http'],
    securityDefinitions: {
      ApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-KEY',
        description: 'API Key',
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['./*.js'] //Path to the API handle folder
};
expressSwagger(options);


const port = process.env.API_PORT || 8181;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => res.send('<html><head><title>Larry Tracker API</title></head><body><h1>Larry Tracker API!</h1></body></html>'));


/**
 * @typedef ResponsePing
 * @property {boolean} pong
 */
/**
 * Ping self test for system functionality example: http://localhost:8181/api/ping
 * @route GET /ping
 * @produces application/json
 * @consumes application/json
 * @returns {ResponsePing} 200 - Pong
 */
app.get('/api/ping', async (req, res) => {
  res.send({
    'pong': true
  });
});

/**
 * Collection (ingestion)
 * @example http://localhost:8181/api/collection?pcode=client1&level1=1112&hw=1569685960721&ord=33346862409425390&ba=0&gs=1&ef=1&fa=0&rt=0&ac=1000&ct=0
 * @see collection.process
 */
/**
 * Collection (ingestion) example: http://localhost:8181/api/collection?pcode=client1&level1=1112&hw=1569685960721&ord=33346862409425390&ba=0&gs=1&ef=1&fa=0&rt=0&ac=1000&ct=0
 * @route GET /collection
 * @param {string} pcode.query.required example: client1
 * @param {string} level1.query.required example: 1112
 * @param {number} hw.query.required startTime example: 1569685960721
 * @param {number} ord.query.required Random example: 33346862409425390
 * @param {number} ba.query Dentsu OTS Metric example:  1
 * @param {number} ac.query Total Dwell Time example: 1
 * @param {number} ct.query Half In-View Time example: 1
 * @param {number} gs.query Clicked example: 1
 * @param {number} ef.query Interaction example: 1
 * @param {number} fa.query Was Ever Fully In-View example: 1
 * @param {number} rt.query IVT (Non-human Traffic)
 * @produces application/json
 * @consumes application/json
 * @returns 200 - each row is a date ordered date ascending
 */
app.get('/api/collection', async (req, res) => {
  try {
    collection.process(req.query);
  } catch (err) {
    // Don't want to send this to the client but want to log it in case there's an issue with the db
    console.error('Unable to save pixel collection', err);
  }
  res.send('');
});

/**
 * @typedef ResponseByLevel
 * @property {string} startDate
 * @property {number} impressions
 * @property {number} dentsuOTSCount
 * @property {number} avgTotalDwellTime
 * @property {number} avgHalfInViewTime
 * @property {number} clicks
 * @property {number} interactions
 * @property {number} wasEverFullyInViewCount
 * @property {number} ivtCount
 */
/**
 * By Level Reporting example: http://localhost:8181/api/by-level?pcode=client_1&level1=1111&startDate=2019-09-27&endDate=2019-09-30
 * @route GET /by-level
 * @param {string} pcode.query.required example: client_1
 * @param {string} startDate.query.required example: 2019-09-27
 * @param {string} endDate.query.required example: 2019-09-30
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseByLevel>} 200 - each row is a date ordered date ascending
 * @security ApiKey
 */
app.get('/api/by-level', async (req, res) => {
  try {
    const output = await byLevel.process(req.query.startDate, req.query.endDate, req.query.pcode, req.query.level1);
    res.send(output);
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

/**
 * @typedef ResponseClient
 * @property {string} clientCode
 */
/**
 * This function comment is parsed by doctrine returns the list of clients orderd by name ascending example: http://localhost:8181/api/clients
 * @route GET /clients
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseClient>} 200 - array of client codes
 * @security ApiKey
 */
app.get('/api/clients', async (req, res) => {
  try {
    const output = await lookup.getClients();
    res.send(output);
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

/**
 * @typedef ResponseClientLevel
 * @property {string} level1ID
 */
/**
 * Returns the list of clients orderd by name ascending example: http://localhost:8181/api/client-levels?pcode=client_1
 * @route GET /client-levels
 * @param {string} pcode.query.required Example: client_1
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseClientLevel>} 200 - levels for client
 * @security ApiKey
 */
app.get('/api/client-levels', async (req, res) => {
  try {
    const output = await lookup.getLevels(req.query.pcode);
    res.send(output);
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

app.listen(port, () => console.log(`Larry Tracker API listening on port ${port}!`));

// This is for unit tests to work
module.exports = app;
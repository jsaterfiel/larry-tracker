const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const collection = require('./collection');
const byLevel = require('./byLevel');
const lookup = require('./lookup');
const auth = require('./auth');
const ping = require('./ping');
const util = require('./util');
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
        name: 'x-session-id',
        description: 'Session Hash',
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
 * Ping self test for system functionality
 * @route GET /ping
 * @produces application/json
 * @consumes application/json
 * @returns {ResponsePing} 200 - Pong
 * @group Maintenance
 */
app.get('/api/ping', async (_req, res) => {
  try {
    const output = await ping.getPing();
    res.send(output);
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

/**
 * Collection (ingestion)
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
 * @group Collection
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
 * By Level Reporting
 * ClientCode is required if you're an admin else it's ignored and retrieved from your user record.
 * @route GET /by-level
 * @param {string} clientCode.query example: client_1
 * @param {string} startDate.query.required example: 2019-09-27
 * @param {string} endDate.query.required example: 2019-09-30
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseByLevel>} 200 - each row is a date ordered date ascending
 * @security ApiKey
 * @group Reporting
 */
app.get('/api/by-level', async (req, res) => {
  try {
    const user = await util.getUserFromRequest(req);
    let clientCode = user.clientCode;
    if (user.userType == 'admin') {
      clientCode = req.query.clientCode;
    }
    const output = await byLevel.process(req.query.startDate, req.query.endDate, clientCode, req.query.level1);
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
 * This function comment is parsed by doctrine returns the list of clients orderd by name ascending
 * Admin Only Route
 * @route GET /clients
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseClient>} 200 - array of client codes
 * @security ApiKey
 * @group Lookup
 */
app.get('/api/clients', async (req, res) => {
  try {
    const user = await util.getUserFromRequest(req);
    if (user.userType != 'admin') {
      throw Error('Unauthorized');
    }
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
 * Returns the list of clients orderd by name ascending
 * clientCode query string required if not a user.  If a user it is ignored
 * @route GET /client-levels
 * @param {string} clientCode.query Example: client_1
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseClientLevel>} 200 - levels for client
 * @security ApiKey
 * @group Lookup
 */
app.get('/api/client-levels', async (req, res) => {
  try {
    const user = await util.getUserFromRequest(req);
    let clientCode = user.clientCode;
    if (user.userType == 'admin') {
      clientCode = req.query.clientCode;
    }
    const output = await lookup.getLevels(clientCode);
    res.send(output);
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

/**
 * @typedef LoginRequest
 * @property {string} username.required larry
 * @property {string} password.required 
 */
/**
 * Returns the list of clients orderd by name ascending
 * Admin Test Data:
 * u: larry
 * p: P@ssw0rd
 * 
 * User Test Data:
 * u: monsters
 * p: P@ssw0rd
 * @route POST /login
 * @param {LoginRequest.model} login.body.required
 * @produces application/json
 * @consumes application/json
 * @returns {Array.<ResponseClientLevel>} 200 - levels for client
 * @group Auth
 */
app.post('/api/login', async (req, res) => {
  try {
    const output = await auth.login(req.body.username, req.body.password);
    res.setHeader('x-session-id', output.sessionID);
    delete output.sessionID;
    res.send(output);
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

/**
 * Logout
 * @route GET /logout
 * @produces application/json
 * @consumes application/json
 * @returns 200
 * @security ApiKey
 * @group Auth
 */
app.get('/api/logout', async (req, res) => {
  try {
    const user = await util.getUserFromRequest(req);
    await auth.logout(user);
    res.send('');
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});
/**
 * @typedef ResetPasswordReqeust
 * @property {string} username.required
 * @property {string} securityQuestion.required What is your favorite color?  What is your favorite movie?  Who is your favorite teacher?
 * @property {string} securityAnswer.required
 * @property {string} newPassword.required
 */
/**
 * Reset Password
 * What is your favorite color?  What is your favorite movie?  Who is your favorite teacher?
 * @route POST /resetPassword
 * @param {ResetPasswordReqeust.model} resetPW.body.required
 * @produces application/json
 * @consumes application/json
 * @returns 200
 * @group Auth
 */
app.post('/api/resetPassword', async (req, res) => {
  try {
    await auth.resetPassword(req.body.username, req.body.securityQuestion, req.body.securityAnswer, req.body.newPassword);
    res.send('');
  } catch (err) {
    res.status(500).send( {error: err.message} );
  }
});

app.listen(port, () => console.log(`Larry Tracker API listening on port ${port} http://localhost:${port} !`));

// This is for unit tests to work
module.exports = app;
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const collection = require('./collection');
const byLevel = require('./byLevel');
const lookup = require('./lookup');

const app = express();
const port = process.env.API_PORT || 8181;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => res.send('<html><head><title>Larry Tracker API</title></head><body><h1>Larry Tracker API!</h1></body></html>'));

/**
 * Ping
 * Basic url to check server is running
 * @example http://localhost:8181/api/ping
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
 * By Level (Reporting)
 * @example http://localhost:8181/api/by-level?pcode=client_1&level1=1111&startDate=2019-09-27&endDate=2019-09-30
 * @see byLevel.process
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
 * Client Lookup (Reporting)
 * @example http://localhost:8181/api/clients
 * @see lookup.getClients
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
 * Client Lookup (Reporting)
 * @example http://localhost:8181/api/client-levels?pcode=client_1
 * @see lookup.getLevels
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
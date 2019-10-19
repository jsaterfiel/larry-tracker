const db = require('./db');

module.exports = {
  /**
   * getPing: a simple function that just checks that we can talk to the database
   * Throws an error if we cannot talk to the db.
   * Returns { pong: true} on success
   */
  getPing: async () => {
    const result = await db.query('select 1 as result').toPromise();

    if (!result || !result[0] || !result[0].result || result[0].result !== 1) {
      throw Error('Environment Failed');
    }
    return {
      pong: true
    };
  }
};

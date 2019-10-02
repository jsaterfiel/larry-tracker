const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * lookup
 * Helps with performing lookups for client data
 */
const api = {
  /**
   * lookup.getClients
   * returns the list of clients orderd by name ascending
   */
  getClients: async () => {
    const query = 'select client_code from `default`.byClientLevels group by client_code order by client_code asc;';

    return await db.query(query).toPromise();
  },

  /**
   * lookup.getLevels
   * returns the levels for a client_code
   * @param client String (required)
   */
  getLevels: async (client) => {
    if (client && typeof client == 'string') {
      client = client.replace(DB_ESC_REG, '');
    } else {
      throw new Error('pcode required');
    }

    const query = `SELECT level1_id
    FROM \`default\`.byClientLevels
    WHERE client_code = '${client}'
    group by client_code, level1_id
    order by level1_id asc;`.replace(/\n/g,' ');

    return await db.query(query).toPromise();
  },
};

module.exports = api;
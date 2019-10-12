const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * lookup
 * Helps with performing lookups for client data
 */
const api = {

  getClients: async () => {
    const query = 'select client_code as "clientCode" from `default`.byClientLevels group by client_code order by client_code asc;';

    return await db.query(query).toPromise();
  },

  getLevels: async (client) => {
    if (client && typeof client == 'string') {
      client = client.replace(DB_ESC_REG, '');
    } else {
      throw new Error('pcode required');
    }

    const query = `SELECT level1_id as "level1ID"
    FROM \`default\`.byClientLevels
    WHERE client_code = '${client}'
    group by client_code, level1_id
    order by level1_id asc;`.replace(/\n/g,' ');

    return await db.query(query).toPromise();
  },
};

module.exports = api;
const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * lookup
 * Helps with performing lookups for client data
 */
const api = {

  getClients: async () => {
    const query = 'select clientCode from (select username, clientCode, max(tstamp) as tstamp from `default`.users where active = 1 group by username, clientCode) where clientCode != \'\' group by clientCode order by clientCode asc';

    return await db.query(query).toPromise();
  },

  getLevels: async (client) => {
    if (client && typeof client == 'string') {
      client = client.replace(DB_ESC_REG, '');
    } else {
      throw new Error('clientCode required');
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
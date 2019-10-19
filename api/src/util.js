const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

const util = {
  /**
   * returns active user data
   * You can pass either username or sessionID but not both.  Use '' for the value you don't want to use.
   * @param {String} username
   * @param {String} sessionID
   */
  getUserData: async (username, sessionID) => {
    //validate inputs
    if (typeof username != 'string' || typeof sessionID != 'string') throw Error('username and password must be strings');

    const uname = username.replace(DB_ESC_REG, '');
    const sID = sessionID.replace(DB_ESC_REG, '');

    let whereClause = `select p.username as username, max(tstamp) as max_tstamp
    from (
    select username, max(tstamp) as tstamp, sessionID
    from \`default\`.users
    where sessionID = '${sID}'
    group by username, sessionID) c
    left join (select username, max(tstamp) as tstamp from \`default\`.users group by username) p on p.username = c.username and p.tstamp = c.tstamp
    group by p.username`;

    if (username) {
      whereClause = `select username, max(tstamp) as max_tstamp from \`default\`.users where username = '${uname}' group by username`;
    }
    // get user by username
    const query = `select u.username as username, u.password as password, u.clientCode as clientCode, u.userType as userType, u.company as company,
    u.name as name, u.securityQuestion as securityQuestion, u.securityAnswer as securityAnswer, u.sessionID as sessionID, u.signupHash as signupHash, u.active as active
    from (${whereClause}) b
    left join \`default\`.users u on b.username = u.username and b.max_tstamp = u.tstamp
    where u.active = 1`.replace(/\n/g,' ');

    let rows = await db.query(query).toPromise();
    if (rows.length === 1) return rows[0];
    return false;
  },

  /**
   * updates/creates user data
   * Returns true on success false on failure
   */
  updateUserData: async (data) => {
    if (!data || !data.username) throw Error('data is required and it must have a username');

    // get user by username or sessionIDx
    const user = await util.getUserData(data.username, '');

    if (!user) return false;

    // santitize input data
    for(let key in Object.keys(data)) {
      if (typeof data[key] == 'string') {
        data[key] = data[key].replace(DB_ESC_REG, '');
      }
    }

    //copy new properties over the user
    Object.assign(user, data);

    //updates the user.  some fields are not meant to be updated ever like, username, utype
    user.tstamp = new Date();
    const query = `INSERT INTO \`default\`.users
    (username, password, clientCode, userType, company, name, securityQuestion, securityAnswer, sessionID, signupHash, active, tstamp)
    `.replace(/\n/g,' ');

    await db.insert(query, user).toPromise();

    return true;
  },

  /**
   * Retrieves a user by their session data
   */
  getUserFromRequest: async (req) => {
    const sessionID = req.header('x-session-id');

    if (!sessionID) throw Error('missing x-session-id header');

    let user;
    try {
      user = await util.getUserData('', sessionID);
    } catch (err) {
      console.log(err);
    }

    if (!user) throw Error('Session Error.  Try logging in again.');

    return user;
  }
};
module.exports = util;
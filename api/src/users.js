const db = require('./db');
const util = require('./util');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * Auth
 * Handles basic profile and authentication for the user
 */
const api = {
  /**
   * Users.getUsers returns a list of users
   */
  getUsers: async () => {
    const query = `select username, email, clientCode, userType, company, name, active
      from (select username, max(tstamp) as max_tstamp from \`default\`.users group by username) b
      left join \`default\`.users u on b.username = u.username and b.max_tstamp = u.tstamp`.replace('\n','');
    const results = await db.query(query).toPromise();
    return results;
  },

  /**
   * Auth.getUser returns details about a specific user
   * @param {String} username
   */
  getUser: async (username) => {
    if (!username || typeof username != 'string') {
      throw Error('username is required');
    }
    const uname = username.replace(DB_ESC_REG, '');
    const query = `select username, email, clientCode, userType, company, name, signupHash, active
      from (select username, max(tstamp) as max_tstamp from \`default\`.users where username = '${uname}' group by username) b
      left join \`default\`.users u on b.username = u.username and b.max_tstamp = u.tstamp
      where u.active = 1`.replace(/\n/g,' ');
    const results = await db.query(query).toPromise();
    if (results) return results[0];
    return {};
  },

  /**
   * Users.updateUser Admin update a user
   * @param {String} username
   * @param {String} email
   * @param {String} name
   * @param {String} company
   * @param {String} clientCode
   * @param {String} active
   */
  updateUser: async (username, email, name, company, clientCode, active) => {
    if (!username || typeof username != 'string') {
      throw Error('username is required');
    }
    let data = {
      username: username
    };
    if (email && typeof email == 'string') {
      data.email = email;
    }
    if (name && typeof name == 'string') {
      data.name = name;
    }
    if (company && typeof company == 'string') {
      data.company = company;
    }
    if (clientCode && typeof clientCode == 'string') {
      data.clientCode = clientCode;
    }
    if (typeof active == 'number' && (active === 1 || active === 0)) {
      data.active = active;
    }

    const results = await util.updateUserData(data);
    if (!results) throw Error('Unable to save data');
  },

  /**
   * Users.AddUser Admin adds a user
   * @param {String} username
   * @param {String} email
   * @param {String} userType (admin, user)
   * @param {String} name
   * @param {String} company
   * @param {String} clientCode
   * @param {String} active
   */
  addUser: async (username, email, userType, name, company, clientCode) => {
    if (!username || typeof username != 'string') {
      throw Error('username is required');
    }
    if (!email || typeof email != 'string') {
      throw Error('email is required');
    }
    if (!userType || (userType != 'admin' && userType != 'user')) {
      throw Error('userType is required');
    }
    if (!name || typeof name != 'string') {
      throw Error('name is required');
    }
    if (!company || typeof company != 'string') {
      throw Error('company is required');
    }
    if (userType == 'admin' && clientCode) {
      throw Error('cannot pass clientCode when creating an admin user');
    }
    if (userType == 'user' && (!clientCode || typeof clientCode != 'string')) {
      throw Error('clientCode is required for a user');
    }

    //make sure the username isn't already taken
    let userExists;
    try {
      userExists = await util.getUserData(username, '');
    } catch(err) {
      throw Error(err.message + +JSON.stringify(userExists));
    }
    if (userExists) throw Error('username is already in use');

    let user = {
      username: username,
      clientCode: clientCode,
      userType: userType,
      email: email,
      company: company,
      name: name,
      active: 1,
      tstamp: Date.now()
    };

    // santitize input data
    for(let key in Object.keys(user)) {
      if (typeof user[key] == 'string') {
        user[key] = user[key].replace(DB_ESC_REG, '');
      }
    }

    //updates the user.  some fields are not meant to be updated ever like, username, utype
    user.tstamp = new Date();
    const query = `INSERT INTO \`default\`.users
    (username, clientCode, userType, email, company, name, active, tstamp)
    `.replace(/\n/g,' ');

    await db.insert(query, user).toPromise();

    return true;
  }
};

module.exports = api;
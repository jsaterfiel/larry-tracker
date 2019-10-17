const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

module.exports = {
  /**
   * returns active user data
   * You can pass either username or sessionID but not both.  Use '' for the value you don't want to use.
   * @param {String} username
   * @param {String} sessionID
   */
  getUserData: async (username, sessionID) => {
    //validate inputs
    if (!username && !sessionID) return false;

    const uname = username.replace(DB_ESC_REG, '');
    const sID = sessionID.replace(DB_ESC_REG, '');

    let whereClause = `select p.uname, max(tstamp) as max_tstamp
    from (
    select uname, max(tstamp) as tstamp, sessionID
    from \`default\`.users
    where sessionID = '${sID}'
    group by uname, sessionID) c
    left join (select uname, max(tstamp) as tstamp from \`default\`.users group by uname) p on p.uname = c.uname and p.tstamp = c.tstamp
    group by p.uname`;

    if (sessionID) {
      whereClause = `select uname, max(tstamp) as max_tstamp from \`default\`.users where uname = '${uname}' group by uname`;
    }
    // get user by username
    const query = `Select uname, pword, client_code, utype, company, name, securityQuestion, securityAnswer, sessionID, signup_hash, active
    from (${whereClause}) b
    left join \`default\`.users u on b.uname = u.uname and b.max_tstamp = u.tstamp
    where u.active = 1`.replace(/\n/g,' ');

    console.log(query);

    let rows = await db.query(query).toPromise();

    if (rows.length === 1) return rows[0];
    return false;
  },

  /**
   * updates user data
   * Returns true on success false on failure
   */
  updateUserData: async (data) => {
    if (!data) return false;

    // get user by username or sessionID
    let user;
    if (data.username) {
      user = await this.getUserData(data.username);
    } else {
      user = await this.getUserData(data.sessionID);
    }
    if (!user) return false;

    // santitize input data
    for(let key in Object.keys(data)) {
      if (typeof data[key] == 'string') {
        data[key] = data[key].replace(DB_ESC_REG, '');
      }
    }
    const newUser = Object.apply(user, data);

    //updates the user.  some fields are not meant to be updated ever like, username, utype
    const query = `INSERT INTO \`default\`.users
    (uname, pword, client_code, utype, company, name, securityQuestion, securityAnswer, sessionID, signup_hash, active, tstamp)
    VALUES('${data.username}', '${newUser.pword}', '${newUser.client_code}', '${data.utype}', '${newUser.company}', '${newUser.name}', '${newUser.securityQuestion}', '${newUser.securityQuestionAnswer}', '${newUser.sessionID}', '${newUser.signup_hash}', ${newUser.active}, now())`.replace(/\n/g,' ');

    await db.insert(query).toPromise();

    return true;
  }
};
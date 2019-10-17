const db = require('./db');
const bcrypt = require('bcrypt');
const util = require('./util');
const saltRounds = 10;

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * Auth
 * Handles basic profile and authentication for the user
 */
const api = {
  /**
   * Auth.login User login
   * @param {String} username
   * @param {String} password
   */
  login: async (username, password) => {
    //validate inputs
    if ( !username ) throw Error('username is required');
    if ( !password ) throw Error('password is required');

    // get user by username
    const user = await util.getUserData(username);

    if (!user) throw Error('Invalid credentials');

    //validate the password
    const isValid = await bcrypt.compare(password, user.pword);

    if (!isValid) {
      throw Error('Invalid credentials');
    }

    //set sessionID, update user data and return user data for display purposes
    const sessionID = Math.floor(Math.random()*1000000000000000000000).toString();
    await util.updateUserData({
      username: user.username,
      sessionID: sessionID
    });

    return {
      sessionID: sessionID,
      name: user.name,
      company: user.company,
      userType: user.utype
    };
  },

  /**
   * Auth.logout Logout of session
   * @param {String} sessionID
   */
  logout: async (sessionID) => {
    //validate inputs
    if ( !sessionID ) throw Error('sessionID is required');

    // get user by username
    const user = await util.getUserData('', sessionID);

    if (!user) return;

    //set sessionID, update user data and return user data for display purposes
    user.sessionID = '';
    await util.updateUserData(user);
  },

  /**
   * Auth.updateUser Logout of session
   * @param {String} sessionID
   * @param {String} email
   * @param {String} name
   * @param {String} securityQuestion
   * @param {String} securityQuestionAnswer
   */
  updateUser: async (sessionID, email, name, securityQuestion, securityQuestionAnswer) => {
    //validate inputs
    if ( !sessionID ) throw Error('sessionID is required');

    let data = {
      sessionID: sessionID
    };

    if (email) {
      data.email = email;
    }

    if (name) {
      data.name = name;
    }

    if (securityQuestion) {
      data.securityQuestion = securityQuestion;
    }

    if (securityQuestionAnswer) {
      data.securityQuestionAnswer = securityQuestionAnswer;
    }
    //set sessionID, update user data and return user data for display purposes
    const result = await util.updateUserData(data);
    if (!result) {
      throw Error('Unable to save user');
    }
  },

  /**
   * Auth.resetPassword allows a user to reset their password using their security question and security answer
   * @param {String} sessionID
   * @param {String} email
   * @param {String} password
   * @param {String} securityQuestion
   * @param {String} securityQuestionAnswer
   */
  resetPassword: async (username, securityQuestion, securityQuestionAnswer, newPassword) => {
    //validate inputs
    if ( !username ) throw Error('username is required');
    if ( !securityQuestion ) throw Error('securityQuestion is required');
    if ( !securityQuestionAnswer ) throw Error('securityQuestionAnswer is required');
    if ( !newPassword ) throw Error('newPassword is required');
    if ( newPassword.length < 8 ) throw Error('password must be at least 8 characters long');

    // get user by username
    const user = await util.getUserData(username);
    if (!user) throw Error('Incorrect values provided');

    // check the security question and answers match
    if (user.securityQuestion != securityQuestion || user.securityQuestionAnswer != securityQuestionAnswer) {
      throw Error('Incorrect values provided');
    }

    //create the password hash
    const pword = await bcrypt.hash(newPassword, saltRounds);

    // change the user's password
    await util.updateUserData({
      username: username,
      pword: pword
    });
  },

  /**
   * Auth.isAdmin used with routes when sessions must be for admin role users to use them
   * @param {object} req
   * @param {object} resp
   * @param {function} next express js uses this with routes to let it know when the route is working and should move on to the next function
   */
  isAdmin: async (req, _resp, next) => {
    const user = await util.getUserData('', req.header('x-session-id'));
    if (user.utype == 'admin') return next();
  }
};

module.exports = api;
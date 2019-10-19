const db = require('./db');

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
    /**
     * select uname, pword, client_code, utype, company, name, securityQuestion, securityAnswer, sessionID, signup_hash, active
from (select uname, max(tstamp) as max_tstamp from `default`.users group by uname) b
left join `default`.users u on b.uname = u.uname and b.max_tstamp = u.tstamp
where u.active = 1;
     */
  },

  /**
   * Auth.getUser returns details about a specific user
   * @param {String} username
   */
  getUser: async (username) => {

  },

  /**
   * Users.updateUser Admin update a user
   * @param {String} username
   * @param {String} email
   * @param {String} name
   * @param {String} company
   * @param {String} clientCode
   */
  updateUser: async (username, email, name, company, clientCode) => {

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

  },

  /**
   * Auth.isAdmin used with routes when sessions must be for admin role users to use them
   * @param {String} sessionID
   * @param {function} next express js uses this with routes
   */
  isAdmin: async (sessionID, next) => {

  }
};

module.exports = api;
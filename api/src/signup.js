const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * Signup
 * Handles signup for a user
 */
const api = {
  /**
   * Auth.login User login
   * @param {String} signupHash
   */
  verify: async (signupHash) => {
  },

  /**
   * Auth.logout Logout of session
   * @param {String} sessionID
   */
  complete: async (signupHash, email, ) => {

  }
};

module.exports = api;
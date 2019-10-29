const bcrypt = require('bcrypt');
const util = require('./util');
const saltRounds = 10;

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
    let user;
    try {
      user = await util.getUserData(username, '');
    } catch (err) {
      console.error(err);
      throw Error('Internal Error');
    }

    //validate the password
    let isValid = false;
    try {
      isValid = await bcrypt.compare(password, user.password);
    } catch (e) {
      // ignored purposefully
    }

    if (!isValid) {
      throw Error('Invalid credentials');
    }

    //set sessionID, update user data and return user data for display purposes
    const sessionID = Math.floor(Math.random()*1000000000000000000000).toString();
    try {
      await util.updateUserData({
        username: user.username,
        sessionID: sessionID
      });
    } catch (err) {
      console.error(err);
      throw Error('Internal Error');
    }

    return {
      sessionID: sessionID,
      username: user.username,
      name: user.name,
      company: user.company,
      userType: user.userType
    };
  },

  /**
   * Auth.logout Logout of session
   * @param {Object} user
   */
  logout: async (user) => {
    //validate inputs
    if ( !user ) throw Error('user data is required');

    //set sessionID, update user data and return user data for display purposes
    user.sessionID = '';
    await util.updateUserData(user);
  },

  /**
   * Auth.updateUser Logout of session
   * @param {String} sessionID required
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

    // add optional data if it exists
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
    if ( !username ) throw Error('Login is required');
    if ( !securityQuestion ) throw Error('Security Question is required');
    if ( !securityQuestionAnswer ) throw Error('Security Answer is required');
    if ( !newPassword ) throw Error('New Password is required');
    if ( newPassword.length < 8 ) throw Error('New Password must be at least 8 characters long');

    // get user by username
    const user = await util.getUserData(username, '');
    if (!user) throw Error('Incorrect values provided');

    // check the security question and answers match
    if (user.securityQuestion != securityQuestion || user.securityAnswer != securityQuestionAnswer) {
      throw Error('Incorrect values provided');
    }

    //create the password hash
    const pword = await bcrypt.hash(newPassword, saltRounds);

    // change the user's password
    await util.updateUserData({
      username: username,
      password: pword,
      sessionID: '' //reset session as well as a security precaution
    });
  },

  /**
   * Signup
   * @param {String} signupHash
   * @param {String} username
   * @param {String} securityQuestion
   * @param {String} securityAnswer
   * @param {String} password
   */
  signup: async (signupHash, username, securityQuestion, securityAnswer, password) => {
    if ( !signupHash ) throw Error('signupHash is required');
    if ( !securityQuestion ) throw Error('securityQuestion is required');
    if ( !securityAnswer ) throw Error('securityQuestionAnswer is required');
    if ( !password ) throw Error('password is required');
    if ( password.length < 8 ) throw Error('password must be at least 8 characters long');

    // get user by username
    const user = await util.getUserData(username, '');
    if (!user) throw Error('Invalid signup link');

    // check the security question and answers match
    if (user.signupHash != signupHash) {
      throw Error('Invalid signup link');
    }

    //create the password hash
    const pword = await bcrypt.hash(password, saltRounds);

    // change the user's password
    await util.updateUserData({
      username: username,
      password: pword,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      sessionID: '', //reset session as well as a security precaution
      signupHash: ''
    });
  }
};

module.exports = api;
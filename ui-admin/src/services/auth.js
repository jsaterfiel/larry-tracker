import apiInstance from './service';

const KEY_LOGIN_DATA = 'loginData';
const KEY_LOGIN_SESSION_ID = 'loginSessionID';

// helper to recover a session when a user reloads the page
let loginData = sessionStorage.getItem(KEY_LOGIN_DATA);
let loginSessionID = sessionStorage.getItem(KEY_LOGIN_SESSION_ID);
if (loginData && loginSessionID) {
  loginData = JSON.parse(loginData);
  apiInstance.setSessionID(loginSessionID);
} else {
  loginData = false;
  loginSessionID = false;
}

const api = {
  login: async (username, password) => {
    let result;
    
    result = await apiInstance.post('api/login', {
      username: username,
      password: password
    });
    if (!result.headers[apiInstance.HEADER_SESSION_ID]) {
      console.log('ERROR: login result had no session id');
      throw Error('Internal Error')
    }
    apiInstance.setSessionID(result.headers[apiInstance.HEADER_SESSION_ID]);
    sessionStorage.setItem(KEY_LOGIN_DATA, JSON.stringify(result.data));
    loginData = result.data;
    sessionStorage.setItem(KEY_LOGIN_SESSION_ID, result.headers[apiInstance.HEADER_SESSION_ID]);
    return result.data;
  },

  logout: async () => {
    let result
    sessionStorage.setItem(KEY_LOGIN_DATA, null);
    sessionStorage.setItem(KEY_LOGIN_SESSION_ID, null);
    try {
      result = await apiInstance.get('api/logout');
    } catch (e) {
      return false;
    }
    return result.data;
  },

  resetPassword: async (username, securityQuestion, securityAnswer, newPassword) => {
    await apiInstance.post('api/resetPassword', {
      username: username,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      newPassword: newPassword
    });
    return true;
  },
  
  signup: async (signupHash, username, securityQuestion, securityAnswer, password) => {
    await apiInstance.post('api/signup', {
      signupHash: signupHash,
      username: username,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      password: password
    });
    return true;
  },

  getLoginData: () => {
    return loginData;
  }
};

export default api;

export default {
  makeAdmin: () => {
    sessionStorage.setItem('loginData', '"{"username":"larry","name":"Larry the CEO","company":"Larry Tracker","userType":"admin"}"');
    sessionStorage.setItem('loginSessionID', '82963252818636820000');
  },
  clearLogin: () => {
    sessionStorage.setItem('loginData', '');
    sessionStorage.setItem('loginSessionID', '');
  },
  makeUser: () => {
    sessionStorage.setItem('loginData', '"{"username":"user","name":"A User","company":"Test","userType":"user"}"');
    sessionStorage.setItem('loginSessionID', '12398712987123987123');
  }
}
export default {
  makeAdmin: () => {
    sessionStorage.setItem('loginData', '"{"username":"larry","name":"Larry the CEO","company":"Larry Tracker","userType":"admin"}"');
    sessionStorage.setItem('loginSessionID', '82963252818636820000');
  }
}
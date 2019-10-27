import Axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8181/';

const apiInstance = Axios.create();

let sessionID = null;

apiInstance.HEADER_SESSION_ID = 'x-session-id';
apiInstance.interceptors.request.use((config) => {
  config.url = API_URL + config.url;
  if (sessionID) {
    config.headers = {[apiInstance.HEADER_SESSION_ID]: sessionID};
  }
  return config
});

apiInstance.setSessionID = (id) => {
  sessionID = id;
};

export default apiInstance;

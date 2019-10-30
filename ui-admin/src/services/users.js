import apiInstance from './service';

const api = {
  getUsers: async () => {
    const result = await apiInstance.get('api/getUsers');
    return result.data;
  },

  addUser: async (username, name, company, userType, email, clientCode) => {
    const result = await apiInstance.post('api/addUser', {
      username: username,
      userType: userType,
      email: email,
      name: name,
      company: company,
      clientCode: clientCode
    });
    return result.data;
  },

  getUser: async (username) => {
    const result = await apiInstance.get(`api/getUser?username=${username}`);
    return result.data;
  },

  updateUser: async (username, name, company, email, clientCode, active) => {
    await apiInstance.post('api/updateUser', {
      username: username,
      email: email,
      name: name,
      company: company,
      clientCode: clientCode,
      active: active
    });
    return true;
  }
};

export default api;

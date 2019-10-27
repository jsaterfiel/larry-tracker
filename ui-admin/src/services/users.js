import apiInstance from './service';

const api = {
  getUsers: async () => {
    let result
    result = await apiInstance.get('api/getUsers');
    return result.data;
  }
};

export default api;

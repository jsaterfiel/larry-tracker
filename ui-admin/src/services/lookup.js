import apiInstance from './service';

const api = {

  /**
   * @param {string} clientCode
   */
  getClientLevels: async (clientCode) => {
    const qs = `?clientCode=${encodeURIComponent(clientCode)}`;

    const result = await apiInstance.get('api/client-levels' + qs);
    return result.data;
  }
};

export default api;

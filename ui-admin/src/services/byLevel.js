import apiInstance from './service';

const api = {

  /**
   * @param {string} clientCode
   * @param {string} level1
   * @param {Date} startDate
   * @param {Date} endDate
   */
  byLevel: async (clientCode, level1, startDate, endDate) => {
    let startDateStr = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + (startDate.getDate());
    let endDateStr = endDate.getFullYear() + '-' + (endDate.getMonth()+1) + '-' + (endDate.getDate());

    let qs = `?startDate=${startDateStr}&endDate=${endDateStr}`;
    if (clientCode) {
      qs += `&clientCode=${encodeURIComponent(clientCode)}`;
    }
    if (level1) {
      qs += `&level1=${encodeURIComponent(level1)}`;
    }
    const result = await apiInstance.get('api/by-level' + qs);
    return result.data;
  }
};

export default api;

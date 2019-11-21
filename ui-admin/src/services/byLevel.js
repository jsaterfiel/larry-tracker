import apiInstance from './service';

const api = {

  /**
   * @param {string} clientCode
   * @param {string} level1
   * @param {Date} startDate
   * @param {Date} endDate
   */
  byLevel: async (clientCode, level1, startDate, endDate) => {
    //to deal with an issue with the end date only returning data up to and not including itself we need to increment the date by 1
    const offsetEndDate = new Date(endDate.getTime());

    let startDateStr = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + (startDate.getDate());
    let endDateStr = offsetEndDate.getFullYear() + '-' + (offsetEndDate.getMonth()+1) + '-' + (offsetEndDate.getDate());

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

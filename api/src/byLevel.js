const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * byLevel
 * Query for powering dashboards showing metrics for client data
 */
const api = {
  /**
   * ByLevel.process Used to query by level1
   * @param {String} startDate format YYYY-MM-DD
   * @param {String} endDate format YYYY-MM-DD
   * @param {String} client (optional)
   * @param {String} level1 (optional)
   */
  process: async (startDate, endDate, client, level1) => {
    let whereClauses = [];

    //process start and end dates
    if (startDate && endDate && typeof startDate == 'string' && typeof endDate == 'string') {
      startDate = startDate.replace(DB_ESC_REG, '');
      endDate = endDate.replace(DB_ESC_REG, '');
      const startDateParts = startDate.split('-');
      const endDateParts = endDate.split('-');
      // verify the dates are valid
      if (startDateParts.length === 3 && parseInt(startDateParts[0]) && parseInt(startDateParts[1]) && parseInt(startDateParts[2])
        && endDateParts.length === 3 && parseInt(endDateParts[0]) && parseInt(endDateParts[1]) && parseInt(endDateParts[2])) {
        const startDateObj = new Date(parseInt(startDateParts[0]), parseInt(startDateParts[1])+1, parseInt(startDateParts[2]));
        const endDateObj = new Date(parseInt(endDateParts[0]), parseInt(endDateParts[1])+1, parseInt(endDateParts[2]));
        // Final date invalid checks
        if (!startDateObj || !endDateObj) {
          throw Error('startDate and/or endDate are invalid');
        }
        if (endDateObj < startDateObj) {
          throw Error('startDate must be before endDate');
        }
        whereClauses.push(`start_date BETWEEN '${startDate}' and '${endDate}'`);
      } else {
        throw Error('startDate and/or endDate are invalid.  Expected format YYYY-MM-DD');
      }
    } else {
      throw Error('startDate and endDate are required');
    }

    if (client && typeof client == 'string') {
      client = client.replace(DB_ESC_REG, '');
      whereClauses.push(`client_code = '${client}' `);
      // cannot use level1 without a client code
      if (level1 && typeof level1 == 'string') {
        level1 = level1.replace(DB_ESC_REG, '');
        whereClauses.push(`level1_id = '${level1}'`);
      }
    } else if (level1) {
      throw Error('level1 cannot be passed without pcode');
    }
    

    let whereClause = '';
    if (whereClauses) {
      whereClause = 'WHERE ' + whereClauses.join(' and ');
    }
    // select client_code, level1_id, start_date, countState(dentsu_ots) as dentsu_ots, avgState(total_dwell_time) as total_dwell_time, avgState(half_in_view_time) as half_in_view_time, countState(clicked) as clicked, countState(interaction) as interaction, countState(was_ever_fully_in_view) as was_ever_fully_in_view, countState(ivt) as ivt
    const query = `SELECT start_date, sum(dentsu_ots) as dentsu_ots, avg(total_dwell_time)/1000 as total_dwell_time, avg(half_in_view_time)/1000 as half_in_view_time, sum(clicked) as clicked, sum(interaction) as interaction, sum(was_ever_fully_in_view) as was_ever_fully_in_view, sum(ivt) as ivt
    FROM \`default\`.byClientLevels
    ${whereClause}
    group by start_date
    order by start_date asc;`.replace(/\n/g,' ');

    let rows = await db.query(query).toPromise();
    return rows;
  }
};

module.exports = api;
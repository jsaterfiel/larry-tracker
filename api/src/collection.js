const db = require('./db');

// detect single quotes
const DB_ESC_REG = /['\\]/g;

/**
 * Collection api
 * Used to collect the ad tag metrics
 */
const api = {
  /**
   * process
   * Used to insert the pixel's data from the ad tag into the db
   * Input is an object of the query string parameters
   * The parameters are mostly encoded to make it harder for people to know what the query string is done
   * 
   * Query String Mapping:
   *   Client Code - pcode (required)
   *   Level 1 - level1 (required)
   *   Start Time - hw (required)
   *   Random(Ordinal) - ord (required)
   *   Dentsu OTS Metric - ba (default false)
   *   Total Dwell Time - ac (default 0)
   *   Half In-View Time - ct (default 0)
   *   Clicked - gs (default false)
   *   Interaction - ef (default false)
   *   Was Ever Fully In-View - fa (default false)
   *   IVT (Non-Human Traffic) - rt (default false)
   * 
   * @param {object} input 
   */
  process: async function(input){
    let data = {
      dentsu_ots: 0,
      total_dwell_time: 0,
      half_in_view_time: 0,
      clicked: 0,
      interaction: 0,
      was_ever_fully_in_view: 0,
      ivt: 0
    };
    if (input.pcode && typeof input.pcode == 'string') {
      data.client_code =  input.pcode.replace(DB_ESC_REG,'');
    } else {
      // invalid pixel
      return;
    }
    // Level 1
    if (input.level1 && typeof input.level1 == 'string') {
      data.level1_id = input.level1.replace(DB_ESC_REG,'');
    } else {
      // invalid pixel
      return;
    }
    // Start Time
    if (input.hw && input.hw > 0) {
      data.start_time = parseInt(input.hw);
      const startDate = new Date(parseInt(data.start_time));
      data.start_date = startDate.getFullYear() + '-' + (startDate.getMonth()+1) + '-' + startDate.getDate();
    } else {
      // invalid pixel
      return;
    }
    // Ordinal (random)
    if (input.ord) {
      // creating impression id = <timestamp>|<ord>
      data.impression_id =  data.start_time + '|' + input.ord.replace(DB_ESC_REG,'');
    } else {
      // invalid pixel
      return;
    }
    // Dentsu OTS Metric
    if (input.ba) {
      data.dentsu_ots = 1;
    }
    // Total Dwell Time
    if (input.ac && input.ac > 0) {
      data.total_dwell_time = input.ac;
    }
    // Half In-View Time
    if (input.ct && input.ct > 0) {
      data.half_in_view_time = input.ct;
    }
    // Clicked
    if (input.gs) {
      data.clicked = 1;
    }
    // Interaction
    if (input.ef) {
      data.interaction = 1;
    }
    // Was Ever Fully In-View
    if (input.fa && input.fa > 0) {
      data.was_ever_fully_in_view = input.fa;
    }
    // IVT (Non-Human Traffic)
    if (input.rt) {
      data.ivt = 1;
    }

    // due to using an AggregatingMergeTable we have to insert all the data using arrayReduce syntax since we want it to be aggregated for the maximum values
    const query = `INSERT INTO \`default\`.impressions
    (client_code, level1_id, start_date, impression_id, dentsu_ots, total_dwell_time, half_in_view_time, clicked, interaction, was_ever_fully_in_view, ivt)
    VALUES(
      '${data.client_code}',
      '${data.level1_id}',
      '${data.start_date}',
      '${data.impression_id}',
      arrayReduce('maxState', [toUInt8(${data.dentsu_ots})]),
      arrayReduce('maxState', [toUInt64(${data.total_dwell_time})]),
      arrayReduce('maxState', [toUInt64(${data.half_in_view_time})]),
      arrayReduce('maxState', [toUInt8(${data.clicked})]),
      arrayReduce('maxState', [toUInt8(${data.interaction})]),
      arrayReduce('maxState', [toUInt8(${data.was_ever_fully_in_view})]),
      arrayReduce('maxState', [toUInt8(${data.ivt})])
    );`;
    // inserts cannot have new line characters and must have an input object even if it's empty
    await db.insert(query.replace(/\n/g,''), {}).toPromise();
  }
};


module.exports = api;
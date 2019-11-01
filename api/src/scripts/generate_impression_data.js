process.env.API_DB_URL = 'localhost';

const db = require('../db');

const clientCode = 'client_1';

// level1_ids must add up to 100%
// total_dwell_time and half_in_view_time must be in milliseconds and represents the total time all impressions that day had
const dayValues = [
  // day 0
  {
    level1_ids: {
      '1000': .69,
      '1003': .17,
      '1085': .14
    },
    impressions: 4818,
    dentsu_ots: 3085,
    total_dwell_time: 438900,
    half_in_view_time: 137000,
    clicked: 463,
    interaction: 2381,
    was_ever_fully_in_view: 3321,
    ivt: 0
  },
  // day 1
  {
    level1_ids: {
      '1000': .71,
      '1003': .11,
      '1085': .18
    },
    impressions: 5995,
    dentsu_ots: 3899,
    clicks: 863,
    interaction: 2521,
    ivt: 61,
    was_ever_fully_in_view: 4129,
    total_dwell_time: 441200,
    half_in_view_time: 157700
  },
  // day 2
  {
    level1_ids: {
      '1000': .57,
      '1003': .16,
      '1085': .27
    },
    impressions: 4006,
    dentsu_ots: 1440,
    clicks: 224,
    interaction: 719,
    ivt: 49,
    was_ever_fully_in_view: 1983,
    total_dwell_time: 615500,
    half_in_view_time: 146900
  },
  // day 3
  {
    level1_ids: {
      '1000': .55,
      '1003': .17,
      '1145': .28
    },
    impressions: 3307,
    dentsu_ots: 1851,
    clicks: 271,
    interactions: 748,
    ivt: 0,
    was_ever_fully_in_view: 2023,
    total_dwell_time: 422300,
    half_in_view_time: 150600
  },
  // day 4
  {
    level1_ids: {
      '1000': .55,
      '1003': .17,
      '1145': .28
    },
    impressions: 3608,
    dentsu_ots: 1728,
    clicks: 127,
    interactions: 1033,
    ivt: 49,
    was_ever_fully_in_view: 1839,
    total_dwell_time: 422300,
    half_in_view_time: 150600
  },
  // day 5
  {
    level1_ids: {
      '1000': .68,
      '1003': .11,
      '1145': .21
    },
    impressions: 4871,
    dentsu_ots: 2516,
    clicks: 175,
    interactions: 990,
    ivt: 0,
    was_ever_fully_in_view: 2527,
    total_dwell_time: 673500,
    half_in_view_time: 91400
  },
  // day 6
  {
    level1_ids: {
      '1000': .68,
      '1003': .10,
      '1145': .22
    },
    impressions: 5493,
    dentsu_ots: 2831,
    clicks: 478,
    interactions: 1420,
    ivt: 54,
    was_ever_fully_in_view: 2876,
    total_dwell_time: 706200,
    half_in_view_time: 130800
  }
];

function weightedRand(spec) {
  var i, sum=0, r=Math.random();
  for (i in spec) {
    sum += spec[i];
    if (r <= sum) return i;
  }
}
// weightedRand({0:0.8, 1:0.1, 2:0.1});

function generateImpressionID() {
  return (Math.floor(Math.random()*1000000000000) + Date.now()) + '';
}

function formatDate(dte) {
  return dte.getFullYear() + '-' + (dte.getMonth()+1) + '-' + dte.getDate();
}

async function insertImpression(data) {
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

/**
 * 
 * {
    level1_ids: {
      '1000': .68,
      '1003': .10,
      '1145': .22
    },
    impressions: 5493,
    dentsu_ots: 2831,
    clicks: 478,
    interaction: 1420,
    ivt: 54,
    was_ever_fully_in_view: 2876,
    total_dwell_time: 70620,
    half_in_view_time: 13080
  }
 */
async function generateDate(spec, date) {
  console.log('processing date:', date);
  let impressions = spec.impressions;
  let dentsuOTS = spec.dentsu_ots;
  let clicks = spec.clicks;
  let interactions = spec.interactions;
  let ivtCount = spec.ivt;
  let fullyInView = spec.was_ever_fully_in_view;
  let dwellTime = Math.floor(spec.total_dwell_time / spec.impressions);
  let inViewTime = Math.floor(spec.half_in_view_time / spec.impressions);
  for(; impressions > -1; --impressions) {
    let data = {
      client_code: clientCode,
      level1_id: weightedRand(spec.level1_ids), //randomly selects the level1 based on a weight
      start_date: date, //YYYY-mm-dd
      impression_id: generateImpressionID(),
      // metrics
      dentsu_ots: ( (--dentsuOTS) > 0 ? 1 : 0),
      clicked: ( (--clicks) > 0 ? 1 : 0),
      interaction: ( (--interactions) > 0 ? 1 : 0),
      ivt: ( (--ivtCount) > 0 ? 1 : 0),
      was_ever_fully_in_view: ( (--fullyInView) > 0 ? 1 : 0),
      total_dwell_time: dwellTime,
      half_in_view_time: inViewTime
    };
    await insertImpression(data);
  }
}

async function processData() {
  let startDate = new Date();
  for (var data of dayValues) {
    let dateStr = formatDate(startDate);
    await generateDate(data, dateStr);
    startDate.setDate(startDate.getDate() -1);
  }
}

processData().then(() =>{
  console.log('Success!');
}).catch((err) => {
  console.error(err);
});

const { ClickHouse } = require('clickhouse');
 
const clickhouse = new ClickHouse({
  url: process.env.API_DB_URL || 'ch-server-1'
});

module.exports = clickhouse;
drop table if exists `default`.byClientLevels;
drop table if exists `default`.impressions;
drop table if exists `default`.users;

CREATE TABLE `default`.impressions (
	client_code String,
	level1_id String,
	start_date Date,
	impression_id String,
	dentsu_ots AggregateFunction(max, UInt8),
	total_dwell_time AggregateFunction(max, UInt64),
	half_in_view_time AggregateFunction(max, UInt64),
	clicked AggregateFunction(max, UInt8),
	interaction AggregateFunction(max, UInt8),
	was_ever_fully_in_view AggregateFunction(max, UInt8),
	ivt AggregateFunction(max, UInt8)
) ENGINE = AggregatingMergeTree()
PARTITION BY (
	client_code,
	start_date,
	level1_id
)
ORDER BY (
	client_code,
	start_date,
	level1_id,
	impression_id
);

CREATE VIEW `default`.byClientLevels
AS select client_code, sum(impressions) as impressions, level1_id, start_date, sum(dentsu_ots) as dentsu_ots, avg(total_dwell_time) as total_dwell_time, avg(half_in_view_time) as half_in_view_time, sum(clicked) as clicked, sum(interaction) as interaction, sum(was_ever_fully_in_view) as was_ever_fully_in_view, sum(ivt) as ivt
from (select uniq(1) as impressions, client_code, impression_id, level1_id, start_date, maxMerge(dentsu_ots) as dentsu_ots, maxMerge(total_dwell_time) as total_dwell_time, maxMerge(half_in_view_time) as half_in_view_time, maxMerge(clicked) as clicked, maxMerge(interaction) as interaction, maxMerge(was_ever_fully_in_view) as was_ever_fully_in_view, maxMerge(ivt) as ivt
from `default`.impressions
group by client_code, level1_id, start_date, impression_id)
group by client_code, level1_id, start_date;

CREATE TABLE `default`.users (
	username String,
	email String,
	password String,
	clientCode String,
	userType Enum('user' = 1, 'admin' = 2),
	company String,
	name String,
	securityQuestion Enum('What is your favorite color?' = 1, 'What is your favorite movie?' = 2, 'Who is your favorite teacher?' = 3),
	securityAnswer String,
	sessionID String,
	signupHash String,
	tstamp DateTime,
	active UInt8
) ENGINE = MergeTree()
PARTITION BY (
	username, sessionID
)
ORDER BY (username, sessionID, tstamp);
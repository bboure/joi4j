const neo4j = require('neo4j-driver').v1;
const makeDate = require('./date');

module.exports = [
  makeDate('neo4jDate', neo4j.types.Date),
  makeDate('neo4jDateTime', neo4j.types.DateTime),
  makeDate('neo4jLocalDateTime', neo4j.types.LocalDateTime),
];

const neo4j = require('neo4j-driver').v1;
const makeDateValidator = require('./date');
const neo4jPoint = require('./spatial');

module.exports = [
  makeDateValidator('neo4jDate', neo4j.types.Date),
  makeDateValidator('neo4jDateTime', neo4j.types.DateTime),
  makeDateValidator('neo4jLocalDateTime', neo4j.types.LocalDateTime),
  neo4jPoint,
];

import neo4j from 'neo4j-driver';
import makeDateValidator from './date';
import neo4jPoint from './spatial';

const { types: { Date, DateTime, LocalDateTime } } = neo4j;

const neo4jDate = makeDateValidator('neo4jDate', Date);

const neo4jDateTime = makeDateValidator('neo4jDateTime', DateTime);

const neo4jLocalDateTime = makeDateValidator('neo4jLocalDateTime', LocalDateTime);

export {
  neo4jDate,
  neo4jDateTime,
  neo4jLocalDateTime,
  neo4jPoint,
};

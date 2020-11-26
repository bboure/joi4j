import {
  Neo4jDateSchema,
  Neo4jDateTimeSchema,
  Neo4jLocalDateTimeSchema,
} from './date';
import { Neo4jPointSchema } from './spatial';

export * from './spatial';
export * from './date';

export type Joi4j = {
  neo4jPoint: () => Neo4jPointSchema;
  neo4jDate: () => Neo4jDateSchema;
  neo4jDateTime: () => Neo4jDateTimeSchema;
  neo4jLocalDateTime: () => Neo4jLocalDateTimeSchema;
};

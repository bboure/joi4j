import neo4j, {
  Date as Neo4jDate,
  DateTime,
  LocalDateTime,
} from 'neo4j-driver';

type DateTypes = string | number | Date | Neo4jDate | DateTime | LocalDateTime;

export const toDate = (value: DateTypes): Date => {
  try {
    if (value instanceof Date) {
      return value;
    } else if (
      typeof value === 'object' &&
      (neo4j.isDate(value) ||
        neo4j.isDateTime(value) ||
        neo4j.isLocalDateTime(value))
    ) {
      return new Date(value.toString());
    } else if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
  } catch (e) {}

  throw new Error(`"value" (${value}) is not a valid date`);
};

export const compare = (date1: DateTypes, date2: DateTypes) =>
  toDate(date1).getTime() - toDate(date2).getTime();

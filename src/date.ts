import { toDate, compare } from './utils';
import {
  Date as Neo4jDate,
  DateTime,
  Integer,
  LocalDateTime,
  types,
} from 'neo4j-driver';
import Joi, { AnySchema, Extension } from 'joi';

type Constructors =
  | typeof types.Date
  | typeof types.DateTime
  | typeof types.LocalDateTime;

const makeDateValidator = (name: string, type: Constructors): Extension => {
  const generateValidate = (
    rule: string,
    compareFunction: (a: any, b: any) => boolean,
  ) => (value: any, helpers: any, args: { limit: any }) => {
    if (compareFunction(value, args.limit)) {
      return value;
    }

    return helpers.error(`${name}.${rule}`, { limit: args.limit });
  };
  return {
    type: name,
    messages: {
      [`${name}.base`]: `{{#label}} must be a valid ${type.name}`,
      [`${name}.min`]: '{{#label}} must be greater than or equal to "{{#limit}}"',
      [`${name}.max`]: '{{#label}} must be less than or equal to "{{#limit}}"',
      [`${name}.less`]: '{{#label}} must be less than "{{#limit}}"',
      [`${name}.greater`]: '{{#label}} must be greater than "{{#limit}}"',
    },
    coerce: {
      from: ['number', 'string', 'object'],
      method: (value: string | number | object) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          value instanceof Date
        ) {
          try {
            return { value: type.fromStandardDate(toDate(value)) };
          } catch (e) {
            return { value };
          }
        }

        return { value };
      },
    },
    validate(value, { error }) {
      if (value instanceof type) {
        return { value };
      }

      return { value, errors: error(`${name}.base`) };
    },
    rules: {
      min: {
        method(limit) {
          return this.$_addRule({ name: 'min', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: value => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate(
          'min',
          (date1, date2) => compare(date1, date2) >= 0,
        ),
      },
      max: {
        method(limit) {
          return this.$_addRule({ name: 'max', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: value => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate(
          'max',
          (date1, date2) => compare(date1, date2) <= 0,
        ),
      },
      less: {
        method(limit) {
          return this.$_addRule({ name: 'less', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: value => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate(
          'less',
          (date1, date2) => compare(date1, date2) < 0,
        ),
      },
      greater: {
        method(limit) {
          return this.$_addRule({ name: 'greater', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: value => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate(
          'greater',
          (date1, date2) => compare(date1, date2) > 0,
        ),
      },
    },
  };
};

export const neo4jDate = makeDateValidator('neo4jDate', types.Date);

export const neo4jDateTime = makeDateValidator('neo4jDateTime', types.DateTime);

export const neo4jLocalDateTime = makeDateValidator(
  'neo4jLocalDateTime',
  types.LocalDateTime,
);

export interface Neo4jDateSchema extends AnySchema {
  min: (limit: Neo4jDate<number | Integer> | Joi.Reference) => Neo4jDateSchema;
  max: (limit: Neo4jDate<number | Integer> | Joi.Reference) => Neo4jDateSchema;
  less: (limit: Neo4jDate<number | Integer> | Joi.Reference) => Neo4jDateSchema;
  greater: (
    limit: Neo4jDate<number | Integer> | Joi.Reference,
  ) => Neo4jDateSchema;
}

export interface Neo4jDateTimeSchema extends AnySchema {
  min: (
    limit: DateTime<number | Integer> | Joi.Reference,
  ) => Neo4jDateTimeSchema;
  max: (
    limit: DateTime<number | Integer> | Joi.Reference,
  ) => Neo4jDateTimeSchema;
  less: (
    limit: DateTime<number | Integer> | Joi.Reference,
  ) => Neo4jDateTimeSchema;
  greater: (
    limit: DateTime<number | Integer> | Joi.Reference,
  ) => Neo4jDateTimeSchema;
}

export interface Neo4jLocalDateTimeSchema extends AnySchema {
  min: (
    limit: LocalDateTime<number | Integer> | Joi.Reference,
  ) => Neo4jLocalDateTimeSchema;
  max: (
    limit: LocalDateTime<number | Integer> | Joi.Reference,
  ) => Neo4jLocalDateTimeSchema;
  less: (
    limit: LocalDateTime<number | Integer> | Joi.Reference,
  ) => Neo4jLocalDateTimeSchema;
  greater: (
    limit: LocalDateTime<number | Integer> | Joi.Reference,
  ) => Neo4jLocalDateTimeSchema;
}

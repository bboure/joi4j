import { toDate, compare } from './utils';

export default function (name, type) {
  const generateValidate = (rule, compareFunction) => (value, { error }, { limit }) => {
    if (compareFunction(value, limit)) {
      return value;
    }

    return error(`${name}.${rule}`, { limit });
  };
  return {
    type: name,
    messages: {
      [`${name}.base`]: `"{{#label}}" must be a valid ${type.name}`,
      [`${name}.min`]: '"{{#label}}" must be greater than or equal to "{{#limit}}"',
      [`${name}.max`]: '"{{#label}}" must be less than or equal to "{{#limit}}"',
      [`${name}.less`]: '"{{#label}}" must be less than "{{#limit}}"',
      [`${name}.greater`]: '"{{#label}}" must be greater than "{{#limit}}"',
    },
    validate(value, { error }) {
      if (value instanceof type) {
        return { value };
      }

      return { value, errors: error(`${name}.base`) };
    },
    coerce(value) {
      if (!(value instanceof type)) {
        try {
          return { value: type.fromStandardDate(toDate(value)) };
        // eslint-disable-next-line no-empty
        } catch (e) {
        }
      }

      return { value };
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
            assert: (value) => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate('min', (date1, date2) => compare(date1, date2) >= 0),
      },
      max: {
        method(limit) {
          return this.$_addRule({ name: 'max', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: (value) => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate('max', (date1, date2) => compare(date1, date2) <= 0),
      },
      less: {
        method(limit) {
          return this.$_addRule({ name: 'less', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: (value) => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate('less', (date1, date2) => compare(date1, date2) < 0),
      },
      greater: {
        method(limit) {
          return this.$_addRule({ name: 'greater', args: { limit } });
        },
        args: [
          {
            name: 'limit',
            ref: true,
            assert: (value) => value instanceof type,
            message: 'must be a Date',
          },
        ],
        validate: generateValidate('greater', (date1, date2) => compare(date1, date2) > 0),
      },
    },
  };
}

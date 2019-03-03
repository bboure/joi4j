const neo4j = require('neo4j-driver').v1;
const utils = require('./utils');

module.exports = function(name, type) {
    return function (joi) {
        const generateValidate = function(type, compare) {
            return function(params, value, state, options) {
                const limit = utils.resolveParam(joi, params.limit, state, options);
                if (!compare(value, limit)) {
                  return this.createError(name + '.' + type, { value: value, limit: limit }, state, options);
                }

                return value;
            };
        };
        return {
          name: name,
          language: {
            base: 'must be a valid ' + type.name,
            min: 'must be larger than or equal to "{{limit}}"',
            max: 'must be less than or equal to "{{limit}}"',
            less: 'must be less than "{{limit}}"',
            greater: 'must be larger than "{{limit}}"',
          },
          pre(value, state, options) {
            if (!(value instanceof type) && options.convert) {
                try {
                    value = type.fromStandardDate(utils.toDate(value));
                } catch (e) {
                }
            }
            if (!(value instanceof type)) {
                return this.createError(name + ".base", { value: value }, state, options);
            }

            return value;
          },
          rules: [
            {
              name: 'min',
              params: {
                limit: joi.alternatives([joi.lazy(() => joi[name]()), joi.func().ref()]).required(),
              },
              validate: generateValidate('min', (date1, date2) => utils.compare(date1, date2) >= 0),
            },
            {
              name: 'max',
              params: {
                limit: joi.alternatives([joi.lazy(() => joi[name]()), joi.func().ref()]).required(),
              },
              validate: generateValidate('max', (date1, date2) => utils.compare(date1, date2) <= 0),
            },
            {
              name: 'less',
              params: {
                limit: joi.alternatives([joi.lazy(() => joi[name]()), joi.func().ref()]).required(),
              },
              validate: generateValidate('less', (date1, date2) => utils.compare(date1, date2) < 0),
            },
            {
              name: 'greater',
              params: {
                limit: joi.alternatives([joi.lazy(() => joi[name]()), joi.func().ref()]).required(),
              },
              validate: generateValidate('greater', (date1, date2) => utils.compare(date1, date2) > 0),
            },
          ],
        };
    };
};
const neo4j = require('neo4j-driver').v1;

module.exports = function(joi) {
    return {
      name: 'neo4jDate',
      base: joi.object().type(neo4j.types.Date),
      language: {
        min: "must be greater or equal to {{q}}"
      },
      coerce: (value, state, options) => {

        if (options.convert) {
          try {
            if (typeof value === 'string') {
              value = neo4j.types.Date.fromStandardDate(new Date(value));
            } else if (value instanceof Date) {
              value = neo4j.types.Date.fromStandardDate(value);
            }
          } catch (e) {
            return value;
          }
        }

        return value;
      },
      rules: [
        {
          name: 'min',
          description(params) {
              return `Date should be after ${params.compared}`;
          },
          params: {
              q: joi.func().ref(),
          },
          validate(params, value, state, options) {
              const thisDate = new Date(value.toString());
              const toDate = new Date(params.q(state.reference || state.parent, options).toString());

              if (thisDate.getTime() < toDate.getTime()) {
                return this.createError('neo4jDate.min', { v: value, q: params.q }, state, options);
              }

              return value;
          }
        },
      ],
    };
};

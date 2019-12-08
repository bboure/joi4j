const neo4j = require('neo4j-driver').v1;

// FIXME: Timezone???
const toDate = function(value) {
  try {
    if (value instanceof Date) {
      return value;
    } else if (neo4j.isDate(value)
      || neo4j.isDateTime(value)
      || neo4j.isLocalDateTime(value)
    ) {
      return new Date(value.toString());
    } else {
      return new Date(value);
    }  
  } catch (e) {
    return value;
  }
};

const compare = function(date1, date2) {
  return toDate(date1).getTime() - toDate(date2).getTime();
}

const resolveParam = function(joi, param, state, options) {
  return joi.isRef(param)
    ? param(state.reference || state.parent, options)
    : param;
}

module.exports = {
    toDate,
    compare,
    resolveParam,
};
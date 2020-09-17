const neo4j = require('neo4j-driver');

// FIXME: Timezone???
const toDate = (value) => {
  try {
    if (value instanceof Date) {
      return value;
    } if (neo4j.isDate(value)
      || neo4j.isDateTime(value)
      || neo4j.isLocalDateTime(value)
    ) {
      return new Date(value.toString());
    }
    return new Date(value);
  } catch (e) {
    return value;
  }
};

const compare = (date1, date2) => toDate(date1).getTime() - toDate(date2).getTime();

const resolveParam = (joi, param, state, options) => {
  return joi.isRef(param)
    ? param(state.reference || state.parent, options)
    : param;
}

module.exports = {
  toDate,
  compare,
  resolveParam,
};

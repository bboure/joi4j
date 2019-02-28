const joi4j = require('./index.js');
const joi = require('joi');
const neo4j = require('neo4j-driver').v1

const validator = joi.extend(joi4j);

it ('should convert string to neo4j.Date', async (done) => {
  validator.validate(
    "2019-01-01",
    validator.neo4jDate(),
    function (error, data) {
      expect(error).toBeNull();
      expect(data).toBeInstanceOf(neo4j.types.Date);
      expect(data.toString()).toEqual("2019-01-01");
      done();
    }
  );
});

it ('should convert Js Date to neo4j.Date', async (done) => {
  validator.validate(
    new Date("2019-01-01"),
    validator.neo4jDate(),
    function (error, data) {
      expect(error).toBeNull();
      expect(data).toBeInstanceOf(neo4j.types.Date);
      expect(data.toString()).toEqual("2019-01-01");
      done();
    }
  );
});

it ('should throw an error if invalid neo4j.Date', async (done) => {
  validator.validate(
    "foobar",
    validator.neo4jDate(),
    function (error, data) {
      expect(error).not.toBeNull();
      done();
    }
  );
});

it ('should throw an error if invalid neo4j.Date', async (done) => {
  validator.validate(
    {},
    validator.neo4jDate(),
    function (error, data) {
      expect(error).not.toBeNull();
      done();
    }
  );
});

it ('min should work when reference is <= than value', async (done) => {
  validator.validate(
    {
      "from": "2019-01-01",
      "to": "2020-01-31",
    },
    validator.object().keys({
      "from": validator.neo4jDate(),
      "to": validator.neo4jDate().min(validator.ref('from')),
    }),
    function (error, data) {
      expect(error).toBeNull();
      done();
    }
  );
});

it ('min should throw an error when reference is > than value', async (done) => {
  validator.validate(
    {
      "from": "2019-01-01",
      "to": "2018-01-31",
    },
    validator.object().keys({
      "from": validator.neo4jDate().required(),
      "to": validator.neo4jDate().min(validator.ref("from")),
    }),
    function (error, data) {
      expect(error).not.toBeNull();
      expect(error.toString()).toEqual('ValidationError: child "to" fails because ["to" must be greater or equal to ref:from]');

      done();
    }
  );
});

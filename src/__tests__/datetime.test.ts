import Joi from 'joi';
import neo4j from 'neo4j-driver';
import { neo4jDateTime } from '../index';

const validator = Joi.extend(neo4jDateTime);
const schema = validator.neo4jDateTime();

describe('neo4jDateTime', () => {
  describe('base', () => {
    it('should convert string to neo4j.DateTime', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const result = await schema.validateAsync(dnow.toString());
      expect(result).toBeInstanceOf(neo4j.types.DateTime);
      expect(result.toString()).toEqual(dnow.toString());
    });

    it('should convert Js Date to neo4j.DateTime', async () => {
      const now = Date.now();
      const dnow = new Date(now);
      const neoDateTimeNow = neo4j.types.DateTime.fromStandardDate(dnow);
      const result = await schema.validateAsync(dnow);
      expect(result).toBeInstanceOf(neo4j.types.DateTime);
      expect(result.toString()).toEqual(neoDateTimeNow.toString());
    });

    it('should accept a Neo4j DateTime', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const result = await schema.validateAsync(dnow);
      expect(result).toBeInstanceOf(neo4j.types.DateTime);
      expect(result).toBe(dnow);
    });

    it('should throw an error if invalid neo4j.DateTime', async () => {
      expect.assertions(1);
      try {
        await schema.validateAsync('foobar');
      } catch (error) {
        expect(error.details[0].message).toEqual(
          '"value" must be a valid DateTime',
        );
      }
    });

    it('should be able to be opitonal', async () => {
      const extendedSchema = validator.object().keys({ date: schema });
      await expect(extendedSchema.validateAsync({})).resolves.toBeTruthy();
    });

    it('should accept null values', async () => {
      const result = await schema.allow(null).validateAsync(null);
      expect(result).toBeNull();
    });
  });

  describe('min', () => {
    it('should work by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const same = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const past = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
      await expect(schema.min(same).validateAsync(dnow)).resolves.toBeTruthy();
      await expect(schema.min(past).validateAsync(dnow)).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000));
      const extendedSchema = validator.object().keys({
        from: schema,
        to: schema.min(validator.ref('from')),
      });
      await expect(
        extendedSchema.validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('should throw an error by value', async () => {
      expect.assertions(1);
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const future = neo4j.types.DateTime.fromStandardDate(
        new Date(now + 1000),
      );
      try {
        await schema.min(future).validateAsync(dnow);
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"value" must be greater than or equal to "${future}"`,
        );
      }
    });

    it('should throw an error by reference', async () => {
      expect.assertions(1);
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
      const extendedSchema = validator.object().keys({
        from: schema,
        to: schema.min(validator.ref('from')),
      });
      try {
        await extendedSchema.validateAsync({ from, to });
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"to" must be greater than or equal to "${from}"`,
        );
      }
    });
  });

  describe('max', () => {
    it('should work by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const same = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const future = neo4j.types.DateTime.fromStandardDate(
        new Date(now + 1000),
      );
      await expect(schema.max(same).validateAsync(dnow)).resolves.toBeTruthy();
      await expect(
        schema.max(future).validateAsync(dnow),
      ).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000));
      const extendedSchema = validator.object().keys({
        from: schema.max(validator.ref('to')),
        to: schema,
      });
      await expect(
        extendedSchema.validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('should throw an error by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const past = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
      try {
        await schema.max(past).validateAsync(dnow);
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"value" must be less than or equal to "${past}"`,
        );
      }
    });

    it('should throw an error by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
      try {
        await validator
          .object()
          .keys({
            from: schema.max(validator.ref('to')),
            to: schema,
          })
          .validateAsync({ from, to });
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"from" must be less than or equal to "${to}"`,
        );
      }
    });
  });

  describe('greater', () => {
    it('should work by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const past = neo4j.types.DateTime.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      await expect(
        schema.greater(past).validateAsync(dnow),
      ).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      await expect(
        validator
          .object()
          .keys({
            from: schema,
            to: schema.greater(validator.ref('from')),
          })
          .validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('should throw an error by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const future = neo4j.types.DateTime.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      try {
        await schema.greater(future).validateAsync(dnow);
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"value" must be greater than "${future}"`,
        );
      }
    });

    it('should throw an error by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await validator
          .object()
          .keys({
            from: schema,
            to: schema.greater(validator.ref('from')),
          })
          .validateAsync({ from, to });
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"to" must be greater than "${from}"`,
        );
      }
    });
  });

  describe('less', () => {
    it('should work by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const future = neo4j.types.DateTime.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      await expect(
        schema.less(future).validateAsync(dnow),
      ).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      try {
        await validator
          .object()
          .keys({
            from: validator.neo4jDateTime().less(validator.ref('to')),
            to: validator.neo4jDateTime(),
          })
          .validate({ from, to });
      } catch (error) {
        expect(error).toBeUndefined();
      }
    });

    it('should throw an error by value', async () => {
      const now = Date.now();
      const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const past = neo4j.types.DateTime.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await schema.less(past).validateAsync(dnow);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error.details[0].message).toEqual(
          `"value" must be less than "${past}"`,
        );
      }
    });

    it('should throw an error by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
      const to = neo4j.types.DateTime.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await validator
          .object()
          .keys({
            from: validator.neo4jDateTime().less(validator.ref('to')),
            to: validator.neo4jDateTime(),
          })
          .validateAsync({ from, to });
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"from" must be less than "${to}"`,
        );
      }
    });
  });
});

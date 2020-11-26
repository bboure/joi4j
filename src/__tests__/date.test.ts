import Joi, { Root } from 'joi';
import neo4j from 'neo4j-driver';
import { Joi4j, neo4jDate } from '../index';

const JoiExtended: Root & Joi4j = Joi.extend(neo4jDate);
const schema = JoiExtended.neo4jDate();

describe('neo4jDate', () => {
  describe('base', () => {
    it('should convert string to neo4j.Date', async () => {
      const now = Date.now();
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const result = await schema.validateAsync(dnow.toString());
      expect(result).toBeInstanceOf(neo4j.types.Date);
      expect(result.toString()).toEqual(dnow.toString());
    });

    it('should convert Js Date to neo4j.Date', async () => {
      const now = Date.now();
      const dnow = new Date(now);
      const neoDateNow = neo4j.types.Date.fromStandardDate(dnow);

      const result = await schema.validateAsync(dnow);
      expect(result).toBeInstanceOf(neo4j.types.Date);
      expect(result.toString()).toEqual(neoDateNow.toString());
    });

    it('should accept a Neo4j Date', async () => {
      const now = Date.now();
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));

      const result = await schema.validateAsync(dnow);
      expect(result).toBeInstanceOf(neo4j.types.Date);
      expect(result).toBe(dnow);
    });

    it('should throw an error if invalid neo4j.Date', async () => {
      expect.assertions(1);
      try {
        await schema.validateAsync('foobar');
      } catch (error) {
        expect(error.details[0].message).toEqual(
          '"value" must be a valid Date',
        );
      }
    });

    it('should be able to be opitonal', async () => {
      const extendedSchema = JoiExtended.object().keys({ date: schema });
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
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const same = neo4j.types.Date.fromStandardDate(new Date(now));
      const past = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );

      await expect(schema.min(same).validateAsync(dnow)).resolves.toBeTruthy();
      await expect(schema.min(past).validateAsync(dnow)).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      const extendedSchema = JoiExtended.object().keys({
        from: schema,
        to: schema.min(JoiExtended.ref('from')),
      });
      await expect(
        extendedSchema.validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('should throw an error by value', async () => {
      expect.assertions(1);
      const now = Date.now();
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const future = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
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
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await JoiExtended.object()
          .keys({
            from: schema,
            to: schema.min(JoiExtended.ref('from')),
          })
          .validateAsync({ from, to });
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
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const same = neo4j.types.Date.fromStandardDate(new Date(now));
      const future = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );

      await expect(schema.max(same).validateAsync(dnow)).resolves.toBeTruthy();
      await expect(
        schema.max(future).validateAsync(dnow),
      ).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      await expect(
        JoiExtended.object()
          .keys({
            from: schema.max(JoiExtended.ref('to')),
            to: schema,
          })
          .validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('should throw an error by value', async () => {
      expect.assertions(1);
      const now = Date.now();
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const past = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await schema.max(past).validateAsync(dnow);
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"value" must be less than or equal to "${past}"`,
        );
      }
    });

    it('should throw an error by reference', async () => {
      expect.assertions(1);
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await JoiExtended.object()
          .keys({
            from: schema.max(JoiExtended.ref('to')),
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
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const past = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      await expect(
        schema.greater(past).validateAsync(dnow),
      ).resolves.toBeTruthy();
    });

    it('should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      await expect(
        JoiExtended.object()
          .keys({
            from: schema,
            to: schema.greater(JoiExtended.ref('from')),
          })
          .validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('should throw an error by value', async () => {
      expect.assertions(1);
      const now = Date.now();
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const future = neo4j.types.Date.fromStandardDate(
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
      expect.assertions(1);
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await JoiExtended.object()
          .keys({
            from: schema,
            to: schema.greater(JoiExtended.ref('from')),
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
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const future = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      await expect(
        schema.less(future).validateAsync(dnow),
      ).resolves.toBeTruthy();
    });

    it('less should work by reference', async () => {
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now + 1000 * 3600 * 24),
      );
      await expect(
        JoiExtended.object()
          .keys({
            from: schema.less(JoiExtended.ref('to')),
            to: schema,
          })
          .validateAsync({ from, to }),
      ).resolves.toBeTruthy();
    });

    it('less should throw an error by value', async () => {
      expect.assertions(1);
      const now = Date.now();
      const dnow = neo4j.types.Date.fromStandardDate(new Date(now));
      const past = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await schema.less(past).validateAsync(dnow);
      } catch (error) {
        expect(error.details[0].message).toEqual(
          `"value" must be less than "${past}"`,
        );
      }
    });

    it('less should throw an error by reference', async () => {
      expect.assertions(1);
      const now = Date.now();
      const from = neo4j.types.Date.fromStandardDate(new Date(now));
      const to = neo4j.types.Date.fromStandardDate(
        new Date(now - 1000 * 3600 * 24),
      );
      try {
        await JoiExtended.object()
          .keys({
            from: schema.less(JoiExtended.ref('to')),
            to: schema,
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

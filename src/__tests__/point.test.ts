import Joi, { Root } from 'joi';
import neo4j from 'neo4j-driver';
import { Joi4j, neo4jPoint } from '..';

const JoiExtended: Root & Joi4j = Joi.extend(neo4jPoint);

const schema = JoiExtended.neo4jPoint();

describe('neo4jPoint', () => {
  describe('base', () => {
    it('should convert cartesian object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(7203, 200, 100);
      const input = { x: 200, y: 100 };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should convert 3D cartesian object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(9157, 200, 100, 30);
      const input = { x: 200, y: 100, z: 30 };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should convert coordinates object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(4326, 10, 20);
      const input = { lon: 10, lat: 20 };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should convert 3D coordinates object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(4979, 10, 20, 30);
      const input = { lon: 10, lat: 20, height: 30 };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should convert "long" coordinates object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(4326, 10, 20);
      const input = { longitude: 10, latitude: 20 };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should convert "long" 3D coordinates object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(4979, 10, 20, 30);
      const input = { longitude: 10, latitude: 20, height: 30 };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should convert full object to neo4j.Point', async () => {
      const point = new neo4j.types.Point(4979, 10, 20, 30);
      const input = {
        srid: 4979,
        x: 10,
        y: 20,
        z: 30,
      };
      const result = await schema.validateAsync(input);
      expect(neo4j.spatial.isPoint(result)).toBeTruthy();
      expect(result.toString()).toEqual(point.toString());
    });

    it('should fail with invalid srid', async () => {
      expect.assertions(1);
      try {
        await schema.validateAsync(new neo4j.types.Point(9999, 10, 20, 30));
      } catch (error) {
        expect(error.details[0].message).toEqual(
          '"value" must be a valid point',
        );
      }
    });

    [
      { lat: 100, lon: 190 },
      { lat: -100, lon: -190 },
    ].forEach(point => {
      it('should fail with invalid coordinates', async () => {
        expect.assertions(1);
        try {
          await schema.validateAsync(
            new neo4j.types.Point(4326, point.lon, point.lat),
          );
        } catch (error) {
          expect(error.details[0].message).toEqual(
            '"value" must be a valid point',
          );
        }
      });

      it('should fail with invalid 3D coordinates', async () => {
        expect.assertions(1);
        try {
          await schema.validateAsync(
            new neo4j.types.Point(4979, point.lon, point.lat, 30),
          );
        } catch (error) {
          expect(error.details[0].message).toEqual(
            '"value" must be a valid point',
          );
        }
      });
    });

    it('should accept null values', async () => {
      const result = await schema.allow(null).validateAsync(null);
      expect(result).toBeNull();
    });
  });

  describe('coordinates', () => {
    [4979, 4326].forEach(srid => {
      it('should validate a coordinates Point', async () => {
        const point = new neo4j.types.Point(srid, 10, 20);
        const result = await schema.coordinates().validateAsync(point);
        expect(neo4j.spatial.isPoint(result)).toBeTruthy();
        expect(result.toString()).toEqual(point.toString());
      });
    });

    [9157, 7203].forEach(srid => {
      it('should fail with invalid coordinates Point', async () => {
        expect.assertions(1);
        const point = new neo4j.types.Point(srid, 10, 20);
        try {
          await schema.coordinates().validateAsync(point);
        } catch (error) {
          expect(error.details[0].message).toEqual(
            '"value" must be a valid coordinates point',
          );
        }
      });
    });
  });

  describe('cartesian', () => {
    [9157, 7203].forEach(srid => {
      it('should validate a cartesian Point', async () => {
        const point = new neo4j.types.Point(srid, 10, 20);
        const result = await schema.cartesian().validateAsync(point);
        expect(neo4j.spatial.isPoint(result)).toBeTruthy();
        expect(result.toString()).toEqual(point.toString());
      });
    });

    [4979, 4326].forEach(srid => {
      it('should fail with invalid cartesian Point', async () => {
        expect.assertions(1);
        const point = new neo4j.types.Point(srid, 10, 20);
        try {
          await schema.cartesian().validateAsync(point);
        } catch (error) {
          expect(error.details[0].message).toEqual(
            '"value" must be a valid cartesian point',
          );
        }
      });
    });
  });

  describe('3D', () => {
    [9157, 4979].forEach(srid => {
      it('should validate a 3D Point', async () => {
        const point = new neo4j.types.Point(srid, 10, 20, 30);
        const result = await schema.is3d().validateAsync(point);
        expect(neo4j.spatial.isPoint(result)).toBeTruthy();
        expect(result.toString()).toEqual(point.toString());
      });
    });

    [7203, 4326].forEach(srid => {
      it('should fail with invalid 3D Point', async () => {
        expect.assertions(1);
        const point = new neo4j.types.Point(srid, 10, 20, 30);
        try {
          await schema.is3d().validateAsync(point);
        } catch (error) {
          expect(error.details[0].message).toEqual(
            '"value" must be a valid 3D point',
          );
        }
      });
    });
  });

  describe('2D', () => {
    [7203, 4326].forEach(srid => {
      it('should validate a 2D Point', async () => {
        const point = new neo4j.types.Point(srid, 10, 20);
        const result = await schema.is2d().validateAsync(point);
        expect(neo4j.spatial.isPoint(result)).toBeTruthy();
        expect(result.toString()).toEqual(point.toString());
      });
    });

    [9157, 4979].forEach(srid => {
      it('should fail with invalid 2D Point', async () => {
        expect.assertions(1);
        const point = new neo4j.types.Point(srid, 10, 20);
        try {
          await schema.is2d().validateAsync(point);
        } catch (error) {
          expect(error.details[0].message).toEqual(
            '"value" must be a valid 2D point',
          );
        }
      });
    });
  });
});

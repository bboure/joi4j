const neo4j = require('neo4j-driver');

const isCartesian = (point) => [9157, 7203].includes(point.srid);

const isCoordinates = (point) => [4979, 4326].includes(point.srid)
  && Math.abs(point.x) <= 180
  && Math.abs(point.y) <= 90;

export default {
  type: 'neo4jPoint',
  messages: {
    'neo4jPoint.base': '"{{#label}}" must be a valid point',
    'neo4jPoint.coordinates': '"{{#label}}" must be a valid coordinates point',
    'neo4jPoint.cartesian': '"{{#label}}" must be a valid cartesian point',
    'neo4jPoint.is3d': '"{{#label}}" must be a valid 3D point',
    'neo4jPoint.is2d': '"{{#label}}" must be a valid 2D point',
  },
  coerce(value) {
    if (!neo4j.spatial.isPoint(value) && typeof value === 'object') {
      const point = { ...value };
      // Detect srid from keys
      if (value.srid === undefined) {
        if ((value.longitude || value.lon) && (value.latitude || value.lat)) {
          point.srid = point.height || point.height === 0 ? 4979 : 4326;
        } else if (point.x && point.y) {
          point.srid = point.z || point.z === 0 ? 9157 : 7203;
        }
      } else if (typeof point.srid === 'string') {
        switch (point.srid.toUpperCase()) {
          case 'WGS-84':
            point.srid = 4326;
            break;
          case 'WGS-84-3D':
            point.srid = 4979;
            break;
          case 'CARTESIAN':
            point.srid = 7203;
            break;
          case 'CARTESIAN-3D':
            point.srid = 9157;
            break;
          default:
            point.srid = undefined;
        }
      }
      // Normalize coordinates points
      point.x = point.x || point.longitude || point.lon;
      point.y = point.y || point.latitude || point.lat;
      point.z = point.z || point.height;

      try {
        return { value: new neo4j.types.Point(point.srid, point.x, point.y, point.z) };
      // eslint-disable-next-line no-empty
      } catch (error) {
      }
    }

    return { value };
  },
  validate(value, { error }) {
    if (neo4j.spatial.isPoint(value) && (isCartesian(value) || isCoordinates(value))) {
      return { value };
    }

    return { value, errors: error('neo4jPoint.base') };
  },
  rules: {
    coordinates: {
      method() {
        return this.$_addRule({ name: 'coordinates' });
      },
      validate(value, { error }) {
        if (!isCoordinates(value)) {
          return error('neo4jPoint.coordinates');
        }

        return value;
      },
    },
    cartesian: {
      method() {
        return this.$_addRule({ name: 'cartesian' });
      },
      validate(value, { error }) {
        if (!isCartesian(value)) {
          return error('neo4jPoint.cartesian');
        }

        return value;
      },
    },
    is3d: {
      method() {
        return this.$_addRule({ name: 'is3d' });
      },
      validate(value, { error }) {
        if ((value.srid !== 9157 && value.srid !== 4979) || value.z === undefined) {
          return error('neo4jPoint.is3d');
        }

        return value;
      },
    },
    is2d: {
      method() {
        return this.$_addRule({ name: 'is2d' });
      },
      validate(value, { error }) {
        if ((value.srid !== 7203 && value.srid !== 4326) || value.z !== undefined) {
          return error('neo4jPoint.is2d');
        }

        return value;
      },
    },
  },
};

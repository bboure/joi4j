const neo4j = require('neo4j-driver').v1;

const isCartesian = function(point) {
    return [9157, 7203].indexOf(point.srid) !== -1;
}

const isCoordinates = function(point) {
    return [4979, 4326].indexOf(point.srid) !== -1 && Math.abs(point.x) <= 180 && Math.abs(point.y) <= 90;
}

module.exports = function (joi) {
    return {
        name: "neo4jPoint",
        language: {
            base: 'must be a valid point',
            coordinates: 'must be a valid coordinates point',
            cartesian: 'must be a valid cartesian point',
            is3d: 'must be a valid 3D point',
            is2d: 'must be a valid 2D point',
        },
        pre(value, state, options) {
            if (!neo4j.spatial.isPoint(value) && options.convert && typeof value === 'object') {
                // Detect srid from keys
                if (value.srid === undefined) {
                    if ((value.longitude || value.lon) && (value.latitude || value.lat)) {
                        value.srid = value.height || value.height === 0 ? 4979 : 4326;
                    } else if (value.x && value.y) {
                        value.srid = value.z || value.z === 0 ? 9157 : 7203;
                    }
                } else if(typeof value.srid === 'string') {
                    switch (value.srid.toUpperCase()) {
                        case 'WGS-84':
                            value.srid = 4326;
                            break;
                        case 'WGS-84-3D':;
                            value.srid = 4979;
                            break;
                        case 'CARTESIAN':
                            value.srid = 7203;
                            break;
                        case 'CARTESIAN-3D':
                            value.srid = 9157;
                            break;
                        default:
                            value.srid = undefined;
                    }
                }
                // Normalize coordinates points
                value.x = value.x || value.longitude || value.lon;
                value.y = value.y || value.latitude || value.lat;
                value.z = value.z || value.height;

                try {
                    value = new neo4j.types.Point(value.srid, value.x, value.y, value.z);
                } catch (err) {

                }
            }

            if (!neo4j.spatial.isPoint(value) || (!isCartesian(value) && !isCoordinates(value))) {
                return this.createError("neo4jPoint.base", { value: value }, state, options);
            }

            return value;
        },
        rules: [
            {
                name: 'coordinates',
                validate(params, value, state, options) {
                    if (!isCoordinates(value)) {
                        return this.createError("neo4jPoint.coordinates", { value: value }, state, options);
                    }

                    return value;
                },
            },
            {
                name: 'cartesian',
                validate(params, value, state, options) {
                    if (!isCartesian(value)) {
                        return this.createError("neo4jPoint.cartesian", { value: value }, state, options);
                    }

                    return value;
                },
            },
            {
                name: 'is3d',
                validate(params, value, state, options) {
                    if ((value.srid !== 9157 && value.srid !== 4979) || value.z === undefined) {
                        return this.createError("neo4jPoint.is3d", { value: value }, state, options);
                    }

                    return value;
                },
            },
            {
                name: 'is2d',
                validate(params, value, state, options) {
                    if ((value.srid !== 7203 && value.srid !== 4326) || value.z !== undefined) {
                        return this.createError("neo4jPoint.is2d", { value: value }, state, options);
                    }

                    return value;
                },
            },
        ],
    };
};

const joi4j = require('./index.js');
const joi = require('joi');
const neo4j = require('neo4j-driver').v1;

const validator = joi.extend(joi4j);

describe('neo4jPoint', () => {
    describe('base', () => {
        it('should convert cartesian object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(7203, 200, 100);
            const input = {x: 200, y: 100};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should convert 3D cartesian object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(9157, 200, 100, 30);
            const input = {x: 200, y: 100, z: 30};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should convert coordinates object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(4326, 10, 20);
            const input = {lon: 10, lat: 20};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should convert 3D coordinates object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(4979, 10, 20, 30);
            const input = {lon: 10, lat: 20, height: 30};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should convert "long" coordinates object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(4326, 10, 20);
            const input = {longitude: 10, latitude: 20};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should convert "long" 3D coordinates object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(4979, 10, 20, 30);
            const input = {longitude: 10, latitude: 20, height: 30};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should convert full object to neo4j.Point', async () => {
            const point = new neo4j.types.Point(4979, 10, 20, 30);
            const input = {srid: 4979, x: 10, y: 20, z: 30};
            const result = await validator.validate(input, validator.neo4jPoint());
            expect(neo4j.spatial.isPoint(result)).toBeTruthy();
            expect(result.toString()).toEqual(result.toString());
        });

        it('should fail with invalid srid', async () => {
            expect.assertions(1);
            const input = new neo4j.types.Point(9999, 10, 20, 30);
            try {
                const result = await validator.validate(input, validator.neo4jPoint());
            } catch (error) {
                expect(error.details).toEqual([{
                    message: "\"value\" must be a valid point",
                    path: [],
                    type: 'neo4jPoint.base',
                    context: { label: 'value', value: input, key: undefined }
                }]);
            }
        });

        [{lat: 100, lon: 190}, {lat: -100, lon: -190}].forEach( (point) => {
            it('should fail with invalid coordinates', async () => {
                expect.assertions(1);
                const input = new neo4j.types.Point(4326, point.lon, point.lat);
                try {
                    const result = await validator.validate(input, validator.neo4jPoint());
                } catch (error) {
                    expect(error.details).toEqual([{
                        message: "\"value\" must be a valid point",
                        path: [],
                        type: 'neo4jPoint.base',
                        context: { label: 'value', value: input, key: undefined }
                    }]);
                }
            });

            it('should fail with invalid 3D coordinates', async () => {
                expect.assertions(1);
                const input = new neo4j.types.Point(4979, point.lon, point.lat, 30);
                try {
                    const result = await validator.validate(input, validator.neo4jPoint());
                } catch (error) {
                    expect(error.details).toEqual([{
                        message: "\"value\" must be a valid point",
                        path: [],
                        type: 'neo4jPoint.base',
                        context: { label: 'value', value: input, key: undefined }
                    }]);
                }
            });
        });
    });

    describe('coordinates', () => {
        [4979, 4326].forEach( srid => {
            it("should validate a coordinates Point", async () => {
                const point = new neo4j.types.Point(srid, 10, 20);
                const result = await validator.validate(point, validator.neo4jPoint().coordinates());
                expect(neo4j.spatial.isPoint(result)).toBeTruthy();
                expect(result.toString()).toEqual(result.toString());
            });
        });

        [9157, 7203].forEach( srid => {
            it('should fail with invalid coordinates Point', async () => {
                expect.assertions(1);
                const point = new neo4j.types.Point(srid, 10, 20);
                try {
                    const result = await validator.validate(point, validator.neo4jPoint().coordinates());
                } catch (error) {
                    expect(error.details).toEqual([{
                        message: "\"value\" must be a valid coordinates point",
                        path: [],
                        type: 'neo4jPoint.coordinates',
                        context: { label: 'value', value: point, key: undefined }
                    }]);
                }
            });
        });
    });

    describe('cartesian', () => {
        [9157, 7203].forEach( srid => {
            it("should validate a cartesian Point", async () => {
                const point = new neo4j.types.Point(srid, 10, 20);
                const result = await validator.validate(point, validator.neo4jPoint().cartesian());
                expect(neo4j.spatial.isPoint(result)).toBeTruthy();
                expect(result.toString()).toEqual(result.toString());
            });
        });

        [4979, 4326].forEach( srid => {
            it('should fail with invalid cartesian Point', async () => {
                expect.assertions(1);
                const point = new neo4j.types.Point(srid, 10, 20);
                try {
                    const result = await validator.validate(point, validator.neo4jPoint().cartesian());
                } catch (error) {
                    expect(error.details).toEqual([{
                        message: "\"value\" must be a valid cartesian point",
                        path: [],
                        type: 'neo4jPoint.cartesian',
                        context: { label: 'value', value: point, key: undefined }
                    }]);
                }
            });
        });
    });

    describe('3D', () => {
        [9157, 4979].forEach( srid => {
            it("should validate a 3D Point", async () => {
                const point = new neo4j.types.Point(srid, 10, 20, 30);
                const result = await validator.validate(point, validator.neo4jPoint().is3d());
                expect(neo4j.spatial.isPoint(result)).toBeTruthy();
                expect(result.toString()).toEqual(result.toString());
            });
        });

        [7203, 4326].forEach( srid => {
            it('should fail with invalid 3D Point', async () => {
                expect.assertions(1);
                const point = new neo4j.types.Point(srid, 10, 20, 30);
                try {
                    const result = await validator.validate(point, validator.neo4jPoint().is3d());
                } catch (error) {
                    expect(error.details).toEqual([{
                        message: "\"value\" must be a valid 3D point",
                        path: [],
                        type: 'neo4jPoint.is3d',
                        context: { label: 'value', value: point, key: undefined }
                    }]);
                }
            });
        });
    });

    describe('2D', () => {
        [7203, 4326].forEach( srid => {
            it("should validate a 2D Point", async () => {
                const point = new neo4j.types.Point(srid, 10, 20);
                const result = await validator.validate(point, validator.neo4jPoint().is2d());
                expect(neo4j.spatial.isPoint(result)).toBeTruthy();
                expect(result.toString()).toEqual(result.toString());
            });
        });

        [9157, 4979].forEach( srid => {
            it('should fail with invalid 2D Point', async () => {
                expect.assertions(1);
                const point = new neo4j.types.Point(srid, 10, 20);
                try {
                    const result = await validator.validate(point, validator.neo4jPoint().is2d());
                } catch (error) {
                    expect(error.details).toEqual([{
                        message: "\"value\" must be a valid 2D point",
                        path: [],
                        type: 'neo4jPoint.is2d',
                        context: { label: 'value', value: point, key: undefined }
                    }]);
                }
            });
        });
    });
});

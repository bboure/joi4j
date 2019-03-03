const joi4j = require('./index.js');
const joi = require('joi');
const neo4j = require('neo4j-driver').v1

const validator = joi.extend(joi4j);

describe('neo4jDateTime', () => {
    describe('base', () => {
        it('should convert string to neo4j.DateTime', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            
            const result = await validator.validate(dnow.toString(), validator.neo4jDateTime());
            expect(result).toBeInstanceOf(neo4j.types.DateTime);
            expect(result.toString()).toEqual(dnow.toString());
        });

        it('should convert Js Date to neo4j.DateTime', async () => {
            const now = Date.now();
            const dnow = new Date(now);
            const neoDateTimeNow = neo4j.types.DateTime.fromStandardDate(dnow);
            
            const result = await validator.validate(dnow, validator.neo4jDateTime());
            expect(result).toBeInstanceOf(neo4j.types.DateTime);
            expect(result.toString()).toEqual(neoDateTimeNow.toString());
        });

        it('should accept a Neo4j DateTime', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            
            const result = await validator.validate(dnow, validator.neo4jDateTime());
            expect(result).toBeInstanceOf(neo4j.types.DateTime);
            expect(result).toEqual(dnow);
        });

        it('should throw an error if invalid neo4j.DateTime', async () => {
            expect.assertions(1);
            try {
                await validator.validate('foobar', validator.neo4jDateTime());
            } catch (error) {
                expect(error.details).toEqual([{
                    message: "\"value\" must be a valid DateTime",
                    path: [],
                    type: 'neo4jDateTime.base',
                    context: { label: 'value', value: "foobar", key: undefined }
                }]);
            }
        });
    });

    describe('min', () => {
        it('min should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const same = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
            
            await expect(validator.validate(dnow, validator.neo4jDateTime().min(same))).resolves.toBeTruthy();
            await expect(validator.validate(dnow, validator.neo4jDateTime().min(past))).resolves.toBeTruthy();
        });
        
        it('min should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jDateTime(),
                    'to': validator.neo4jDateTime().min(validator.ref('from')),
                })
            )).resolves.toBeTruthy();
        });

        it('min should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000));
            try {
                await validator.validate(dnow, validator.neo4jDateTime().min(future));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be larger than or equal to "${future}"`,
                    path: [],
                    type: 'neo4jDateTime.min',
                    context: { limit: future, label: 'value', key: undefined, value: dnow },
                }]);
            }
        });

        it('min should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jDateTime(),
                        'to': validator.neo4jDateTime().min(validator.ref('from')),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"to" must be larger than or equal to "${from}"`,
                    path: ['to'],
                    type: 'neo4jDateTime.min',
                    context: { label: 'to', key: 'to', limit: from, value: to },
                }]);
            }
        });
    });
    
    describe('max', () => {
        it('max should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const same = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000));
            
            await expect(validator.validate(dnow, validator.neo4jDateTime().max(same))).resolves.toBeTruthy();
            await expect(validator.validate(dnow, validator.neo4jDateTime().max(future))).resolves.toBeTruthy();
        });

        it('max should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jDateTime().max(validator.ref('to')),
                    'to': validator.neo4jDateTime(),
                })
            )).resolves.toBeTruthy();
        });

        it('max should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
            try {
                await validator.validate(dnow, validator.neo4jDateTime().max(past));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be less than or equal to "${past}"`,
                    path: [],
                    type: 'neo4jDateTime.max',
                    context: { limit: past, label: 'value', key: undefined, value: dnow }
                }]);
            }
        });

        it('max should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jDateTime().max(validator.ref('to')),
                        'to': validator.neo4jDateTime(),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"from" must be less than or equal to "${to}"`,
                    path: ['from'],
                    type: 'neo4jDateTime.max',
                    context: { label: 'from', key: 'from', limit: to, value: from },
                }]);
            }
        });
    });
    
    describe('greater', () => {
        it('greater should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
        
            await expect(validator.validate(dnow, validator.neo4jDateTime().greater(past))).resolves.toBeTruthy();
        });
        
        it('greater should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jDateTime(),
                    'to': validator.neo4jDateTime().greater(validator.ref('from')),
                })
            )).resolves.toBeTruthy();
        });

        it('greater should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            try {
                await validator.validate(dnow, validator.neo4jDateTime().greater(future));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be larger than "${future}"`,
                    path: [],
                    type: 'neo4jDateTime.greater',
                    context: { limit: future, label: 'value', key: undefined, value: dnow },
                }]);
            }
        });

        it('greater should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jDateTime(),
                        'to': validator.neo4jDateTime().greater(validator.ref('from')),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"to" must be larger than "${from}"`,
                    path: ['to'],
                    type: 'neo4jDateTime.greater',
                    context: { label: 'to', key: 'to', limit: from, value: to },
                }]);
            }
        });
    });
    
    describe('less', () => {
        it('less should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            
            await expect(validator.validate(dnow, validator.neo4jDateTime().less(future))).resolves.toBeTruthy();
        });

        it('less should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.DateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jDateTime().less(validator.ref('to')),
                    'to': validator.neo4jDateTime(),
                })
            )).resolves.toBeTruthy();
        });

        it('less should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
            try {
                await validator.validate(dnow, validator.neo4jDateTime().less(past));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be less than "${past}"`,
                    path: [],
                    type: 'neo4jDateTime.less',
                    context: { limit: past, label: 'value', key: undefined, value: dnow }
                }]);
            }
        });

        it('less should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.DateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.DateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jDateTime().less(validator.ref('to')),
                        'to': validator.neo4jDateTime(),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"from" must be less than "${to}"`,
                    path: ['from'],
                    type: 'neo4jDateTime.less',
                    context: { label: 'from', key: 'from', limit: to, value: from },
                }]);
            }
        });
    });
});

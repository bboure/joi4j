const joi4j = require('./index.js');
const joi = require('joi');
const neo4j = require('neo4j-driver').v1

const validator = joi.extend(joi4j);

describe('neo4jLocalDateTime', () => {
    describe('base', () => {
        it('should convert string to neo4j.LocalDateTime', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));

            const result = await validator.validate(dnow.toString(), validator.neo4jLocalDateTime());
            expect(result).toBeInstanceOf(neo4j.types.LocalDateTime);
            expect(result.toString()).toEqual(dnow.toString());
        });

        it('should convert Js Date to neo4j.LocalDateTime', async () => {
            const now = Date.now();
            const dnow = new Date(now);
            const neoLocalDateTimeNow = neo4j.types.LocalDateTime.fromStandardDate(dnow);

            const result = await validator.validate(dnow, validator.neo4jLocalDateTime());
            expect(result).toBeInstanceOf(neo4j.types.LocalDateTime);
            expect(result.toString()).toEqual(neoLocalDateTimeNow.toString());
        });

        it('should accept a Neo4j LocalDateTime', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));

            const result = await validator.validate(dnow, validator.neo4jLocalDateTime());
            expect(result).toBeInstanceOf(neo4j.types.LocalDateTime);
            expect(result).toEqual(dnow);
        });

        it('should throw an error if invalid neo4j.LocalDateTime', async () => {
            expect.assertions(1);
            try {
                await validator.validate('foobar', validator.neo4jLocalDateTime());
            } catch (error) {
                expect(error.details).toEqual([{
                    message: "\"value\" must be a valid LocalDateTime",
                    path: [],
                    type: 'neo4jLocalDateTime.base',
                    context: { label: 'value', value: "foobar", key: undefined }
                }]);
            }
        });

        it('should be able to be opitonal', async () => {
            await expect(validator.validate(
                {},
                validator.object().keys({
                    date: validator.neo4jLocalDateTime(),
                })
            )).resolves.toBeTruthy();
        });
    });

    describe('min', () => {
        it('min should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const same = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000));

            await expect(validator.validate(dnow, validator.neo4jLocalDateTime().min(same))).resolves.toBeTruthy();
            await expect(validator.validate(dnow, validator.neo4jLocalDateTime().min(past))).resolves.toBeTruthy();
        });

        it('min should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jLocalDateTime(),
                    'to': validator.neo4jLocalDateTime().min(validator.ref('from')),
                })
            )).resolves.toBeTruthy();
        });

        it('min should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000));
            try {
                await validator.validate(dnow, validator.neo4jLocalDateTime().min(future));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be larger than or equal to "${future}"`,
                    path: [],
                    type: 'neo4jLocalDateTime.min',
                    context: { limit: future, label: 'value', key: undefined, value: dnow },
                }]);
            }
        });

        it('min should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jLocalDateTime(),
                        'to': validator.neo4jLocalDateTime().min(validator.ref('from')),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"to" must be larger than or equal to "${from}"`,
                    path: ['to'],
                    type: 'neo4jLocalDateTime.min',
                    context: { label: 'to', key: 'to', limit: from, value: to },
                }]);
            }
        });
    });

    describe('max', () => {
        it('max should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const same = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000));

            await expect(validator.validate(dnow, validator.neo4jLocalDateTime().max(same))).resolves.toBeTruthy();
            await expect(validator.validate(dnow, validator.neo4jLocalDateTime().max(future))).resolves.toBeTruthy();
        });

        it('max should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const same = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jLocalDateTime().max(validator.ref('to')),
                    'to': validator.neo4jLocalDateTime(),
                })
            )).resolves.toBeTruthy();
        });

        it('max should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000));
            try {
                await validator.validate(dnow, validator.neo4jLocalDateTime().max(past));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be less than or equal to "${past}"`,
                    path: [],
                    type: 'neo4jLocalDateTime.max',
                    context: { limit: past, label: 'value', key: undefined, value: dnow }
                }]);
            }
        });

        it('max should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jLocalDateTime().max(validator.ref('to')),
                        'to': validator.neo4jLocalDateTime(),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"from" must be less than or equal to "${to}"`,
                    path: ['from'],
                    type: 'neo4jLocalDateTime.max',
                    context: { label: 'from', key: 'from', limit: to, value: from },
                }]);
            }
        });
    });

    describe('greater', () => {
        it('greater should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));

            await expect(validator.validate(dnow, validator.neo4jLocalDateTime().greater(past))).resolves.toBeTruthy();
        });

        it('greater should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jLocalDateTime(),
                    'to': validator.neo4jLocalDateTime().greater(validator.ref('from')),
                })
            )).resolves.toBeTruthy();
        });

        it('greater should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            try {
                await validator.validate(dnow, validator.neo4jLocalDateTime().greater(future));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be larger than "${future}"`,
                    path: [],
                    type: 'neo4jLocalDateTime.greater',
                    context: { limit: future, label: 'value', key: undefined, value: dnow },
                }]);
            }
        });

        it('greater should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jLocalDateTime(),
                        'to': validator.neo4jLocalDateTime().greater(validator.ref('from')),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"to" must be larger than "${from}"`,
                    path: ['to'],
                    type: 'neo4jLocalDateTime.greater',
                    context: { label: 'to', key: 'to', limit: from, value: to },
                }]);
            }
        });
    });

    describe('less', () => {
        it('less should work by value', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));

            await expect(validator.validate(dnow, validator.neo4jLocalDateTime().less(future))).resolves.toBeTruthy();
        });

        it('less should work by reference', async () => {
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const future = neo4j.types.LocalDateTime.fromStandardDate(new Date(now + 1000 * 3600 * 24));
            await expect(validator.validate(
                {
                  'from': dnow,
                  'to': future,
                },
                validator.object().keys({
                    'from': validator.neo4jLocalDateTime().less(validator.ref('to')),
                    'to': validator.neo4jLocalDateTime(),
                })
            )).resolves.toBeTruthy();
        });

        it('less should throw an error by value', async () => {
            expect.assertions(1);
            const now = Date.now();
            const dnow = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const past = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
            try {
                await validator.validate(dnow, validator.neo4jLocalDateTime().less(past));
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"value" must be less than "${past}"`,
                    path: [],
                    type: 'neo4jLocalDateTime.less',
                    context: { limit: past, label: 'value', key: undefined, value: dnow }
                }]);
            }
        });

        it('less should throw an error by reference', async () => {
            expect.assertions(1);
            const now = Date.now();
            const from = neo4j.types.LocalDateTime.fromStandardDate(new Date(now));
            const to = neo4j.types.LocalDateTime.fromStandardDate(new Date(now - 1000 * 3600 * 24));
            try {
                await validator.validate(
                    {
                        'from': from,
                        'to': to,
                    },
                    validator.object().keys({
                        'from': validator.neo4jLocalDateTime().less(validator.ref('to')),
                        'to': validator.neo4jLocalDateTime(),
                    })
                );
            } catch (error) {
                expect(error.details).toEqual([{
                    message: `"from" must be less than "${to}"`,
                    path: ['from'],
                    type: 'neo4jLocalDateTime.less',
                    context: { label: 'from', key: 'from', limit: to, value: from },
                }]);
            }
        });
    });
});

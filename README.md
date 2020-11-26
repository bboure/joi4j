This plugin for [Joi](https://github.com/hapijs/joi/) adds validation for Neo4j (Cypher) types that are not mapped to native javascript, as explained [here](https://neo4j.com/docs/driver-manual/current/cypher-values)

# Supported types

| Type          | Supported          |
| ------------- | ------------------ |
| Date          | :white_check_mark: |
| Time          | :x:                |
| LocalTime     | :x:                |
| DateTime      | :white_check_mark: |
| LocalDateTime | :white_check_mark: |
| Duration      | :x:                |
| Point         | :white_check_mark: |

# Requirements/Compatibility

| Package      | version |
| ------------ | ------- |
| neo4j-driver | >=4.0.0 |
| joi          | >=17    |

# Install

```bash
yarn add joi4j
# or
npm install joi4j
```

# Usage

```javascript
// import necessary validators and extend Joi
const { neo4jDate, neo4jDateTime } = require('joi4j');
const Joi = require('joi').extend(neo4jDate, neo4jDateTime);

try {
  const schema = Joi.neo4jDate();
  const date = await schema.validateAsync("2019-12-08");
  // date is a neo4j.types.Date
} catch (error) {
  ...
}
```

## With typescript

The library exports a type to help you extend Joi and benefit from ts autocomplete:

```ts
import BaseJoi, { Root } from 'joi';
import { Joi4j, neo4jPoint, neo4jDate } = require('joi4j');
const Joi: Root & Joi4j = BaseJoi.extend(neo4jPoint, neo4jDate);
```

# Available validators

## `neo4jDate` - inherits from `any`

Validates that the input is a correct [Neo4j Date](https://github.com/neo4j/neo4j-javascript-driver/blob/1.7/src/v1/temporal-types.js#L192) instance. If the `convert` preference is `true` (enabled by default), a string or native javascript `Date` object will be converted to a Neo4j Date.

```js
const schema = Joi.neo4jDate();
await schema.validateAsync('2019-12-08');
```

### `neo4jDate.min(date)`

Specifies the value must be greater than or equal to `date`.

### `neo4jDate.max(date)`

Specifies the value must be less than or equal to `date`.

### `neo4jDate.greater(date)`

Specifies the value must be greater than `date`.

### `neo4jDate.less(date)`

Specifies the value must be less than `date`.

## `neo4jDateTime` - inherits from `any`

Validates that the input is a correct [Neo4j DateTime](https://github.com/neo4j/neo4j-javascript-driver/blob/1.7/src/v1/temporal-types.js#L305) instance. If the `convert` preference is `true` (enabled by default), a string or native javascript `Date`. object will be converted to a Neo4j DateTime.

```js
const schema = Joi.neo4jDateTime();
await schema.validateAsync('2019-12-08T13:59:18+02:00');
```

### `neo4jDateTime.min(date)`

Specifies the value must be greater than or equal to `date`.

### `neo4jDateTime.max(date)`

Specifies the value must be less than or equal to `date`.

### `neo4jDateTime.greater(date)`

Specifies the value must be greater than `date`.

### `neo4jDateTime.less(date)`

Specifies the value must be less than `date`.

## `neo4jLocalDateTime` - inherits from `any`

Validates that the input is a correct [Neo4j LocalDateTime](https://github.com/neo4j/neo4j-javascript-driver/blob/1.7/src/v1/temporal-types.js#L242) instance. If the `convert` preference is `true` (enabled by default), a string or native javascript `Date`. object will be converted to a Neo4j LocalDateTime.

```js
const schema = Joi.neo4jLocalDateTime();
await schema.validateAsync('2019-12-08T13:59:18+02:00');
```

### `neo4jLocalDateTime.min(date)`

Specifies the value must be greater than or equal to `date`.

### `neo4jLocalDateTime.max(date)`

Specifies the value must be less than or equal to `date`.

### `neo4jLocalDateTime.greater(date)`

Specifies the value must be greater than `date`.

### `neo4jLocalDateTime.less(date)`

Specifies the value must be less than `date`.

## `neo4jPoint` - inherits from `any`

Validates that the input is a correct [Neo4j Point](https://neo4j.com/docs/cypher-manual/current/syntax/spatial/).
If the `convert` preference is `true` (enabled by default), a key-value pair object will be converted to a Neo4j Point if specified. If not provided, the srid will be assumed from the keys.

```js
const schema = Joi.neo4jPoint();
await schema.validateAsync({ lon: 2.154007, lat: 41.390205 });
```

#### `neo4jPoint.coordinates()`

Validates that the point is a correct coordinates point `(latitude, longitude [, height])`

#### `neo4jPoint.cartesian()`

Validates that the point is a correct coordinates point `(x, y [, z])`.

#### `neo4jPoint.is2d()`

Validates that the point is a correct 2D point (no height or z is given).

#### `neo4jPoint.is3d()`

Validates that the point is a correct 2D point (either height or z is given).

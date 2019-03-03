# Supported types

| Type | Supported |
| -----| ----------|
| Date | :white_check_mark: |
| Time | :x: |
| LocalTime | :x: |
| DateTime | :white_check_mark: |
| LocalDateTime | :white_check_mark: |
| Duration | :x: |
| Point | :x: |

# How to use

````javascript
const validator = joi.extend(joi4j);

validator.validate(
    "2019-01-01",
    validator.neo4jDate(),
    function (error, data) {
        
    }
);
````

# Api Reference
## `neo4jDate` - inherits from `Any`
Validates that the input is a correct [Neo4j Date](https://github.com/neo4j/neo4j-javascript-driver/blob/1.7/src/v1/temporal-types.js#L192) instance. If the validation `convert` option is on (enabled by default), a string or native javascript `Date` object will be converted to a Neo4j Date if specified.

[Date](https://github.com/hapijs/joi/blob/master/API.md#datemindate)'s `min`, `max`, `greater` and `less` are also available.

## `neo4jDateTime` - inherits from `Any`
Validates that the input is a correct [Neo4j DateTime](https://github.com/neo4j/neo4j-javascript-driver/blob/1.7/src/v1/temporal-types.js#L305) instance. If the validation `convert` option is on (enabled by default), a string or native javascript `Date` object will be converted to a Neo4j DateTime if specified.

[Date](https://github.com/hapijs/joi/blob/master/API.md#datemindate)'s `min`, `max`, `greater` and `less` are also available.

## `neo4jLocalDateTime` - inherits from `Any`
Validates that the input is a correct [Neo4j LocalDateTime](https://github.com/neo4j/neo4j-javascript-driver/blob/1.7/src/v1/temporal-types.js#L242) instance. If the validation `convert` option is on (enabled by default), a string or native javascript `Date` object will be converted to a Neo4j LocalDateTime if specified.

[Date](https://github.com/hapijs/joi/blob/master/API.md#datemindate)'s `min`, `max`, `greater` and `less` are also available.
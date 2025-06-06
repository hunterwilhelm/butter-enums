"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTupleWithIndex = exports.mapTuple = void 0;
exports.ButterTupleEnum = ButterTupleEnum;
exports.ButterKeyedEnum = ButterKeyedEnum;
/**
 * Butter Enums
 *
 * Smooth like butter
 */
const deep_freeze_es6_1 = __importDefault(require("deep-freeze-es6"));
const mapTuple_1 = require("./mapTuple");
/**
 * Butter Tuple Enum
 *
 * Tuple enums are enums that are created with a tuple of strings.
 * They can therefore have type safety when converting back and forth between enums and tuples.
 *
 * E.g.
 *
 * ```typescript
 * const test = ButterTupleEnum(['blue', 'green', 'red'])
 *
 * test.enum.blue // 'blue'
 * test.get(0) // 'blue'
 * test.length // 3
 * test.tuple // ['blue', 'green', 'red']
 *
 * @template T The tuple of strings
 * @param tuple The tuple of strings to create an enum from
 * @returns The tuple enum object with helper methods
 */
function ButterTupleEnum(tuple) {
    const $tuple = tuple;
    const $enum = Object.fromEntries(tuple.map(value => [value, value]));
    return {
        /**
         * The tuple of strings
         *
         * @type {T} The tuple of strings
         */
        tuple: (0, deep_freeze_es6_1.default)($tuple),
        /**
         * The enum object
         *
         * @type {{ [key in T[number]]: key; }} The enum object
         */
        enum: (0, deep_freeze_es6_1.default)($enum),
        /**
         * Gets a value by index
         *
         * @param index The index of the tuple element to retrieve
         * @returns {string | undefined} The value at the given index or undefined if index is out of bounds
         */
        get(index) {
            return $tuple[index];
        },
        /**
         * Gets multiple values by indices
         *
         * @param indices An array of indices to retrieve values for
         * @returns {(string | undefined)[]} The values at the given indices, undefined for any out of bounds indices
         */
        getMany(indices) {
            return indices.map(index => $tuple[index]);
        },
        /**
         * The length of the tuple
         *
         * @returns {number} The length of the tuple
         */
        get length() {
            return $tuple.length;
        }
    };
}
/**
 * Butter Keyed Enum
 *
 * Keyed enums are enums that are created with an object of objects.
 * They can therefore have type safety when converting back and forth between enums and objects.
 *
 * E.g.
 *
 * ```typescript
 * const colorsEnum = ButterKeyedEnum({
 *   green: {
 *     emoji: '🟩',
 *     hex: '#00FF00',
 *   },
 * })
 *
 * colorsEnum.enum.green.emoji // '🟩'
 * colorsEnum.enum.green.key // 'green'
 * colorsEnum.get('green') // { emoji: '🟩', hex: '#00FF00', key: 'green' }
 * colorsEnum.keys // ['green']
 * ```
 *
 * @template KeyName - The name of the property to hoist the key into. Defaults to `"key"`.
 * @template T - The original enum-like object whose keys should not conflict with `keyName` in inner objects.
 * @template TTuple - The tuple of values derived from `T` that will represent the enum values.
 * @template TResult - The final result tuple validated against the keys of `T`.
 *
 * @param {T} enumObject - The original object representing the enum-like mapping.
 * @param {Object} options - Configuration options.
 * @param {KeyName} [options.keyName="key"] - The name of the key to inject into each value.
 * @param {(enumObject: Readonly<HoistKeyToInner<T, KeyName>>) => TResult} options.tupleFactory - A factory function
 *   that takes the modified enum object with keys hoisted and returns a tuple. It must include all keys from `enumObject`.
 *
 *   This is required because typescript cannot convert from a union to a tuple with
 *   * Guaranteed order
 *   * Better performance than O(n^2)
 *   See https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type
 *
 *   So, we have to provide a tuple factory. It constrains the tuple to make sure you're not missing any values.
 *   Making our typescript compiler happy.
 *
 * @returns {void} This function does not return anything directly, but can be used to enforce compile-time constraints
 *   and build strongly typed enums using TypeScript's type system.
 *
 * @throws {TypeError} If any object in `enumObject` already contains the `keyName` property, it will result in a type error.
 * @throws {Error} If the `tupleFactory` does not return a tuple that includes all keys, a compile-time type error will occur.
 */
function ButterKeyedEnum(enumObject, options) {
    const $enum = (0, deep_freeze_es6_1.default)(Object.fromEntries(Object.entries(enumObject)
        .map(([key, value]) => [key, { ...value, [options?.keyName ?? "key"]: key }])));
    const $tuple = (0, deep_freeze_es6_1.default)(options.tupleFactory($enum));
    function getMany(keys) {
        return keys.map(key => $enum[key]);
    }
    return {
        /**
         * The enum object
         *
         * @type {Readonly<TEnum>} The enum object with keys hoisted into each value
         */
        enum: $enum,
        /**
         * An ordered array of enum values as specified by the tupleFactory function
         *
         * @type {TTuple} The tuple of enum values in the order defined by tupleFactory
         */
        tuple: $tuple,
        mapTuple: (fn) => (0, mapTuple_1.mapTuple)($tuple, fn),
        /**
         * Gets a value by key
         *
         * @param key The key to retrieve the value for
         * @returns {TEnum[keyof TEnum] | undefined} The value for the given key or undefined if the key doesn't exist
         */
        get(key) {
            return $enum[key];
        },
        getMany,
        /**
         * All keys in the enum
         *
         * @returns {(keyof TEnum)[]} All keys in the enum
         */
        get keys() {
            return Object.keys($enum);
        },
        /**
         * All values in the enum
         *
         * @returns {TEnum[keyof TEnum][]} All values in the enum
         */
        get values() {
            return Object.values($enum);
        },
        /**
         * Finds a value by predicate
         *
         * @param predicate A function that tests each value for a condition
         * @returns {TEnum[keyof TEnum] | undefined} The first value that matches the predicate or undefined if no match is found
         */
        find(predicate) {
            return Object.values($enum).find((value, key) => predicate(value, key, $enum));
        }
    };
}
// Export mapTuple functions
var mapTuple_2 = require("./mapTuple");
Object.defineProperty(exports, "mapTuple", { enumerable: true, get: function () { return mapTuple_2.mapTuple; } });
Object.defineProperty(exports, "mapTupleWithIndex", { enumerable: true, get: function () { return mapTuple_2.mapTupleWithIndex; } });

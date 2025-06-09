"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButterTupleEnum = ButterTupleEnum;
const deep_freeze_es6_1 = __importDefault(require("deep-freeze-es6"));
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
    const $tuple = (0, deep_freeze_es6_1.default)(tuple);
    const $enum = Object.fromEntries(tuple.map(value => [value, value]));
    return {
        /**
         * The tuple of strings
         *
         * @type {T} The tuple of strings
         */
        tuple: $tuple,
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

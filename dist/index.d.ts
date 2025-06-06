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
export declare function ButterTupleEnum<const T extends readonly string[]>(tuple: T): {
    /**
     * The tuple of strings
     *
     * @type {T} The tuple of strings
     */
    tuple: T;
    /**
     * The enum object
     *
     * @type {{ [key in T[number]]: key; }} The enum object
     */
    enum: { [key in T[number]]: key; };
    /**
     * Gets a value by index
     *
     * @param index The index of the tuple element to retrieve
     * @returns {string | undefined} The value at the given index or undefined if index is out of bounds
     */
    get(index: number): string | undefined;
    /**
     * Gets multiple values by indices
     *
     * @param indices An array of indices to retrieve values for
     * @returns {(string | undefined)[]} The values at the given indices, undefined for any out of bounds indices
     */
    getMany(indices: number[]): (string | undefined)[];
    /**
     * The length of the tuple
     *
     * @returns {number} The length of the tuple
     */
    readonly length: number;
};
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
export declare function ButterKeyedEnum<KeyName extends string = "key", const T extends {
    [K in keyof T]: KeyName extends keyof T[K] ? never : Record<string, any>;
} = {
    [key: string]: any;
}, TTuple extends [T[keyof T], ...T[keyof T][]] = [T[keyof T], ...T[keyof T][]], TResult extends [T[keyof T], ...T[keyof T][]] = TTuple>(enumObject: T, options: {
    keyName?: KeyName;
    /**
     * A factory function that takes the modified enum object with keys hoisted and returns a tuple.
     * It must include all keys from `enumObject`.
     *
     * @param enumObject The enum object with keys hoisted into each value
     * @returns A tuple of values from the enum object
     *
     * This is required because typescript cannot convert from a union to a tuple with
     * * Guaranteed order
     * * Better performance than O(n^2)
     * See https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type
     *
     * So, we have to provide a tuple factory. It constrains the tuple to make sure you're not missing any values.
     * Making our typescript compiler happy.
     */
    tupleFactory: (enumObject: Readonly<HoistKeyToInner<T, KeyName>>) => IsTypeEqual<TResult[number][KeyName], keyof T> extends true ? TResult : {
        error: "You must include all keys in the tuple";
        value: never;
    };
}): {
    /**
     * The enum object
     *
     * @type {Readonly<TEnum>} The enum object with keys hoisted into each value
     */
    readonly enum: Readonly<HoistKeyToInner<T, KeyName>>;
    /**
     * An ordered array of enum values as specified by the tupleFactory function
     *
     * @type {TTuple} The tuple of enum values in the order defined by tupleFactory
     */
    readonly tuple: IsTypeEqual<TResult[number][KeyName], keyof T> extends true ? TResult : {
        error: "You must include all keys in the tuple";
        value: never;
    };
    /**
     * Gets a value by key
     *
     * @param key The key to retrieve the value for
     * @returns {TEnum[keyof TEnum] | undefined} The value for the given key or undefined if the key doesn't exist
     */
    readonly get: (key: keyof T | (string & {})) => Readonly<HoistKeyToInner<T, KeyName>>[keyof T] | undefined;
    readonly getMany: {
        (keys: (keyof T)[]): Readonly<HoistKeyToInner<T, KeyName>>[keyof T][];
        (keys: string[]): (Readonly<HoistKeyToInner<T, KeyName>>[keyof T] | undefined)[];
    };
    /**
     * All keys in the enum
     *
     * @returns {(keyof TEnum)[]} All keys in the enum
     */
    readonly keys: (keyof T)[];
    /**
     * All values in the enum
     *
     * @returns {TEnum[keyof TEnum][]} All values in the enum
     */
    readonly values: Readonly<HoistKeyToInner<T, KeyName>>[keyof T][];
    /**
     * Finds a value by predicate
     *
     * @param predicate A function that tests each value for a condition
     * @returns {TEnum[keyof TEnum] | undefined} The first value that matches the predicate or undefined if no match is found
     */
    readonly find: (predicate: (value: Readonly<HoistKeyToInner<T, KeyName>>[keyof T], key: keyof T, enumObject: Readonly<HoistKeyToInner<T, KeyName>>) => boolean) => Readonly<HoistKeyToInner<T, KeyName>>[keyof T] | undefined;
};
/**
 * Utility type that hoists the key name into each value object
 *
 * This type takes an object of objects and adds the key of the outer object as a 'key' property
 * to each inner object, while preserving all other properties of the inner objects.
 *
 * @template T The input object type with nested objects as values
 * @returns A type with the same structure but with keys hoisted into each value
 */
type HoistKeyToInner<T, KeyName extends string = "key"> = {
    [K in keyof T]: {
        [P in keyof T[K] as P extends KeyName ? never : P]: T[K][P];
    } extends infer O ? {
        [P in keyof O | KeyName]: P extends keyof O ? O[P] : K;
    } : never;
};
/**
 * Utility type that checks if two types are equal
 */
type IsTypeEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;
export {};

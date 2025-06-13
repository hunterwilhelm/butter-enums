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
     * Same as tuple, but the type is an unordered union
     *
     * @type {T[number][]} The keys of the tuple
     */
    keys: T[number][];
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

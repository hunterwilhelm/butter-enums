import deepFreeze from "deep-freeze-es6"

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
export function ButterTupleEnum<const T extends readonly string[]>(tuple: T) {
  const $tuple = deepFreeze(tuple)
  const $enum = Object.fromEntries(tuple.map(value => [value, value])) satisfies {
    [key: string]: string
  } as { [key in T[number]]: key }

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
    enum: deepFreeze($enum),
    /**
     * Gets a value by index
     *
     * @param index The index of the tuple element to retrieve
     * @returns {string | undefined} The value at the given index or undefined if index is out of bounds
     */
    get(index: number): string | undefined {
      return $tuple[index]
    },
    /**
     * Gets multiple values by indices
     *
     * @param indices An array of indices to retrieve values for
     * @returns {(string | undefined)[]} The values at the given indices, undefined for any out of bounds indices
     */
    getMany(indices: number[]): (string | undefined)[] {
      return indices.map(index => $tuple[index])
    },
    /**
     * The length of the tuple
     *
     * @returns {number} The length of the tuple
     */
    get length(): number {
      return $tuple.length
    }
  }
}

/**
 * Butter Enums
 *
 * Smooth like butter
 */
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
  const $tuple = tuple
  const $enum = Object.fromEntries(tuple.map(value => [value, value])) satisfies {
    [key: string]: string
  } as { [key in T[number]]: key }

  return {
    /**
     * The tuple of strings
     *
     * @type {T} The tuple of strings
     */
    tuple: deepFreeze($tuple),
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
 * @template TEnum The object type containing enum entries
 * @returns The keyed enum object with helper methods
 */
export function ButterKeyedEnum<const T extends { [key: string]: { key?: never, [key: string]: any } }>(enumObject: T) {
  const $enum = deepFreeze(Object.fromEntries(Object.entries(enumObject)
    .map(([key, value]) => [key, { ...value, key }])
  )) satisfies { [k: string]: { key: string } } as Readonly<HoistKeyToInner<T>>

  /**
   * Gets multiple values by keys
   *
   * @param keys An array of keys to retrieve values for
   * @returns {TEnum[keyof TEnum][] | (TEnum[keyof TEnum] | undefined)[]} The values for the given keys, undefined for any keys not in the enum
   */
  function getMany(keys: (keyof TEnum)[]): TEnum[keyof TEnum][];
  function getMany(keys: string[]): (TEnum[keyof TEnum] | undefined)[];
  function getMany(keys: (keyof TEnum | (string & {}))[]) {
      return keys.map(key => $enum[key])
  }


  type TEnum = typeof $enum
  return {
    /**
     * The enum object
     * 
     * @type {Readonly<TEnum>} The enum object with keys hoisted into each value
     */
    enum: $enum,
    /**
     * Gets a value by key
     *
     * @param key The key to retrieve the value for
     * @returns {TEnum[keyof TEnum] | undefined} The value for the given key or undefined if the key doesn't exist
     */
    get(key: keyof TEnum | (string & {})): TEnum[keyof TEnum] | undefined {
      return $enum[key]
    },
    getMany,
    /**
     * All keys in the enum
     *
     * @returns {(keyof TEnum)[]} All keys in the enum
     */
    get keys(): (keyof TEnum)[] {
      return Object.keys($enum)
    },
    /**
     * All values in the enum
     *
     * @returns {TEnum[keyof TEnum][]} All values in the enum
     */
    get values(): TEnum[keyof TEnum][] {
      return Object.values($enum)
    },
    /**
     * Finds a value by predicate
     *
     * @param predicate A function that tests each value for a condition
     * @returns {TEnum[keyof TEnum] | undefined} The first value that matches the predicate or undefined if no match is found
     */
    find(predicate: (value: TEnum[keyof TEnum], key: keyof TEnum, enumObject: TEnum) => boolean): TEnum[keyof TEnum] | undefined {
      return Object.values($enum).find((value, key) => predicate(value, key, $enum))
    }
  } as const
}

/**
 * Utility type that hoists the key name into each value object
 * 
 * This type takes an object of objects and adds the key of the outer object as a 'key' property
 * to each inner object, while preserving all other properties of the inner objects.
 * 
 * @template T The input object type with nested objects as values
 * @returns A type with the same structure but with keys hoisted into each value
 */
type HoistKeyToInner<T> = {
  [K in keyof T]: {
    [P in keyof T[K] as P extends "key" ? never : P]: T[K][P];
  } extends infer O
    ? { [P in keyof O | "key"]: P extends keyof O ? O[P] : K }
    : never;
}

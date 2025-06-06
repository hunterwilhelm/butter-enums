import deepFreeze from "deep-freeze-es6"
import { mapTuple } from "./mapTuple"

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
export function ButterKeyedEnum<
KeyName extends string = "key",
const T extends {
  [K in keyof T]: KeyName extends keyof T[K] ? never : Record<string, any>
} = {
  [key: string]: any
},
TTuple extends [T[keyof T], ...T[keyof T][]] = [T[keyof T], ...T[keyof T][]],
TResult extends [T[keyof T], ...T[keyof T][]] = TTuple, 
>(
  enumObject: T,
  options: { 
    keyName?: KeyName, 
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
    tupleFactory: (enumObject: Readonly<HoistKeyToInner<T, KeyName>>) => IsTypeEqual<TResult[number][KeyName], keyof T> extends true
    ? TResult
    : { error: "You must include all keys in the tuple", value: never } }
) {
  const $enum = deepFreeze(Object.fromEntries(Object.entries(enumObject)
    .map(([key, value]: [string, any]) => [key, { ...value as Record<string, any>, [options?.keyName ?? "key"]: key }])
  )) satisfies {
    [k: string]: {
      [k: string]: any
    }
  } as Readonly<HoistKeyToInner<T, KeyName>>
  const $tuple = deepFreeze(options.tupleFactory($enum) as unknown as TTuple)

  /**
   * Gets multiple values by keys
   *
   * @param keys An array of keys to retrieve values for
   * @returns {TEnum[keyof TEnum][] | (TEnum[keyof TEnum] | undefined)[]} The values for the given keys, undefined for any keys not in the enum
   */
  function getMany(keys: (keyof TEnum)[]): TEnum[keyof TEnum][];
  function getMany(keys: string[]): (TEnum[keyof TEnum] | undefined)[];
  function getMany(keys: (keyof TEnum | (string & {}))[]) {
      return keys.map(key => $enum[key as keyof TEnum])
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
     * An ordered array of enum values as specified by the tupleFactory function
     * 
     * @type {TTuple} The tuple of enum values in the order defined by tupleFactory
     */
    tuple: $tuple,
    mapTuple: (fn: (value: TTuple[number], index: number, array: typeof $tuple) => any) => mapTuple($tuple, fn),
    /**
     * Gets a value by key
     *
     * @param key The key to retrieve the value for
     * @returns {TEnum[keyof TEnum] | undefined} The value for the given key or undefined if the key doesn't exist
     */
    get(key: keyof TEnum | (string & {})): TEnum[keyof TEnum] | undefined {
      return $enum[key as keyof TEnum]
    },
    getMany,
    /**
     * All keys in the enum
     *
     * @returns {(keyof TEnum)[]} All keys in the enum
     */
    get keys(): (keyof TEnum)[] {
      return Object.keys($enum) satisfies string[] as (keyof TEnum)[]
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
      return Object.values($enum).find((value: any, key: any) => predicate(value, key, $enum)) as any
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
type HoistKeyToInner<T, KeyName extends string = "key"> = {
  [K in keyof T]: {
    [P in keyof T[K] as P extends KeyName ? never : P]: T[K][P];
  } extends infer O
    ? { [P in keyof O | KeyName]: P extends keyof O ? O[P] : K }
    : never;
}

/**
 * Utility type that checks if two types are equal
 */
type IsTypeEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;

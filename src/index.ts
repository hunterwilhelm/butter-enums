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
 * This can be extremely useful when working with drizzle.
 */
export function ButterTupleEnum<const T extends readonly string[]>(tuple: T) {
  const _tuple = tuple
  const _enum: { [key in T[number]]: key } = Object.fromEntries(tuple.map(value => [value, value])) as { [key in T[number]]: key }

  return {
    tuple: deepFreeze(_tuple),
    enum: deepFreeze(_enum),
    get(index: number) {
      return _tuple[index]
    },
    get length() {
      return _tuple.length
    },
    toSerializable() {
      return _tuple
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
 * const test = ButterKeyedEnum({
 *   test: {
 *     name: 'Test',
 *     description: 'Test',
 *   },
 * })
 *
 * test.enum.test.key
 * test.get('test')
 * test.keys
 * ```
 */
export function ButterKeyedEnum<const T extends { [key: string]: { key?: never, [key: string]: any } }>(enumObject: T) {
  const $enum = deepFreeze(Object.fromEntries(Object.entries(enumObject)
    .map(([key, value]) => [key, { ...value, key }])
  )) as {
    [K in keyof T]: {
      [P in keyof T[K] as P extends "key" ? never : P]: T[K][P];
    } extends infer O
      ? { [P in keyof O | "key"]: P extends keyof O ? O[P] : K }
      : never;
  };


  type TEnum = typeof $enum
  return {
    enum: $enum as TEnum,
    get(key: keyof TEnum | (string & {})): TEnum[keyof TEnum] | undefined {
      return $enum[key]
    },
    getAll(keys: (keyof TEnum | (string & {}))[]): TEnum[keyof TEnum][] {
      return keys.map(key => $enum[key])
    },
    get keys() {
      return Object.keys($enum) as (keyof TEnum)[]
    },
    get values(): TEnum[keyof TEnum][] {
      return Object.values($enum)
    },
    find(predicate: (value: TEnum[keyof TEnum], key: keyof TEnum, enumObject: TEnum) => boolean): TEnum[keyof TEnum] | undefined {
      return Object.values($enum).find((value, key) => predicate(value, key, $enum))
    }
  } as const
}



/**
 * Maps over a tuple and preserves its structure, returning a new tuple of the same length
 * with transformed values.
 * 
 * @template T - The tuple type (readonly array)
 * @template U - The return type of the mapping function
 * @param {T} tuple - The input tuple to map over
 * @param {(value: T[number], index: number, array: readonly T[number][]) => U} fn - The mapping function
 * @returns {[...{ [K in keyof T]: U }]} - A new tuple with the same structure but mapped values
 * 
 * @example
 * const myTuple = [1, 2] as const;
 * const mappedTuple = mapTuple(myTuple, () => null); // Type: [null, null]
 */
export function mapTuple<T extends readonly unknown[], U>(
  tuple: T, 
  fn: (value: T[number], index: number, array: T) => U
): { [K in keyof T]: U } {
  // Use Array.map but cast the result to preserve the tuple structure
  return Array.prototype.map.call(tuple, fn as any) as { [K in keyof T]: U };
}

/**
 * Maps over a tuple and preserves its structure, returning a new tuple where each element's type
 * is determined by the mapping function's return type at that specific index.
 * 
 * @template T - The tuple type (readonly array)
 * @template U - The tuple of return types from the mapping function
 * @param {T} tuple - The input tuple to map over
 * @param {(value: T[number], index: number, array: readonly T[number][]) => any} fn - The mapping function
 * @returns {U} - A new tuple with the same structure but mapped values with specific types
 * 
 * @example
 * const myTuple = [1, "hello"] as const;
 * const mappedTuple = mapTupleWithIndex<typeof myTuple, [number, string]>(
 *   myTuple, 
 *   (val, i) => i === 0 ? (val as number) * 2 : (val as string).toUpperCase()
 * ); // Type: [number, string]
 */
export function mapTupleWithIndex<
  T extends readonly unknown[],
  U extends { [K in keyof T]: unknown }
>(
  tuple: T,
  fn: (value: T[number], index: number, array: readonly T[number][]) => any
): U {
  // Create a new array by mapping over the tuple
  const result = [] as unknown[];
  
  // Manually iterate to ensure proper typing
  for (let i = 0; i < tuple.length; i++) {
    result[i] = fn(tuple[i], i, tuple);
  }
  
  return result as unknown as U;
}
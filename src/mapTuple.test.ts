import { describe, expect, it } from 'vitest';
import { mapTuple, mapTupleWithIndex } from './mapTuple';

describe('mapTuple', () => {
  it('should map a tuple and preserve its structure', () => {
    // Arrange
    const tuple = [1, 'hello', true] as const;
    
    // Act
    const result = mapTuple(tuple, (value) => {
      return typeof value === 'string' ? value.toUpperCase() : value;
    });
    
    // Assert
    expect(result).toEqual([1, 'HELLO', true]);
    expect(result.length).toBe(3);
  });
  
  it('should map all elements to the same type', () => {
    // Arrange
    const tuple = [1, 2, 3] as const;
    
    // Act
    const result = mapTuple(tuple, (value) => String(value));
    
    // Assert
    expect(result).toEqual(['1', '2', '3']);
    // TypeScript should infer result as [string, string, string]
  });
  
  it('should work with empty tuples', () => {
    // Arrange
    const tuple = [] as const;
    
    // Act
    const result = mapTuple(tuple, (value) => value);
    
    // Assert
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});

describe('mapTupleWithIndex', () => {
  it('should map a tuple with index awareness', () => {
    // Arrange
    const tuple = [1, 'hello', true] as const;
    
    // Act
    type ResultType = [number, string, boolean];
    const result = mapTupleWithIndex<typeof tuple, ResultType>(tuple, (value, index) => {
      if (index === 0) return (value as number) * 2;
      if (index === 1) return (value as string).toUpperCase();
      return !(value as boolean);
    });
    
    // Assert
    expect(result).toEqual([2, 'HELLO', false]);
    expect(result.length).toBe(3);
  });
  
  it('should preserve the tuple structure with different return types', () => {
    // Arrange
    const tuple = ['a', 'b', 'c'] as const;
    
    // Act
    type ResultType = [number, string, boolean];
    const result = mapTupleWithIndex<typeof tuple, ResultType>(tuple, (value, index) => {
      if (index === 0) return (value as string).charCodeAt(0);
      if (index === 1) return (value as string).repeat(2);
      return (value as string) === 'c';
    });
    
    // Assert
    expect(result).toEqual([97, 'bb', true]);
    // TypeScript should infer result as [number, string, boolean]
  });
  
  it('should work with empty tuples', () => {
    // Arrange
    const tuple = [] as const;
    
    // Act
    const result = mapTupleWithIndex(tuple, (value) => value);
    
    // Assert
    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});

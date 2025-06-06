import { describe, expect, it } from 'vitest';
import { ButterTupleEnum } from './butterTupleEnum';

describe('ButterTupleEnum', () => {
  const Colors = ButterTupleEnum(['red', 'green', 'blue']);

  it('should create a tuple enum with the provided values', () => {
    expect(Colors.tuple).toEqual(['red', 'green', 'blue']);
    expect(Array.isArray(Colors.tuple)).toBe(true);
  });

  it('should create an enum object with keys matching the tuple values', () => {
    expect(Colors.enum).toEqual({
      red: 'red',
      green: 'green',
      blue: 'blue'
    });
  });

  it('should retrieve values by index using get()', () => {
    expect(Colors.get(0)).toBe('red');
    expect(Colors.get(1)).toBe('green');
    expect(Colors.get(2)).toBe('blue');
    expect(Colors.get(3)).toBeUndefined();
  });

  it('should provide the correct length', () => {
    expect(Colors.length).toBe(3);
  });

  it('should return the original tuple', () => {
    expect(Colors.tuple).toEqual(['red', 'green', 'blue']);
  });

  it('should deeply freeze the tuple and enum', () => {
    // Attempt to modify the tuple
    expect(() => {
      (Colors.tuple as any)[0] = 'yellow';
    }).toThrow();

    // Attempt to modify the enum
    expect(() => {
      (Colors.enum as any).red = 'crimson';
    }).toThrow();
  });

  it('should work with empty arrays', () => {
    const EmptyEnum = ButterTupleEnum([]);
    expect(EmptyEnum.tuple).toEqual([]);
    expect(EmptyEnum.enum).toEqual({});
    expect(EmptyEnum.length).toBe(0);
  });

  it('should map over the tuple', () => {
    expect(Colors.mapTuple(value => value.toUpperCase())).toEqual(['RED', 'GREEN', 'BLUE']);
  });
});

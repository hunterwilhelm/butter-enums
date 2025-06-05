import { describe, expect, it } from 'vitest';
import { ButterKeyedEnum, ButterTupleEnum } from './index';

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

  it('should return the original tuple when serialized', () => {
    expect(Colors.toSerializable()).toEqual(['red', 'green', 'blue']);
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
});

describe('ButterKeyedEnum', () => {
  const Fruits = ButterKeyedEnum({
    apple: {
      name: 'Apple',
      color: 'red',
      sweetness: 7
    },
    banana: {
      name: 'Banana',
      color: 'yellow',
      sweetness: 8
    },
    lemon: {
      name: 'Lemon',
      color: 'yellow',
      sweetness: 2
    }
  });

  it('should create an enum object with the provided values and add keys', () => {
    expect(Fruits.enum.apple).toEqual({
      name: 'Apple',
      color: 'red',
      sweetness: 7,
      key: 'apple'
    });

    expect(Fruits.enum.banana.key).toBe('banana');
    expect(Fruits.enum.lemon.key).toBe('lemon');
  });

  it('should retrieve values by key using get()', () => {
    expect(Fruits.get('apple')).toEqual({
      name: 'Apple',
      color: 'red',
      sweetness: 7,
      key: 'apple'
    });
    expect(Fruits.get('nonexistent')).toBeUndefined();
  });

  it('should retrieve multiple values by keys using getAll()', () => {
    const result = Fruits.getAll(['apple', 'lemon']);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Apple');
    expect(result[1].name).toBe('Lemon');

    // Should handle nonexistent keys
    expect(Fruits.getAll(['apple', 'nonexistent'])[1]).toBeUndefined();
  });

  it('should provide all keys', () => {
    expect(Fruits.keys).toEqual(['apple', 'banana', 'lemon']);
  });

  it('should provide all values', () => {
    expect(Fruits.values).toHaveLength(3);
    expect(Fruits.values[0].key).toBe('apple');
    expect(Fruits.values[1].key).toBe('banana');
    expect(Fruits.values[2].key).toBe('lemon');
  });

  it('should find values based on a predicate', () => {
    const yellowFruit = Fruits.find(fruit => fruit.color === 'yellow');
    expect(yellowFruit).toBeDefined();
    expect(yellowFruit?.color).toBe('yellow');
    // Should find the first match (banana comes before lemon)
    expect(yellowFruit?.key).toBe('banana');

    const sourFruit = Fruits.find(fruit => fruit.sweetness < 3);
    expect(sourFruit?.key).toBe('lemon');

    const nonexistentFruit = Fruits.find(fruit => fruit.color === 'purple' as string);
    expect(nonexistentFruit).toBeUndefined();
  });

  it('should deeply freeze the enum object', () => {
    // Attempt to modify the enum
    expect(() => {
      (Fruits.enum as any).apple.name = 'Green Apple';
    }).toThrow();

    // Attempt to add a new property
    expect(() => {
      (Fruits.enum as any).apple.organic = true;
    }).toThrow();
  });

  it('should work with empty objects', () => {
    const EmptyEnum = ButterKeyedEnum({});
    expect(EmptyEnum.enum).toEqual({});
    expect(EmptyEnum.keys).toEqual([]);
    expect(EmptyEnum.values).toEqual([]);
  });
});

const ColorsTupleEnum = ButterTupleEnum(['red', 'green', 'blue']);
const red = ColorsTupleEnum.enum.red
//    ^? "red"
const colorTuple = ColorsTupleEnum.tuple
//    ^? ["red", "green", "blue"]

const ColorsKeyedEnum = ButterKeyedEnum({
  green: {
    emoji: '🟩',
    hex: '#00FF00'
  },
});
const greenKey = ColorsKeyedEnum.enum.green.key
//    ^? "green" 

const greenValue = ColorsKeyedEnum.enum.green
//    ^? { emoji: "🟩", hex: "#00FF00", key: "green" }

const greenEmoji = ColorsKeyedEnum.enum.green.emoji
//    ^? "🟩"


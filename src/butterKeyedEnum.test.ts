
import { describe, expect, it } from 'vitest';
import { ButterKeyedEnum } from './butterKeyedEnum';

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
  }, {
    tupleFactory: (enumObject) => [
      enumObject.apple,
      enumObject.lemon,
      enumObject.banana,
    ]
  });

  it('should create a tuple from the enum object', () => {
    expect(Fruits.tuple).toEqual([
      {
        name: 'Apple',
        color: 'red',
        sweetness: 7,
        key: 'apple'
      },
      {
        name: 'Lemon',
        color: 'yellow',
        sweetness: 2,
        key: 'lemon'
      },
      {
        name: 'Banana',
        color: 'yellow',
        sweetness: 8,
        key: 'banana'
      },
    ])
  })


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

  it('should retrieve multiple values by keys using getMany()', () => {
    const result = Fruits.getMany(['apple', 'lemon']);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Apple');
    expect(result[1].name).toBe('Lemon');

    // Should handle nonexistent keys
    expect(Fruits.getMany(['apple', 'nonexistent'])[1]).toBeUndefined();
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

  it('should work with empty objects, but the typing should warn', () => {
    const EmptyEnum = ButterKeyedEnum({}, {
      // @ts-expect-error
      tupleFactory: (enumObject) => []
    });
    expect(EmptyEnum.enum).toEqual({});
    expect(EmptyEnum.keys).toEqual([]);
    expect(EmptyEnum.values).toEqual([]);
  });

  it('should work with bad tuple factory, but the typing should warn', () => {
    const BadEnum = ButterKeyedEnum({
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
        sweetness: 2,
      }
    }, {
      // @ts-expect-error
      tupleFactory: (enumObject) => [
        enumObject.apple,
        enumObject.lemon,
      ]
    })
    expect(BadEnum.enum).toEqual({
      apple: {
        name: 'Apple',
        color: 'red',
        sweetness: 7,
        key: 'apple'
      },
      banana: {
        name: 'Banana',
        color: 'yellow',
        sweetness: 8,
        key: 'banana'
      },
      lemon: {
        name: 'Lemon',
        color: 'yellow',
        sweetness: 2,
        key: 'lemon'
      }
    })
    expect(BadEnum.keys).toEqual(['apple', 'banana', 'lemon'])
    expect(BadEnum.values).toEqual([
      {
        name: 'Apple',
        color: 'red',
        sweetness: 7,
        key: 'apple'
      },
      {
        name: 'Banana',
        color: 'yellow',
        sweetness: 8,
        key: 'banana'
      },
      {
        name: 'Lemon',
        color: 'yellow',
        sweetness: 2,
        key: 'lemon'
      }
    ])
    expect(BadEnum.tuple).toEqual([
      {
        name: 'Apple',
        color: 'red',
        sweetness: 7,
        key: 'apple'
      },
      {
        name: 'Lemon',
        color: 'yellow',
        sweetness: 2,
        key: 'lemon'
      }
    ])
  })


  const Slugs = ButterKeyedEnum({
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
      sweetness: 2,
    }
  }, {
    keyName: 'slug',
    tupleFactory: (enumObject) => [
      enumObject.lemon,
      enumObject.banana,
      enumObject.apple,
    ]
  });

  it('should create a tuple from the enum object', () => {
    expect(Slugs.tuple).toEqual([
      {
        name: 'Lemon',
        color: 'yellow',
        sweetness: 2,
        slug: 'lemon'
      },
      {
        name: 'Banana',
        color: 'yellow',
        sweetness: 8,
        slug: 'banana'
      },
      {
        name: 'Apple',
        color: 'red',
        sweetness: 7,
        slug: 'apple'
      },
    ])
  })

  it('should create an enum object with the provided values and add keys', () => {
    expect(Slugs.enum.apple).toEqual({
      name: 'Apple',
      color: 'red',
      sweetness: 7,
      slug: 'apple'
    });
    expect(Slugs.enum.banana.slug).toBe('banana');
    expect(Slugs.enum.lemon.slug).toBe('lemon');
  });

  it('should retrieve values by key using get()', () => {
    expect(Slugs.get('apple')).toEqual({
      name: 'Apple',
      color: 'red',
      sweetness: 7,
      slug: 'apple'
    });
    expect(Slugs.get('nonexistent')).toBeUndefined();
  });

  it('should retrieve multiple values by keys using getMany()', () => {
    const result = Slugs.getMany(['apple', 'lemon']);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Apple');
    expect(result[1].name).toBe('Lemon');

    // Should handle nonexistent keys
    expect(Slugs.getMany(['apple', 'nonexistent'])[1]).toBeUndefined();
  });

  it('should provide all keys', () => {
    expect(Slugs.keys).toEqual(['apple', 'banana', 'lemon']);
  });

  it('should provide all values', () => {
    expect(Slugs.values).toHaveLength(3);
    expect(Slugs.values[0].slug).toBe('apple');
    expect(Slugs.values[1].slug).toBe('banana');
    expect(Slugs.values[2].slug).toBe('lemon');
  });
});
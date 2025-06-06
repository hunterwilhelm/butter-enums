
<div align="center">
  <a href="https://www.npmjs.com/package/butter-enums">
    <img alt="weekly downloads" src="https://img.shields.io/npm/dw/butter-enums?logo=npm" />
  </a>
  <a href="https://github.com/hunterwilhelm/butter-enums/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/hunterwilhelm/butter-enums?logo=open-source-initiative" />
  </a>
</div>

# Butter Enums

> Smooth like butter - Type-safe enum utilities for TypeScript

A lightweight TypeScript library providing type-safe enum utilities that make working with enums in TypeScript smoother.

## Installation

```bash
npm install butter-enums
# or
yarn add butter-enums
# or
pnpm add butter-enums
```

## Features

- **ButterTupleEnum**: Create type-safe enums from tuples of strings
- **ButterKeyedEnum**: Create type-safe enums from objects with additional metadata
- **Deep immutability**: All enums are deeply frozen for safety

## Usage

### ButterTupleEnum

Tuple enums are created with a tuple of strings. They provide type safety when converting back and forth between enums and tuples, which is extremely useful when working with libraries like Drizzle ORM.

```typescript
import { ButterTupleEnum } from 'butter-enums';

// Create a tuple enum
const Colors = ButterTupleEnum(['red', 'green', 'blue']);

// Access as tuple
const firstColor = Colors.get(0); // 'red'
const allColors = Colors.tuple; // readonly ['red', 'green', 'blue']
const colorCount = Colors.length; // 3

// Access as enum
const redColor = Colors.enum.red; // 'red'
```

### ButterKeyedEnum

Keyed enums are created with an object of objects. They provide type safety when converting back and forth between enums and objects, allowing you to attach additional metadata to each enum value.

```typescript
import { ButterKeyedEnum } from 'butter-enums';

// Create a keyed enum
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
  // This is required because typescript cannot convert from a union to a tuple with
  // * Guaranteed order
  // * Better performance than O(n^2)
  // See https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type
  //
  // So, we have to provide a tuple factory. It constrains the tuple to make sure you're not missing any values.
  // Making our typescript compiler happy.
  tupleFactory: (enumObject) => [
    enumObject.apple,
    enumObject.lemon,
    enumObject.banana,
  ]
});

// Access enum values
const apple = Fruits.enum.apple;
// { name: 'Apple', color: 'red', sweetness: 7, key: 'apple' }

// Get a value by key
const banana = Fruits.get('banana');
// { name: 'Banana', color: 'yellow', sweetness: 8, key: 'banana' }

// Get all keys
const fruitKeys = Fruits.keys; // ['apple', 'banana', 'lemon']

// Get all values
const allFruits = Fruits.values;

// Find a value
const yellowFruit = Fruits.find(fruit => fruit.color === 'yellow');
// { name: 'Banana', color: 'yellow', sweetness: 8, key: 'banana' }
```

## License

MIT

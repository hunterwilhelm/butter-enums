---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Butter Enums"
  text: "Typesafe enums as smooth as butter"
  tagline: "Tuples, objects, and more"
  image:
    light: /mascot.svg
    dark: /mascot.svg
    alt: "Butter Enums Mascot"
---


## Installation

```sh
npm install butter-enums
```

## Import

```ts
import { ButterKeyedEnum, ButterTupleEnum } from "butter-enums"
```


## Tuple Enums
```ts twoslash
import { ButterTupleEnum } from "butter-enums"

const test = ButterTupleEnum(['blue', 'green', 'red'])

console.log(test.tuple)
//               ^?







console.log(test.enum)
//               ^?
```
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />


## Keyed Enums
```ts twoslash
import { ButterKeyedEnum } from "butter-enums"

const test = ButterKeyedEnum({
  green: {
    emoji: '🟩',
    hex: '#00FF00',
  },
}, {
  // This is required because typescript cannot convert from a union to a tuple with
  // * Guaranteed order
  // * Better performance than O(n^2)
  // See https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type
  //
  // So, we have to provide a tuple factory. It constrains the tuple to make sure you're not missing any values.
  // Making our typescript compiler happy.
  tupleFactory: (enumObject) => [
    enumObject.green,
  ]
})

console.log(test.enum.green)
//                    ^?
```

<br />
<br />
<br />
<br />
<br />
<br />

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
import { ButterTupleEnum } from "../src/index"
// ---cut---
const test = ButterTupleEnum(['test', 'Test'])

console.log(test.tuple)
//               ^?


console.log(test.enum)
//               ^?
```
<br />


## Keyed Enums
```ts twoslash
import { ButterKeyedEnum } from "../src/index"
// ---cut---
const test = ButterKeyedEnum({
  test: {
    name: 'Test',
    description: 'Test',
  },
})

console.log(test.enum.test)
//                    ^?
```

<br />
<br />
<br />
<br />
<br />
<br />

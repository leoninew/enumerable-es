## Introducation

enumerable-es is library operating data as C# LINQ style implemented by TypeScript, [简体中文](https://github.com/leoninew/enumerable-es/blob/master/README_cn.md).

## Quick Start

enumerable-es is available on [npmjs](https://www.npmjs.com/package/enumerable-es).

```bash
$ npm install enumerable-es
```

or by yarn

```bash
$ yarn add enumerable-es
```

or in browser 

```javascript
<script type="module">
  import enumerable from 'https://cdn.skypack.dev/enumerable-es';
</script>
```

or in [codesandbox.io](https://codesandbox.io/s/dazzling-montalcini-n56xs?file=/src/components/HelloWorld.vue)

## Development

run unit test

```bash
$ yarn test --coverage
yarn run v1.22.5
$ jest --coverage
 PASS  test/enumerable/Sequence.test.ts
 PASS  test/index.test.ts
----------------|---------|----------|---------|---------|-------------------
File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------|---------|----------|---------|---------|-------------------
All files       |    98.4 |    86.96 |     100 |   98.11 |
 src            |     100 |      100 |     100 |     100 |
  index.ts      |     100 |      100 |     100 |     100 |
 src/enumerable |   98.25 |    86.36 |     100 |   97.95 |
  Sequence.ts   |   98.25 |    86.36 |     100 |   97.95 | 30,73,104
----------------|---------|----------|---------|---------|-------------------

Test Suites: 2 passed, 2 total
Tests:       26 passed, 26 total
Snapshots:   0 total
Time:        5.816 s
Ran all test suites.
Done in 6.87s.
```

build from source

```bash
$ rm -rf dist/* && yarn build:cjs && yarn build:es6 && yarn build:web
yarn run v1.22.5
$ tsc -P tsconfig.json
Done in 4.08s.
yarn run v1.22.5
$ tsc -P tsconfig.json --module ES6 --outDir dist/es6
Done in 4.11s.
yarn run v1.22.5
$ browserify dist/cjs/src/index.js --standalone enumerable -o dist/web/bundle.js
Done in 0.81s.
```

## Features

API implemented as bellow

- [x] `select()`
- [x] `selectMany()`
- [x] `where()`
- [x] `take()`
- [x] `skip()`
- [x] `all()`
- [x] `any()`
- [x] `orderBy()`
- [x] `orderByDescending()`
- [x] `reverse()`
- [x] `groupBy()`
- [x] `distinct()`
- [x] `empty()`
- [x] `range()`
- [x] `repeat()`
- [x] `first()`
- [x] `toArray()`

plan list

- [ ] `concat`
- [ ] `except`
- [ ] `thenBy()`
- [ ] `thenByDescending()`

## Sample

get all anchors from current page, group them by href domain, take top 5 which have most items.

```javascript
enumerable.from(document.querySelectorAll('a'))
    .groupBy(x => (/https?:\/\/(.+?)\/.*/.exec(x.href) || 0)[1], x => x)
    .orderByDescending(x => x.count())
    .take(5)
    .select(x => ({key: x.key(), items: x.toArray()}))
    .toArray()
```

Get more usage from test case in [Sequence.test.ts](https://github.com/leoninew/enumerable-es/blob/master/test/enumerable/Sequence.test.ts)

## License

[Apache License 2.0](https://github.com/leoninew/enumerable-es/blob/master/license.txt)
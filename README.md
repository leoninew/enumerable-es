## Introducation

enumerable-es is library operating data as C# LINQ style implemented by TypeScript, [简体中文](https://github.com/leoninew/enumerable-es/blob/master/README_cn.md).

## Quick Start

enumerable-es is available on [npmjs](https://www.npmjs.com/package/enumerable-es).

```bash
npm install enumerable-es
```

or by yarn

```bash
yarn add enumerable-es
```

## Development

run unit test

```bash
yarn test
```

build from source

```bash
rm -rf dist/* && yarn build:cjs && yarn build:es6 && yarn build:web
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

[apache license 2.0](https://github.com/leoninew/enumerable-es/blob/master/license.txt)
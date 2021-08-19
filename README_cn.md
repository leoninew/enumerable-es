## 类库简介

enumerable-es 是使用 TypeScript 实现的 C# LINQ 风格数据操作类, [english version](https://github.com/leoninew/enumerable-es/blob/master/README.md).

## 快速开始

enumerable-es 已经发布到 [npmjs](https://www.npmjs.com/package/enumerable-es).

```bash
$ npm install enumerable-es
```

或者使用 yarn

```bash
$ yarn add enumerable-es
```

或者在浏览器中

```javascript
<script type="module">
  import enumerable from 'https://cdn.skypack.dev/enumerable-es';
</script>
```

或者在 [codesandbox.io](https://codesandbox.io/s/dazzling-montalcini-n56xs?file=/src/components/HelloWorld.vue)

## 开发

运行单元测试

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

从源码构建

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

## 功能列表

已实现 API 如下

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

计划列表

- [ ] `concat`
- [ ] `except`
- [ ] `thenBy()`
- [ ] `thenByDescending()`

## 示例

获取当前页面的所有锚点并使用其链接的 domain 分组，以数量倒序取前5。

```javascript
enumerable.from(document.querySelectorAll('a'))
    .groupBy(x => (/https?:\/\/(.+?)\/.*/.exec(x.href) || 0)[1], x => x)
    .orderByDescending(x => x.count())
    .take(5)
    .select(x => ({key: x.key(), items: x.toArray()}))
    .toArray()
```

更多使用示例见单元测试 [Sequence.test.ts](https://github.com/leoninew/enumerable-es/blob/master/test/enumerable/Sequence.test.ts)

## License

[Apache-2.0](https://github.com/leoninew/enumerable-es/blob/master/license.txt)
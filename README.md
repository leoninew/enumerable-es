## Build

```bash
rm -rf dist/* && yarn build:cjs && yarn build:es6 && yarn build:web
```

## Usage

get all anchors from current page, group by href domain, take top 5 which have most items.

```javascript
enumerable.default.from(document.querySelectorAll('a'))
    .groupBy(x => (/https?:\/\/(.+?)\/.*/.exec(x.href) || 0)[1], x => x)
    .orderByDescending(x => x.count())
    .take(5)
    .select(x => ({key: x.key(), items: x.toArray()}))
    .toArray()
```
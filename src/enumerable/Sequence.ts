import {ISequence, IGroup, PredicateFn, SelectorFn, SortFn} from "./ISequence";


class Sequence<T> implements ISequence<T> {
    private readonly _items: Iterable<T>;

    constructor(items: Iterable<T>) {
        this._items = items;
    }

    private* iterate() {
        for (let item of this._items) {
            yield item;
        }
    }

    protected items(): Iterable<T> {
        return this._items;
    }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        return this.iterate();
    }

    count(): number {
        if (Array.isArray(this._items)) {
            return this._items.length;
        }

        return Array.from(this._items).length;
    }

    skip(count: Number): ISequence<T> {
        let self = this;
        let func = function* () {
            let index = 0;
            for (let item of self._items) {
                if (index++ < count) {
                    continue;
                }
                yield item;
            }
        }
        let items = func();
        return new Sequence(items);
    }

    take(count: Number): ISequence<T> {
        let self = this;
        let func = function* () {
            let index = 0;
            for (let item of self._items) {
                if (index++ == count) {
                    break;
                }
                yield item;
            }
        }
        let items = func();
        return new Sequence(items);
    }

    sum(selector?: SelectorFn<T, number>): number {
        // reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        let total = 0;
        let index = 0;
        for (let item of this._items) {
            if (selector) {
                total += selector(item, index++);
            }
            else {
                if (item[Symbol.toPrimitive]) {
                    total += item[Symbol.toPrimitive]();
                }
                else {
                    total += +item;
                }
            }
        }
        return total;
    }

    any(predicate?: PredicateFn<T>): boolean {
        if (Object.is(predicate, undefined)) {
            for (let item of this._items) {
                return true;
            }
        }
        else {
            let index = 0;
            for (let item of this._items) {
                if (predicate!(item, index++)) {
                    return true;
                }
            }
        }
        return false
    }

    all(predicate?: PredicateFn<T>): boolean {
        if (Object.is(predicate, undefined)) {
            for (let item of this._items) {
                if (!!item === false) {
                    return false;
                }
            }
        }
        else {
            let index = 0;
            for (let item of this._items) {
                if (predicate(item, index++) == false) {
                    return false;
                }
            }
        }
        return true
    }


    where(predicate: PredicateFn<T>): ISequence<T> {
        let array: T[] = Array.isArray(this._items)
            ? this._items
            : Array.from(this._items);
        let items = array.filter(predicate);
        return new Sequence(items);
    }

    select<K>(selector: SelectorFn<T, K>): ISequence<K> {
        let self = this;
        let func = function* () {
            let index = 0;
            for (let item of self._items) {
                yield selector(item, index++);
            }
        }
        let items = func();
        return new Sequence(items);
    }

    selectMany<K>(selector: SelectorFn<T, Iterable<K>>): ISequence<K> {
        let self = this;
        let func = function* () {
            for (let item of self.select(selector)) {
                yield* item;
            }
        }
        let items = func();
        return new Sequence<K>(items);
    }

    orderBy<K>(sort: SortFn<T, K>, comparer?: (x: K, y: K) => number): ISequence<T> {
        let array: T[] = Array.isArray(this._items)
            ? this._items
            : Array.from(this._items);

        let compareFn = (a: T, b: T) => {
            let xa = sort(a);
            let xb = sort(b);
            if (comparer) {
                return comparer(xa, xb);
            }
            if (typeof xa === 'number' && typeof xb === 'number') {
                return xa - xb;
            }
            // compare by [Symbol.toPrimitive]()
            let va = +xa;
            let vb = +xb;
            return va - vb;
        };
        let items = array.sort(compareFn);
        return new Sequence(items);
    }

    reverse(): ISequence<T> {
        let array: T[] = Array.from(this._items);
        array.reverse();
        return new Sequence(array);
    }

    orderByDescending<K>(sort: SortFn<T, K>, comparer?: (x: K, y: K) => number): ISequence<T> {
        return this.orderBy(sort, comparer)
            .reverse();
    }

    groupBy<K, E>(keySelector: SelectorFn<T, K>, valueSelector?: SelectorFn<T, E>, comparer?: (x: K, y: K) => boolean): ISequence<IGroup<T | E, K>> {
        let array: T[] = Array.isArray(this._items)
            ? this._items
            : Array.from(this._items);

        // reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        let callback = (previousValue: Group<T | E, K>[], currentValue: T, currentIndex: number, array: T[]) => {
            let key: K = keySelector(currentValue, currentIndex);
            let value: T | E = valueSelector ? valueSelector(currentValue, currentIndex) : currentValue;
            let found = comparer
                ? previousValue.find(x => comparer(x.key(), key))
                : previousValue.find(x => x.key() === key);

            if (Object.is(found, undefined)) {
                found = new Group(key, [value]);
                previousValue.push(found);
            }
            else {
                found.push(value);
            }
            return previousValue;
        };

        let initialValue: Group<T | E, K>[] = [];
        array.reduce(callback, initialValue);
        return new Sequence(initialValue);
    }

    distinct(comparer?: (x: T) => PropertyKey): ISequence<T> {
        let self = this;
        let set = new Set<PropertyKey | T>();
        let func = function* () {
            for (let item of self._items) {
                let key = comparer ? comparer(item) : item;
                if (set.has(key) === false) {
                    set.add(key)
                    yield item;
                }
            }
        }
        let items = func();
        return new Sequence<T>(items);
    }

    toArray(): T[] {
        return Array.from(this._items);
    }

    first(): T | undefined {
        let result: T | undefined;
        for (let item of this._items) {
            result = item;
            break;
        }
        return result;
    }

    chunk(size: number): ISequence<T[]> {
        let self = this;
        let func = function* () {
            let range: T[] = undefined;
            for (const item of self._items) {
                if(range === undefined) {
                    range = [];
                }
                range.push(item);
                if(range.length == size) {
                    yield Array.from(range);
                    range = undefined;
                }
            }
            if(range !== undefined) {
                yield range;
            }
        };
        let items = func();
        return new Sequence(items);
    }
}

class Group<T, K> extends Sequence<T> implements IGroup<T, K> {
    private readonly _key: K;

    constructor(key: K, items: T[]) {
        super(items);
        this._key = key;
    }

    key(): K {
        return this._key;
    }

    push(item: T) {
        let array = super.items() as T[];
        array.push(item);
    }
}

export default Sequence;
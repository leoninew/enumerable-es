export interface PredicateFn<T, U = any> {
    (item: T, index: number): U;
}

export interface SelectorFn<T, K> {
    (item: T, index: number): K;
}

export interface SortFn<T, K> {
    (item: T): K;
}


export interface ISequence<T> extends Iterable<T> {
    count(): number;

    skip(count: Number): ISequence<T>;

    take(count: Number): ISequence<T>;

    sum(selector?: SelectorFn<T, number>): number;

    any(predicate?: PredicateFn<T>): boolean;

    all(predicate?: PredicateFn<T>): boolean;

    where(predicate: PredicateFn<T>): ISequence<T>;

    select<K>(selector: SelectorFn<T, K>): ISequence<K>;

    selectMany<K>(selector: SelectorFn<T, Iterable<K>>): ISequence<K>;

    orderBy<K>(sort: SortFn<T, K>, comparer?: (x: K, y: K) => number): ISequence<T>;

    reverse(): ISequence<T>;

    orderByDescending<K>(sort: SortFn<T, K>, comparer?: (x: K, y: K) => number): ISequence<T>;

    groupBy<K, E>(keySelector: SelectorFn<T, K>, valueSelector?: SelectorFn<T, E>, comparer?: (x: K, y: K) => boolean): ISequence<IGroup<T | E, K>>;

    distinct(comparer?: (x: T) => PropertyKey): ISequence<T>;

    toArray(): T[];

    first(): T | undefined;
}

export interface IGroup<T, K> extends ISequence<T> {
    key(): K;
    push(item: T) ;
}
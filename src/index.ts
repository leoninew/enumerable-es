import Sequence from "./enumerable/Sequence";
import { ISequence } from "./enumerable/ISequence";

let innerRange = function* (start: number, count: number): Generator<number> {
    for (let i = start; i < count; i++) {
        yield i;
    }
};

let from = function <T>(items: Iterable<T>): ISequence<T> {
    return new Sequence(items);
}

let empty = function <T>(): ISequence<T> {
    return new Sequence([]);
}

let range = function (start: number, count: number): ISequence<number> {
    return from(innerRange(start, count));
}

let repeat = function <T>(value: T, count: number): ISequence<T> {
    return range(0, count).select(x => value);
}

export default {
    from,
    empty,
    range,
    repeat,
}
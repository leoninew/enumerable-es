import enumerable from "../../src";

describe('enumerable', function () {
    test('any', () => {
        expect(enumerable.range(0, 4).any()).toBe(true);
        expect(enumerable.range(0, 4).any(x => x > 2)).toBe(true);
        expect(enumerable.range(0, 4).any(x => x < 0)).toBe(false);
    });

    test('all', () => {
        expect(enumerable.range(1, 4).all()).toBe(true);
        expect(enumerable.range(1, 4).all(x => x > 0)).toBe(true);
        expect(enumerable.range(1, 4).all(x => x > 2)).toBe(false);
        expect(enumerable.range(1, 4).all(x => x < 2)).toBe(false);
    });

    test('count', () => {
        let words = ['Hey', 'Hi'];
        let count = enumerable.from(words).count()
        expect(count).toBe(2);
    });

    test('skip', () => {
        let seq1 = enumerable.range(0, 3).skip(0).toArray();
        expect(seq1).toStrictEqual([0, 1, 2]);

        let seq2 = enumerable.range(0, 3).skip(2).toArray();
        expect(seq2).toStrictEqual([2]);

        let seq3 = enumerable.range(0, 3).skip(100).toArray();
        expect(seq3).toStrictEqual([]);
    });

    test('take', () => {
        let seq1 = enumerable.range(0, 3).take(0).toArray();
        expect(seq1).toStrictEqual([]);

        let seq2 = enumerable.range(0, 3).take(2).toArray();
        expect(seq2).toStrictEqual([0, 1]);

        let seq3 = enumerable.range(0, 3).take(100).toArray();
        expect(seq3).toStrictEqual([0, 1, 2]);
    });

    test('sum', () => {
        let sum1 = enumerable.range(0, 5).sum();
        expect(sum1).toBe(10);

        let sum2 = enumerable.from(['Hey', 'Hi'])
            .sum(x => x.length);
        expect(sum2).toBe(5);
    });

    test('where', () => {
        let range = enumerable.range(0, 4);
        let result = range.where(x => x > 1)
            .toArray();
        expect(result).toStrictEqual([2, 3]);
    });

    test('select', () => {
        let range = enumerable.range(0, 4);
        let result = range.select(x => String.fromCharCode(65 + x))
            .toArray();
        expect(result).toStrictEqual(['A', 'B', 'C', 'D']);
    });

    test('selectMany', () => {
        let words = ['Hey', 'Hi'];
        let result = enumerable.from(words)
            .selectMany(x => x.split(''))
            .toArray();
        expect(result).toStrictEqual(['H', 'e', 'y', 'H', 'i']);
    });

    test('orderBy', () => {
        let words = ['Hey', 'Hi'];
        let result = enumerable.from(words)
            .orderBy(x => x.length)
            .toArray();
        expect(result).toStrictEqual(['Hi', 'Hey']);
    });

    test('orderBy-comparer', () => {
        let words = ['Hey', 'Hi'];
        let result = enumerable.from(words)
            .orderBy(x => x, (x, y) => x.length - y.length)
            .toArray();
        expect(result).toStrictEqual(['Hi', 'Hey']);
    });

    test('orderBy-property', () => {
        let students = [
            { id: 1, name: 'Rattz', age: 20 },
            { id: 2, name: 'Alex', age: 10 },
            { id: 3, name: 'John', age: 20 }
        ];
        let result1 = enumerable.from(students).orderBy(x => x.age);
        expect(result1.select(x => x.id).toArray()).toStrictEqual([2, 1, 3]);

        let result2 = enumerable.from(students).orderBy(x => x.name, (x, y) => x.codePointAt(0) - y.codePointAt(0));
        expect(result2.select(x => x.id).toArray()).toStrictEqual([2, 3, 1]);
    });

    test('orderBy-toPrimitive', () => {
        class Student {
            name: string;

            constructor(name: string) {
                this.name = name;
            }

            [Symbol.toPrimitive]() {
                return this.name.charCodeAt(0);
            }
        }

        let students = [
            new Student('Rattz'),
            new Student('Alex'),
            new Student('John'),
        ]
        
        let result = enumerable.from(students).orderBy(x => x).toArray();
        expect(result[0].name).toBe('Alex');
        expect(result[1].name).toBe('John');
        expect(result[2].name).toBe('Rattz');
    });

    test('orderBy-complex', () => {
        let students = [
            { "department": 'a', "level": 1, "name": "c8823ccc", "salary": 7 },
            { "department": 'b', "level": 2, "name": "f578c205", "salary": 75 },
            { "department": 'a', "level": 2, "name": "d755d16c", "salary": 82 },
            { "department": 'b', "level": 1, "name": "ec3db8af", "salary": 58 },
            { "department": 'a', "level": 1, "name": "a9356802", "salary": 25 },
            { "department": 'b', "level": 2, "name": "be641bb6", "salary": 83 },
            { "department": 'a', "level": 2, "name": "5a0e7665", "salary": 7 },
            { "department": 'b', "level": 1, "name": "12883a04", "salary": 59 },
        ];

        let result = enumerable.from(students)
            .groupBy(x => ({ department: x.department, level: x.level }),
                x => x,
                (x, y) => x.department === y.department && x.level === y.level)
            .select(x => Array.from(x))
            .toArray();

        // console.log(JSON.stringify(result));
        /*[
            [
                {"department":"a","level":1,"name":"c8823ccc","salary":7},
                {"department":"a","level":1,"name":"a9356802","salary":25}
            ],
            [
                {"department":"b","level":2,"name":"f578c205","salary":75},
                {"department":"b","level":2,"name":"be641bb6","salary":83}
            ],
            [
                {"department":"a","level":2,"name":"d755d16c","salary":82},
                {"department":"a","level":2,"name":"5a0e7665","salary":7}
            ],
            [
                {"department":"b","level":1,"name":"ec3db8af","salary":58},
                {"department":"b","level":1,"name":"12883a04","salary":59}
            ]
        ]*/

        expect(result.length).toBe(4);
    });

    test('reverse', () => {
        let array = ['A', 'B', 'C'];
        let result = enumerable.from(array).reverse().toArray();
        expect(result).toStrictEqual(['C', 'B', 'A']);
        expect(array).toStrictEqual(['A', 'B', 'C']);
    });

    test('orderByDescending', () => {
        let words = ['Hey', 'Hi', 'Hello'];
        let result = enumerable.from(words)
            .orderByDescending(x => x.length)
            .toArray();
        expect(result).toStrictEqual(['Hello', 'Hey', 'Hi']);
    });

    test('groupBy', () => {
        let hello = 'hello'.split('');
        let group = enumerable.from(hello)
            .groupBy(x => x.codePointAt(0), x => x);

        // [["h"],["e"],["l","l"],["o"]]
        let result = group.select(x => Array.from(x)).toArray();
        expect(result).toStrictEqual([["h"], ["e"], ["l", "l"], ["o"]]);
    });

    test('groupBy-advanced', () => {
        let students = [
            { id: 1, name: 'Rattz', age: 20 },
            { id: 2, name: 'Alex', age: 10 },
            { id: 3, name: 'John', age: 20 }
        ];

        let result = enumerable.from(students)
            .groupBy(x => x.age, x => x.id)
            .select(x => ({ key: x.key(), items: Array.from(x) }))
            .toArray();

        // console.log(JSON.stringify(result));
        expect(result).toStrictEqual([{ "key": 20, "items": [1, 3] }, { "key": 10, "items": [2] }]);
    });

    test('groupBy-valueSelector', () => {
        let students = [
            { id: 1, name: 'Rattz', age: 20 },
            { id: 2, name: 'Alex', age: 10 },
            { id: 3, name: 'John', age: 20 }
        ];

        let result = enumerable.from(students)
            .groupBy(x => x.age, x => x.name)
            .select(x => Array.from(x))
            .toArray();

        // [["Rattz","John"],["Alex"]]
        // console.log(JSON.stringify(result));
        expect(result.length).toBe(2);
        expect(result[0]).toStrictEqual(["Rattz", "John"]);
        expect(result[1]).toStrictEqual(["Alex"]);
    });

    test('distinct', () => {
        let hello = 'hello'.split('');
        let distinct = enumerable.from(hello).distinct().toArray();
        expect(distinct).toStrictEqual(['h', 'e', 'l', 'o']);
    });

    test('distinct-comparer', () => {
        let hello = 'AabBcCDd'.split('');
        let distinct = enumerable.from(hello).distinct(x => x.toUpperCase()).toArray();
        expect(distinct).toStrictEqual(['A', 'b', 'c', 'D']);
    });
});
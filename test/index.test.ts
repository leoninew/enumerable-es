import enumerable from "../src";

describe('enumerable', function () {
    test('range', () => {
        let result = enumerable.range(0, 4).toArray();
        expect(result).toStrictEqual([0, 1, 2, 3]);
    });

    test('empty', () => {
        let result = enumerable.empty().toArray();
        expect(result).toStrictEqual([]);
    });

    test('repeat', () => {
        let result1 = enumerable.repeat(100, 4).toArray();
        expect(result1).toStrictEqual([100, 100, 100, 100]);

        let value = {};
        let result2 = enumerable.repeat(value, 4).toArray();
        expect(result2.length).toBe(4);

        for (let item of result2) {
            expect(item).toEqual(value);
        }
    });

    interface Student {
        id: number,
        name: string,
        grade: number,
        gender: string,
        age: number,
    }


    test('composite example', () => {
        let students: Student[] = [
            {"id": 1, "name": "Tom", "grade": 1, "gender": "f", "age": 22},
            {"id": 2, "name": "Alax", "grade": 2, "gender": "f", "age": 24},
            {"id": 3, "name": "Rattz", "grade": 2, "gender": "m", "age": 21}
        ];

        let result = enumerable.from(students)
            .groupBy(x => x.grade, x => x)
            .orderByDescending(x => x.count())
            .first()
            .where(x => x.name.indexOf('a') !== -1)
            .orderBy(x => x.age)
            .select(x => x.id)
            .toArray();
        expect(result).toStrictEqual([3, 2]);


    });

    test('origina example', () => {
        let students: Student[] = [
            {"id": 1, "name": "Tom", "grade": 1, "gender": "f", "age": 22},
            {"id": 2, "name": "Alax", "grade": 2, "gender": "f", "age": 24},
            {"id": 3, "name": "Rattz", "grade": 2, "gender": "m", "age": 21}
        ];

        // 以 grade 分组
        let group = students.reduce((g, c,) => {
            if (Object.is(g[c.grade], undefined)) {
                g[c.grade] = [];
            }
            g[c.grade].push(c);
            return g;
        }, {});

        // 分组结果是对象, 转为数组
        let array = Object.entries(group) as any;
        // 就地使用分组后的成员数量倒序排序
        array.sort((a, b) => b[1].length - a[1].length);
        // 获取第1个
        let first = array[0];
        // 使用 name 过滤列表
        let filtered = first[1].filter(x => x.name.indexOf('a') !== -1);
        // 使用 age 正序排序
        let sorted = filtered.sort((a, b) => a.age - b.age);
        // 投影获取 id
        let result = sorted.map(x => x.id);

        expect(result).toStrictEqual([3, 2]);
    })
});
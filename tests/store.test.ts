import {assert } from "chai";
import {describe} from "mocha";
import {join, store} from "../src/store";

describe('Store tests', () => {
    it('Initial value', () => {
        const expected = 'Hello';
        const msg = store(expected);

        msg.subscribe(val => assert.equal(val, expected));
    })
    it('Set', () => {
        const expected = 'ValueIsSet';
        const msg = store('');

        msg.set(expected);

        msg.subscribe(val => assert.equal(val, expected));
    })
    it('Update', () => {
        const expected = 1 + 10;
        const num = store(1);

        num.update( val => val+10);

        num.subscribe( val =>  assert.equal(val, expected));
    })
    it('Set multiple times', () => {
        const values = [];
        const num = store(0);
        num.subscribe( val => {
            values.push(val);
        });

        num.set(1);
        num.set(2);

        assert.deepEqual(values, [0, 1, 2]);
    })
    it('Unsubscribe', () => {
        const values = [];
        const num = store(0);
        const subscription = num.subscribe( val => {
            values.push(val);
        });
        num.set(1);

        subscription.unsubscribe();
        num.set(2);

        assert.deepEqual(values, [0, 1]);
    })
})

describe('operators', () => {
    it('map', () => {
        const expected = "count: 0";
        const num = store(0);
        const readStore = num.map(num => "count: " + num);
        readStore.subscribe( val => assert.equal(val, expected));
    })
    it('join', () => {
        const source1 = store(5);
        const source2 = store(5);
        const joined = join(get => get(source1) + get(source2));
        let actualValue;

        joined.subscribe( val => actualValue = val);

        assert.equal(actualValue, 10);
        source1.set(10)
        assert.equal(actualValue, 15);
        source2.set(10)
        assert.equal(actualValue, 20);
    })
    it('pick', () => {
        const name = 'Phil';
        const source1 = store({name, age: '33'});

        let actualValue;
        source1.pick("name").subscribe( val => actualValue = val);
        assert.equal(actualValue, name);
    })
    it('snapshot', () => {
        const name = 'Phil';
        const source1 = store(name);
        assert.equal(name, source1.snapshot());
    })
    it('join operator - unsubscribe', () => {
        const expected = 2;
        const source1 = store(1);
        const source2 = store(1);
        const joined = join(get => get(source1) + get(source2));
        let actualValue;

        const subscription = joined.subscribe( val => actualValue = val);
        subscription.unsubscribe()
        source1.set(10)
        source2.set(10)

        assert.equal(actualValue, expected, "actualValue is still 2, because we unsubscribed before settings source1 and source2 to 10");
    })
})
import {assert } from "chai";
import {describe} from "mocha";
import {join, box} from "../src/box";

describe('Box tests', () => {
    it('Initial value', () => {
        const expected = 'Hello';
        const msg = box(expected);

        msg.subscribe(val => assert.equal(val, expected));
    })
    it('Set', () => {
        const expected = 'ValueIsSet';
        const msg = box('');

        msg.set(expected);

        msg.subscribe(val => assert.equal(val, expected));
    })
    it('Update', () => {
        const expected = 1 + 10;
        const num = box(1);

        num.update( val => val+10);

        num.subscribe( val =>  assert.equal(val, expected));
    })
    it('Set multiple times', () => {
        const values = [];
        const num = box(0);
        num.subscribe( val => {
            values.push(val);
        });

        num.set(1);
        num.set(2);

        assert.deepEqual(values, [0, 1, 2]);
    })
    it('Unsubscribe', () => {
        const values = [];
        const num = box(0);
        const subscription = num.subscribe( val => values.push(val));
        num.set(1);

        subscription.unsubscribe();
        num.set(2);

        assert.deepEqual(values, [0, 1]);
        assert.equal(num.getSubscriberCount(), 0);
    })
    it('subscribe, unsubscribe and subscribe', () => {
        let value;
        const num = box(5);
        let subscription = num.subscribe( val => value = val);
        num.set(1);

        subscription.unsubscribe();
        num.set(2);
        num.set(3);
        assert.equal(value, 1, "Nothing happend because unsubscribed")

        num.subscribe( val => {
            value = val;
        });
        assert.equal(value, 3);

    })
})

describe('operators', () => {
    it('map', () => {
        const expected = "count: 0";
        const num = box(0);
        const readBox = num.map(num => "count: " + num);
        readBox.subscribe( val => assert.equal(val, expected));
    })
    it('join', () => {
        const source1 = box(5);
        const source2 = box(5);
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
        const source1 = box({name, age: '33'});

        let actualValue;
        source1.pick("name").subscribe( val => actualValue = val);
        assert.equal(actualValue, name);
    })
    it('snapshot', () => {
        const name = 'Phil';
        const source1 = box(name);
        assert.equal(name, source1.snapshot());
    })
    it('join operator - unsubscribe', () => {
        const expected = 2;
        const source1 = box(1);
        const source2 = box(1);
        const joined = join(get => get(source1) + get(source2));
        let actualValue;

        const subscription = joined.subscribe( val => actualValue = val);
        subscription.unsubscribe()
        source1.set(10)
        source2.set(10)

        assert.equal(actualValue, expected, "actualValue is still 2, because we unsubscribed before settings source1 and source2 to 10");
    })
})
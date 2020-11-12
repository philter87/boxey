import {assert } from "chai";
import {describe} from "mocha";
import {Drop} from "../src/drop";


describe('Store tests', () => {
    it('Initial value', () => {
        const expected = 'Hello';
        const store = new Drop(expected);

        store.subscribe(val => assert.equal(val, expected));
    })
    it('Set', () => {
        const expected = 'ValueIsSet';
        const store = new Drop('');

        store.set(expected);

        store.subscribe(val => assert.equal(val, expected));
    })
    it('Update', () => {
        const expected = 1 + 10;
        const store = new Drop(1);

        store.update( val => val+10);

        store.subscribe( val =>  assert.equal(val, expected));
    })
    it('Set multiple times', () => {
        const values = [];
        const store = new Drop(0);
        store.subscribe( val => {
            values.push(val);
        });

        store.set(1);
        store.set(2);

        assert.deepEqual(values, [0, 1, 2]);
    })
    it('Unsubscribe', () => {
        const values = [];
        const store = new Drop(0);
        const unsubscribe = store.subscribe( val => {
            values.push(val);
        });
        store.set(1);

        unsubscribe();
        store.set(2);

        assert.deepEqual(values, [0, 1]);
    })
    it('to: operator', () => {
        const expected = "count: 0";
        const store = new Drop(0);
        const readStore = store.to(num => "count: " + num);
        readStore.subscribe( val => assert.equal(val, expected));
    })
})
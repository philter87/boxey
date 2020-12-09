import {describe} from "mocha";
import { assert } from "chai";
import {calcArraySum, isArray, isCustomTagFunction, isElement, isNumber, isString, isSubscribable} from "../src/utils";
import {store} from "../src/store";

const ARRAY: any[] = ['aString', ['an array'], store(2)];

describe('utils', () => {
    it('isString', () => {
        const questions = ['bla', '', null, {name: 'bla'}, 123, false, true];
        const answers = [true, true, false, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isString(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it('isString, get length', () => {
        const a = ARRAY[0];
        if (isString(a)) {
            assert.equal(a.toUpperCase(), 'ASTRING');
        }
    })
    it('isArray', () => {
        const questions = [['a'],[1,2,3], [], 1, 'a', null, {name: "Phil"}]
        const answers = [true, true, true, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isArray(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it('isSubscribable', () => {
        const questions = [store(2), store(null), [], 1, "2", null, {name: 'Phil'}];
        const answers = [true, true, false, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isSubscribable(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it('isNode', () => {
        const questions = [{tag: 'div'}, {name: 'Phil'}, 'a', 1, null];
        const answers = [true, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isElement(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it('isNumber', () => {
        const questions = [1, 2, 3, "a string", null, new Date(), false];
        const answers = [true, true, true, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isNumber(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it( 'calcArraySum', () => {
        const arr = [1, 2, 3, 4, 5];
        assert.equal(0, calcArraySum(arr, 0));
        assert.equal(1, calcArraySum(arr, 1));
        assert.equal(3, calcArraySum(arr, 2));
        assert.equal(6, calcArraySum(arr, 3));
        assert.equal(10, calcArraySum(arr, 4));
    })
    it('isCustomTagFunction', () => {
        assert.isTrue(isCustomTagFunction(() => {}))
        assert.isFalse(isCustomTagFunction("bla"))
        assert.isFalse(isCustomTagFunction(new Date()));
    })

})

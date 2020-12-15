import {describe} from "mocha";
import { assert } from "chai";
import {isCustomTagFunction, isNumber, isString, isSubscribable} from "../src/utils";
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
    it('isSubscribable', () => {
        const questions = [store(2), store(null), [], 1, "2", null, {name: 'Phil'}];
        const answers = [true, true, false, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isSubscribable(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it('isNumber', () => {
        const questions = [1, 2, 3, "a string", null, new Date(), false];
        const answers = [true, true, true, false, false, false, false];
        for (let i = 0; i < questions.length; i++){
            assert.equal(isNumber(questions[i]), answers[i], "error on index: " + i)
        }
    })
    it('isCustomTagFunction', () => {
        assert.isTrue(isCustomTagFunction(() => {}))
        assert.isFalse(isCustomTagFunction("bla"))
        assert.isFalse(isCustomTagFunction(new Date()));
    })

})

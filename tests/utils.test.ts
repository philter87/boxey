import {describe} from "mocha";
import { assert } from "chai";
import {isArray, isNode, isString, isSubscribable} from "../src/utils";
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
            assert.equal(isNode(questions[i]), answers[i], "error on index: " + i)
        }
    })

})
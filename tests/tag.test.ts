import { assert } from "chai";
import {describe} from "mocha";
import {div, a, n, VElement} from "../src/vnodes"

const DIV = 'div';
const CLASS_NAME = 'aClass';
const ATTRS =  {class: CLASS_NAME};
const FIRST_CHILD = 'hello';
const SECOND_CHILD = 'world'
const CHILDREN = [FIRST_CHILD, SECOND_CHILD];


function equals(actual: VElement, expected: VElement) {
    assert.deepEqual(actual, expected, JSON.stringify(actual) + " vs " + JSON.stringify(expected));
}

describe('node', () => {
    it('node: three parameters', () => {
        const result = n(DIV, ATTRS, CHILDREN)

        equals(result, {tag: DIV, attr: ATTRS, children: CHILDREN})
    })
    it('node: two parameters', () => {
        const result = n(DIV, ATTRS)

        equals(result, {tag: DIV, attr: ATTRS})
    })
    it('node: two parameters', () => {
        const result = n(DIV, CHILDREN)

        equals(result, {tag: DIV, children: CHILDREN})
    })
    it('node: one parameter', () => {
        const result = n(DIV)

        equals(result, {tag: DIV});
    })
})

describe('div', () => {
    equals(div(ATTRS, CHILDREN), {tag: DIV, attr: ATTRS, children: CHILDREN})
    equals(div(ATTRS), {tag: DIV, attr: ATTRS});
    equals(div(CHILDREN), {tag: DIV, children: CHILDREN});
    equals(div(), {tag: DIV})
})

describe('all tags', () => {
    it('a', () => {
        const anchor = a(ATTRS, CHILDREN)
        assert.deepEqual(anchor, {tag: 'a', attr: ATTRS, children: CHILDREN})
    })
})

describe('is custom tag', () => {
    it('custom tag', () => {
        const TAG = "span";
        const CHILD = "Hello World!";
        const MyComponent = () => n(TAG, [CHILD]);
        const result = n(MyComponent)
        console.log(result);
        assert.equal(result.tag, TAG);
        assert.deepEqual(result.children, [CHILD]);
    })
})
import { assert } from "chai";
import {describe} from "mocha";
import {a, div, n, VNode} from "../src/VNode";

const DIV = 'div';
const CLASS_NAME = 'aClass';
const ATTRS =  {class: CLASS_NAME};
const FIRST_CHILD = 'hello';
const SECOND_CHILD = 'world'
const CHILDREN = [FIRST_CHILD, SECOND_CHILD];


function equals(actual: VNode, expected: VNode) {
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
    it('children array vs children varargs: no attr', () => {
        const array = n(DIV, CHILDREN)
        const varargs = n(DIV, FIRST_CHILD, SECOND_CHILD);
        equals(array, varargs);
    })
    it('children array vs children varargs: with attr', () => {
        const array = n(DIV, ATTRS, CHILDREN)
        const varargs = n(DIV, ATTRS, FIRST_CHILD, SECOND_CHILD);
        equals(array, varargs);
    })
    it('children text and node - 1', () => {
        const array = n(DIV, ATTRS, [div(), 'A'])
        const varargs = n(DIV, ATTRS, div(), 'A');
        equals(array, varargs);
    })
    it('children text and node - 2', () => {
        const array = n(DIV, [div(), 'A'])
        const varargs = n(DIV, div(), 'A');
        equals(array, varargs);
    })
})

describe('div', () => {
    equals(div(ATTRS, CHILDREN), {tag: DIV, attr: ATTRS, children: CHILDREN})
    equals(div(ATTRS, FIRST_CHILD, SECOND_CHILD), {tag: DIV, attr: ATTRS, children: CHILDREN})
    equals(div(ATTRS), {tag: DIV, attr: ATTRS});
    equals(div(CHILDREN), {tag: DIV, children: CHILDREN});
    equals(div(FIRST_CHILD, SECOND_CHILD), {tag: DIV, children: CHILDREN});
    equals(div(), {tag: DIV})
})

describe('all tags', () => {
    it('a', () => {
        const anchor = a(ATTRS, CHILDREN)
        assert.deepEqual(anchor, {tag: 'a', attr: ATTRS, children: CHILDREN})
    })
})
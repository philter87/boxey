import { assert } from "chai";
import {describe} from "mocha";
import {a, div, node} from "../src/elements";

const DIV = 'div';
const CLASS_NAME = 'aClass';
const ATTRS =  {class: CLASS_NAME};
const CHILDREN = ['hello'];

describe('tag', () => {
    it('tag: three parameters', () => {
        const result = node(DIV, ATTRS, CHILDREN)

        assert.equal(result.tag, DIV);
        assert.equal(result.attr.class, CLASS_NAME);
        assert.equal(result.children, CHILDREN);
    })
    it('tag: two parameters', () => {
        const result = node(DIV, ATTRS)

        assert.equal(result.tag, DIV);
        assert.equal(result.attr.class, CLASS_NAME);
        assert.deepEqual(result.children, undefined);
    })
    it('tag: two parameters', () => {
        const result = node(DIV, CHILDREN)

        assert.equal(result.tag, DIV);
        assert.deepEqual(result.attr, undefined);
        assert.deepEqual(result.children, CHILDREN);
    })
    it('tag: one parameter', () => {
        const result = node(DIV)

        assert.equal(result.tag, DIV);
        assert.deepEqual(result.attr, undefined);
        assert.deepEqual(result.children, undefined);
    })
})

describe('div', () => {
    const two = div(ATTRS, CHILDREN);
    const oneAttr = div(ATTRS);
    const oneChildren = div(CHILDREN);
    const noArgs = div();

    assert.deepEqual(two, {tag: DIV, attr: ATTRS, children: CHILDREN})
    assert.deepEqual(oneAttr, {tag: DIV, attr: ATTRS, children: undefined})
    assert.deepEqual(oneChildren, {tag: DIV, attr: undefined, children: CHILDREN})
    assert.deepEqual(noArgs, {tag: DIV, attr: undefined, children: undefined})
})

describe('all tags', () => {
    it('a', () => {
        const anchor = a(ATTRS, CHILDREN)
        assert.deepEqual(anchor, {tag: 'a', attr: ATTRS, children: CHILDREN})
    })
})
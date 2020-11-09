import { assert } from "chai";
import {describe} from "mocha";
import {tag} from "../src/elements";

describe('tag', () => {
    it('tag: three parameters', () => {
        const tagName = 'div';
        const className = 'aClass';
        const children = ['hello'];

        const result = tag(tagName, {class: className}, children)

        assert.equal(result.tag, tagName);
        assert.equal(result.attr.class, className);
        assert.equal(result.children, children);
    })
})
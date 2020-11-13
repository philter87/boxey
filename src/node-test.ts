import {Child, NodeAttributes, Node} from "./elements";

const tags = ['a', 'b', 'c'];

export function nodeTest(tagName: string, attributesOrChildren?: NodeAttributes | Child[], children?: Child[]): Node {
    if (Array.isArray(attributesOrChildren)) {
        return {tag: tagName, attr: undefined, children: attributesOrChildren};
    } else {
        return {tag: tagName, attr: attributesOrChildren, children}
    }
}

const n = {} as {a: string, b: string, c: string};
tags.forEach( tag => n[tag] = tag);

export default n;
export interface NodeAttributes {
    style?: Partial<CSSStyleDeclaration>;
    class?: string;
    hidden?: boolean;
}

export interface Node {
    tag: string;
    attr?: NodeAttributes;
    children?: Child[];
}

export type Child = Node | string;


export function n(tagName: string, attributesOrChildren?: NodeAttributes | Child[], children?: Child[]): Node {
    if (Array.isArray(attributesOrChildren)) {
        return {tag: tagName, attr: undefined, children: attributesOrChildren};
    } else {
        return {tag: tagName, attr: attributesOrChildren, children}
    }
}

export function div(): Node;
export function div(attributes: NodeAttributes): Node;
export function div(children: Child[]): Node;
export function div(attributes: NodeAttributes, children: Child[]): Node;
export function div(attributesOrChildren?: NodeAttributes | Child[], children?: Child[]): Node {
    return n('div', attributesOrChildren, children);
}

export function a(): Node;
export function a(attributes: NodeAttributes): Node;
export function a(children: Child[]): Node;
export function a(attributes: NodeAttributes, children: Child[]): Node;
export function a(attributesOrChildren?: NodeAttributes | Child[], children?: Child[]): Node {
    return n('a', attributesOrChildren, children);
}

export function button(): Node;
export function button(attributes: NodeAttributes): Node;
export function button(children: Child[]): Node;
export function button(attributes: NodeAttributes, children: Child[]): Node;
export function button(attributesOrChildren?: NodeAttributes | Child[], children?: Child[]): Node {
    return n('button', attributesOrChildren, children);
}

/*
export function insert_something(): Tag;
export function insert_something(attributes: ElementAttr): Tag;
export function insert_something(children: Child[]): Tag;
export function insert_something(attributes: ElementAttr, children: Child[]): Tag;
export function insert_something(attributesOrChildren?: ElementAttr | Child[], children?: Child[]): Tag {
    return tag(, attributesOrChildren, children);
}
*/
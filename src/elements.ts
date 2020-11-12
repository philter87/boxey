interface ElementAttr {
    style?: Partial<CSSStyleDeclaration>;
    class?: string;
    hidden?: boolean;
}

export interface Tag {
    tag: string;
    attr?: ElementAttr;
    children?: Child[];
}

export type Child = Tag | string;


export function tag(tagName: string, attributesOrChildren?: ElementAttr | Child[], children?: Child[]): Tag {
    if (Array.isArray(attributesOrChildren)) {
        return {tag: tagName, attr: undefined, children: attributesOrChildren};
    } else {
        return {tag: tagName, attr: attributesOrChildren, children}
    }
}

export function div(): Tag;
export function div(attributes: ElementAttr): Tag;
export function div(children: Child[]): Tag;
export function div(attributes: ElementAttr, children: Child[]): Tag;
export function div(attributesOrChildren?: ElementAttr | Child[], children?: Child[]): Tag {
    return tag('div', attributesOrChildren, children);
}

export function a(): Tag;
export function a(attributes: ElementAttr): Tag;
export function a(children: Child[]): Tag;
export function a(attributes: ElementAttr, children: Child[]): Tag;
export function a(attributesOrChildren?: ElementAttr | Child[], children?: Child[]): Tag {
    return tag('a', attributesOrChildren, children);
}

export function button(): Tag;
export function button(attributes: ElementAttr): Tag;
export function button(children: Child[]): Tag;
export function button(attributes: ElementAttr, children: Child[]): Tag;
export function button(attributesOrChildren?: ElementAttr | Child[], children?: Child[]): Tag {
    return tag('button', attributesOrChildren, children);
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
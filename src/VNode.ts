export interface NodeAttributes {
    style?: Partial<CSSStyleDeclaration>;
    class?: string;
    hidden?: boolean;
}

export interface VNode {
    tag: string;
    attr?: NodeAttributes;
    children?: Child[];
}

export type Child = VNode | string;

export function n(tag: string, ...args: any[]): VNode {
    if(args.length == 0) return {tag};
    const first = args[0];
    const isChild = !!first.tag || Array.isArray(first) || "string" === (typeof first)
    if (isChild) {
        const children = Array.isArray(first) ? first : args;
        return {tag, children};
    } else {
        const attr = first;
        const second = args[1];
        if(!second) {
            return {tag, attr};
        }
        const children = Array.isArray(second) ? second : args.slice(1);
        return {tag, attr, children};
    }
}

export function div(): VNode;
export function div(attributes: NodeAttributes): VNode;
export function div(children: Child[]): VNode;
export function div(...children: Child[]): VNode;
export function div(attributes: NodeAttributes, children: Child[]): VNode;
export function div(attributes: NodeAttributes, ...children: Child[]): VNode;
export function div(...args: any[]): VNode {
    return n('div', ...args);
}

export function a(): VNode;
export function a(attributes: NodeAttributes): VNode;
export function a(children: Child[]): VNode;
export function a(...children: Child[]): VNode;
export function a(attributes: NodeAttributes, children: Child[]): VNode;
export function a(attributes: NodeAttributes, ...children: Child[]): VNode;
export function a(...args: any[]): VNode {
    return n('a', ...args);
}

export function button(): VNode;
export function button(attributes: NodeAttributes): VNode;
export function button(children: Child[]): VNode;
export function button(...children: Child[]): VNode;
export function button(attributes: NodeAttributes, children: Child[]): VNode;
export function button(attributes: NodeAttributes, ...children: Child[]): VNode;
export function button(...args: any[]): VNode {
    return n('button', ...args);
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
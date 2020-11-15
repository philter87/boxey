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
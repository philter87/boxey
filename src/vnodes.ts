import {Subscribable} from "./store";
import {isArray, isElement, isNumber, isString, isSubscribable, isCustomTagFunction} from "./utils";

export const FRAGMENT = "fragment";

type CssKey = keyof CSSStyleDeclaration;


type CssStyle = {
    [key in CssKey]?: Subscribable<string> | string;
};

export interface AnchorAttributes extends NodeAttributes {
    href?: string;
}

export interface InputAttributes extends NodeAttributes {
    value: Subscribable<string> | string;
}

export interface NodeAttributes extends Partial<GlobalEventHandlers> {
    style?: CssStyle;
    class?: string;
    hidden?: boolean;
}

export interface VElement {
    tag: string;
    attr?: NodeAttributes;
    children?: Child[];
}

export type VNode = VElement | string | number;

export type Child = VNode | VNode[] | Subscribable<VNode | VNode[] | null>;

function ni(tag: string, args: any[]): VElement {
    if (args.length == 0) return {tag};
    args = args.map( a => isNumber(a) ? a.toString() : a);

    const first = args[0];
    const isChildLike = isElement(first) || isArray(first) || isString(first) || isSubscribable(first);
    if (isChildLike) {
        const children = isArray(first) ? first : args;
        return {tag, children};
    } else {
        const attr = first;
        const second = args[1];
        if (!second) {
            return {tag, attr};
        }
        const children = isArray(second) ? second : args.slice(1);
        return {tag, attr, children};
    }
}

export type CustomTagFunction = (...args: any[]) => VElement;

export function fragment(...children: any[]): VElement {
    return {tag: FRAGMENT, children}
}

export function n(tag: string | CustomTagFunction, ...args: any[]): VElement {
    if(isCustomTagFunction(tag)) {
        return tag(args);
    }
    return ni(tag, args);
}

const nn = (tag: string) => (...args: any[]) => ni(tag, args);

type TagOverloads<A> = {
    (attributes: A): VElement;
    (children: Child[]): VElement;
    (...children: Child[]): VElement;
    (attributes: A, children: Child[]): VElement;
    (attributes: A, ...children: Child[]): VElement;
}

export const a: TagOverloads<NodeAttributes> = nn('a');
export const b: TagOverloads<NodeAttributes> = nn('b');
export const body: TagOverloads<NodeAttributes> = nn('body');
export const br: TagOverloads<NodeAttributes> = nn('br');
export const button: TagOverloads<NodeAttributes> = nn('button');
export const canvas: TagOverloads<NodeAttributes> = nn('canvas');
export const code: TagOverloads<NodeAttributes> = nn('code');
export const div: TagOverloads<NodeAttributes> = nn('div');
export const form: TagOverloads<NodeAttributes> = nn('form');
export const h1: TagOverloads<NodeAttributes> = nn('h1');
export const h2: TagOverloads<NodeAttributes> = nn('h2');
export const h3: TagOverloads<NodeAttributes> = nn('h3');
export const h4: TagOverloads<NodeAttributes> = nn('h4');
export const h5: TagOverloads<NodeAttributes> = nn('h5');
export const h6: TagOverloads<NodeAttributes> = nn('h6');
export const img: TagOverloads<NodeAttributes> = nn('img');
export const input: TagOverloads<InputAttributes> = nn('input');
export const label: TagOverloads<NodeAttributes> = nn('label');
export const legend: TagOverloads<NodeAttributes> = nn('legend');
export const li: TagOverloads<NodeAttributes> = nn('li');
export const meta: TagOverloads<NodeAttributes> = nn('meta');
export const ol: TagOverloads<NodeAttributes> = nn('ol');
export const option: TagOverloads<NodeAttributes> = nn('option');
export const p: TagOverloads<NodeAttributes> = nn('p');
export const span: TagOverloads<NodeAttributes> = nn('span');
export const select: TagOverloads<NodeAttributes> = nn('select');
export const table: TagOverloads<NodeAttributes> = nn('table');
export const tbody: TagOverloads<NodeAttributes> = nn('tbody');
export const td: TagOverloads<NodeAttributes> = nn('td');
export const textarea: TagOverloads<NodeAttributes> = nn('textarea');
export const th: TagOverloads<NodeAttributes> = nn('th');
export const thead: TagOverloads<NodeAttributes> = nn('thead');
export const title: TagOverloads<NodeAttributes> = nn('title');
export const tr: TagOverloads<NodeAttributes> = nn('tr');
export const ul: TagOverloads<NodeAttributes> = nn('ul');
export const video: TagOverloads<NodeAttributes> = nn('video');
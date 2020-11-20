import {Store, Subscribable} from "./store";
import {isArray, isElement, isString, isSubscribable} from "./utils";

type CssKey = keyof CSSStyleDeclaration;


type CssStyle = {
    [key in CssKey]?: Store<string> | string;
};

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

export type VNode = VElement | string;

export type Child = VNode | VNode[] | Subscribable<VNode | VNode[] | null>;

function ni(tag: string, args: any[]): VElement {
    if (args.length == 0) return {tag};
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

export function n(tag: string, ...args: any[]): VElement {
    return ni(tag, args);
}

const nn = (tag: string) => (...args: any[]) => ni(tag, args);

type TagOverloads = {
    (attributes: NodeAttributes): VElement;
    (children: Child[]): VElement;
    (...children: Child[]): VElement;
    (attributes: NodeAttributes, children: Child[]): VElement;
    (attributes: NodeAttributes, ...children: Child[]): VElement;
}

export const a: TagOverloads = nn('a');
export const b: TagOverloads = nn('b');
export const body: TagOverloads = nn('body');
export const br: TagOverloads = nn('br');
export const button: TagOverloads = nn('button');
export const canvas: TagOverloads = nn('canvas');
export const code: TagOverloads = nn('code');
export const div: TagOverloads = nn('div');
export const form: TagOverloads = nn('form');
export const h1: TagOverloads = nn('h1');
export const h2: TagOverloads = nn('h2');
export const h3: TagOverloads = nn('h3');
export const h4: TagOverloads = nn('h4');
export const h5: TagOverloads = nn('h5');
export const h6: TagOverloads = nn('h6');
export const img: TagOverloads = nn('img');
export const input: TagOverloads = nn('input');
export const label: TagOverloads = nn('label');
export const legend: TagOverloads = nn('legend');
export const li: TagOverloads = nn('li');
export const meta: TagOverloads = nn('meta');
export const ol: TagOverloads = nn('ol');
export const option: TagOverloads = nn('option');
export const p: TagOverloads = nn('p');
export const span: TagOverloads = nn('span');
export const select: TagOverloads = nn('select');
export const table: TagOverloads = nn('table');
export const tbody: TagOverloads = nn('tbody');
export const td: TagOverloads = nn('td');
export const textarea: TagOverloads = nn('textarea');
export const th: TagOverloads = nn('th');
export const thead: TagOverloads = nn('thead');
export const title: TagOverloads = nn('title');
export const tr: TagOverloads = nn('tr');
export const ul: TagOverloads = nn('ul');
export const video: TagOverloads = nn('video');
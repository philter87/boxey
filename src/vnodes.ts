import {Subscribable} from "./store";
import {isCustomTagFunction, isElement, isNumber, isString, isSubscribable} from "./utils";
import {AnchorHTMLAttributes, HTMLAttributes, InputHTMLAttributes} from "./vnode-attributes";

export interface VElement {
    tag: string;
    attr?: HTMLAttributes<HTMLElement>;
    children?: Child[];
}

export type VNode = VElement | string | number;

export type Child = VNode | VNode[] | Subscribable<VNode | VNode[] | null>;

function ni(tag: string, args: any[]): VElement {
    if (args.length == 0) return {tag};
    const first = args[0];
    const isChildLike = isElement(first) || Array.isArray(first) || isString(first) || isNumber(first) || isSubscribable(first);
    if (isChildLike) {
        const children = Array.isArray(first) ? first : args;
        return {tag, children};
    } else {
        const attr = first;
        const second = args[1];
        if (!second) {
            return {tag, attr};
        }
        const children = Array.isArray(second) ? second : args.slice(1);
        return {tag, attr, children};
    }
}

export type CustomTagFunction = (...args: any[]) => VElement;

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

export const a: TagOverloads<AnchorHTMLAttributes<HTMLAnchorElement>> = nn('a');
export const b: TagOverloads<HTMLAttributes<HTMLElement>> = nn('b');
export const body: TagOverloads<HTMLAttributes<HTMLElement>> = nn('body');
export const br: TagOverloads<HTMLAttributes<HTMLElement>> = nn('br');
export const button: TagOverloads<HTMLAttributes<HTMLElement>> = nn('button');
export const canvas: TagOverloads<HTMLAttributes<HTMLElement>> = nn('canvas');
export const code: TagOverloads<HTMLAttributes<HTMLElement>> = nn('code');
export const div: TagOverloads<HTMLAttributes<HTMLElement>> = nn('div');
export const form: TagOverloads<HTMLAttributes<HTMLElement>> = nn('form');
export const h1: TagOverloads<HTMLAttributes<HTMLElement>> = nn('h1');
export const h2: TagOverloads<HTMLAttributes<HTMLElement>> = nn('h2');
export const h3: TagOverloads<HTMLAttributes<HTMLElement>> = nn('h3');
export const h4: TagOverloads<HTMLAttributes<HTMLElement>> = nn('h4');
export const h5: TagOverloads<HTMLAttributes<HTMLElement>> = nn('h5');
export const h6: TagOverloads<HTMLAttributes<HTMLElement>> = nn('h6');
export const img: TagOverloads<HTMLAttributes<HTMLElement>> = nn('img');
export const input: TagOverloads<InputHTMLAttributes<HTMLInputElement>> = nn('input');
export const label: TagOverloads<HTMLAttributes<HTMLElement>> = nn('label');
export const legend: TagOverloads<HTMLAttributes<HTMLElement>> = nn('legend');
export const li: TagOverloads<HTMLAttributes<HTMLElement>> = nn('li');
export const meta: TagOverloads<HTMLAttributes<HTMLElement>> = nn('meta');
export const ol: TagOverloads<HTMLAttributes<HTMLElement>> = nn('ol');
export const option: TagOverloads<HTMLAttributes<HTMLElement>> = nn('option');
export const p: TagOverloads<HTMLAttributes<HTMLElement>> = nn('p');
export const span: TagOverloads<HTMLAttributes<HTMLElement>> = nn('span');
export const select: TagOverloads<HTMLAttributes<HTMLElement>> = nn('select');
export const table: TagOverloads<HTMLAttributes<HTMLElement>> = nn('table');
export const tbody: TagOverloads<HTMLAttributes<HTMLElement>> = nn('tbody');
export const td: TagOverloads<HTMLAttributes<HTMLElement>> = nn('td');
export const textarea: TagOverloads<HTMLAttributes<HTMLElement>> = nn('textarea');
export const th: TagOverloads<HTMLAttributes<HTMLElement>> = nn('th');
export const thead: TagOverloads<HTMLAttributes<HTMLElement>> = nn('thead');
export const title: TagOverloads<HTMLAttributes<HTMLElement>> = nn('title');
export const tr: TagOverloads<HTMLAttributes<HTMLElement>> = nn('tr');
export const ul: TagOverloads<HTMLAttributes<HTMLElement>> = nn('ul');
export const video: TagOverloads<HTMLAttributes<HTMLElement>> = nn('video');
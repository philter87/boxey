import {Child, n, NodeAttributes, VNode} from "./VNode";

type TagOverloads = {
    (attributes: NodeAttributes): VNode;
    (children: Child[]): VNode;
    (...children: Child[]): VNode;
    (attributes: NodeAttributes, children: Child[]): VNode;
    (attributes: NodeAttributes, ...children: Child[]): VNode;
}

const tags = ['a','b', 'body', 'br', 'canvas', 'code', 'button', 'div', 'em', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'label', 'legend', 'li', 'meta','ol', 'option', 'p', 'pre', 'script','select','span','strong','style','svg','table','tbody','td', 'textarea', 'th', 'thead', 'title', 'tr', 'ul', 'video']

interface VNodes {
    [x: string]: TagOverloads;
}

let v = {} as VNodes;
tags.forEach( tag => v[tag] = (...args: any[]) => n(tag, ...args))
export const {a,b, body, br, canvas, code, button, div, em, footer, form, h1, h2, h3, h4, h5, h6, head, header, hr, html, i, iframe, img, input, label, legend, li, meta,ol, option, p, pre, script,select,span,strong,style,svg,table,tbody,td, textarea, th, thead, title, tr, ul, video} = v;
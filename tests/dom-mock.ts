import { JSDOM } from 'jsdom'
import {VElement} from "../src/vnodes";
import {dotRender} from "../src/render-engine";

declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
        }
    }
}

export const ROOT_ID = "rootId"
export const initDomMock = () => {
    const { window } = new JSDOM('<!doctype html><html><body><div id="' + ROOT_ID +'"></div></body></html>');
    global.document = window.document;
}

export const render = (node: VElement, root?: HTMLElement) => {
    let target = root || document.createElement("div");
    dotRender(node, target);
    return target.firstChild as HTMLElement;
}

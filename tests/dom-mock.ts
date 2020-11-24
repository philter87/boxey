import { JSDOM } from 'jsdom'
import {VElement} from "../src/VNodes";
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

export const initDomMock = () => {
    const { window } = new JSDOM('<!doctype html><html><body></body></html>');
    global.document = window.document;
}

export const render = (node: VElement) => {
    const target = dotRender(node, document.createElement('div'))
    return target.firstChild as HTMLElement;
}

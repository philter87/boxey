import {describe} from "mocha";
import {RenderEngine} from "../src/render-engine";
import {div, VNode} from "../src/VNodes";
import { JSDOM } from 'jsdom'
import { assert } from "chai";
import {store} from "../src/store";

declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
        }
    }
}

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;
// global.window = global.document.defaultView;

const render = (node: VNode) => {
    const target = document.createElement('div');
    new RenderEngine(node, target).initialRender()
    return target;
}

describe('render-engine', () => {
    it('mock-document', () => {
        const target = document.createElement('div');
        target.appendChild(document.createElement('div'));

        assert.equal(target.childElementCount, 1);
        assert.equal(target.innerHTML,'<div></div>')
    })
    it('initialRender, no children', () => {
        const elements = div({class: 'hello', style:{height: '100px'}});

        const target = render(elements);

        assert.equal(target.childElementCount, 1);
        assert.equal(target.innerHTML, '<div class="hello" style="height: 100px;"></div>')
    })
    it('initialRender, text child', () => {
        const text = 'TextNode';
        const elements = div([text]);

        const target = render(elements)

        assert.equal(target.innerHTML, '<div>' + text + '</div>');

    })
    it('initialRender, two div children', () => {
        const elements = div({class: 'root'}, [
            div(['First']),
            div(['Second']),
        ]);

        const target = render(elements)

        assert.equal(target.childElementCount, 1);
        assert.equal(target.children[0].children.length, 2);
    })
    it('style from store', () => {
        const dot = store("100px");
        const node = div({style: {height: dot}})

        const target = render(node)

        assert.equal(target.innerHTML,'<div style="height: 100px;"></div>')
    })
    it('style from dot change', () => {
        const dot = store("100px");
        const node = div({style: {height: dot}})

        const target = render(node)
        dot.set("200px")

        assert.equal(target.innerHTML,'<div style="height: 200px;"></div>')
    })
})
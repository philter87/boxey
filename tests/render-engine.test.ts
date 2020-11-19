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
    return target.firstElementChild as HTMLElement;
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

        assert.equal(target.className, "hello");
        assert.equal(target.style.height, "100px");
    })
    it('initialRender, text child', () => {
        const text = 'TextNode';
        const elements = div([text]);

        const target = render(elements)

        assert.equal(target.innerHTML, text);

    })
    it('initialRender, two div children', () => {
        const elements = div({class: 'root'}, [
            div(['First']),
            div(['Second']),
        ]);

        const target = render(elements)

        assert.equal(target.children.length, 2);
    })
    it('style from store', () => {
        const height = "100px";
        const dot = store(height);
        const node = div({style: {height: dot}})

        const target = render(node)

        assert.equal(target.style.height, height)
    })
    it('style from dot change', () => {
        const firstHeight = "100px";
        const dot = store(firstHeight);
        const node = div({style: {height: dot}})

        const target = render(node)
        const secondHeight = "200px";
        dot.set(secondHeight)

        assert.equal(target.style.height, secondHeight);
    })
    it('hidden attr', () => {
        const node = div({hidden: true});

        const target = render(node)

        assert.equal(target.hidden, true);
    })
    it('click event change style.height', () => {
        const height1 = '100px';
        const height2 = '200px';

        const height$ = store(height1);
        const onclick = () => height$.set(height2);
        const node = div({style: {height: height$}, onclick});

        const target = render(node)

        assert.equal(target.style.height, height1);
        target.click();
        assert.equal(target.style.height, height2);
    })
})
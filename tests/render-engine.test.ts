import {describe} from "mocha";
import {RenderEngine} from "../src/render-engine";
import {div} from "../src/VNodes";
import { JSDOM } from 'jsdom'
import { assert } from "chai";

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

describe('render-engine', () => {
    it('mock-document', () => {
        const target = document.createElement('div');
        target.appendChild(document.createElement('div'));

        assert.equal(target.childElementCount, 1);
        assert.equal(target.innerHTML,'<div></div>')
    })
    it('initialRender, no children', () => {
        const target = document.createElement('div');
        const elements = div({class: 'hello', style:{height: '100px'}});

        new RenderEngine(elements, target).initialRender();

        assert.equal(target.childElementCount, 1);
        assert.equal(target.innerHTML, '<div class="hello" style="height: 100px;"></div>')
    })
    it('initialRender, text child', () => {
        const text = 'TextNode';
        const target = document.createElement('div');
        const elements = div([text]);

        new RenderEngine(elements, target).initialRender();

        assert.equal(target.innerHTML, '<div>' + text + '</div>');

    })
    it('initialRender, two div children', () => {
        const target = document.createElement('div');
        const elements = div({class: 'root'}, [
            div(['First']),
            div(['Second']),
        ]);

        new RenderEngine(elements, target).initialRender();
        assert.equal(target.childElementCount, 1);
        assert.equal(target.children[0].children.length, 2);
    })
})
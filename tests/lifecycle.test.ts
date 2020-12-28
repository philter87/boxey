import {describe} from "mocha";
import {assert} from "chai";
import {div, span} from "../src/vnodes";
import {initDomMock, render, ROOT_ID} from "./dom-mock";
import {box} from "../src/box";

// mocking document with jsdom
initDomMock();

const id = "divId";
describe('lifecycle', () => {
    it('onRendered', () => {
        const root = document.createElement("div");
        let isCalled = false;
        const el = div({id, onRendered: (el) => {
            isCalled = true;
            assert.equal(id, root.children[0].id, "Testing if the child is actually rendered")
        }});

        render(el, root);
        assert.isTrue(isCalled);
    })
    it('onRendered, nested', () => {
        const root = document.createElement("div");
        let isCalled = false;
        const el = span(span({id, onRendered: (el) => {
                isCalled = true;
                console.log(root.innerHTML)
                assert.equal(id, root.children[0].children[0].id);
            }}));

        const target = render(el, root);
        assert.isTrue(isCalled);
    })
    // TODO test is excluded because something is wrong with onRendered on the firstNode. This requires a redesign.
    xit('onRendered when using a box', () => {
        const idSecond = id+"2";
        const rootNode = document.createElement("div");
        const firstNode = div({
            id,
            onRendered: (el) => assert.equal(rootNode.children[0].children[0].id, id)}
        );
        const secondNode = span({id: idSecond, onRendered: (el) => assert.equal(rootNode.children[0].children[0].id, idSecond)} );
        const selectedNode$ = box(firstNode);

        const target = render(div(selectedNode$), rootNode);

        selectedNode$.set(secondNode);
    })
})
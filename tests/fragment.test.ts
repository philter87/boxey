

// Fragment is not enabled but this is how it would look. We have some issues with implementing it

import {FRAGMENT} from "../src/constants";
import {describe} from "mocha";
import {assert} from "chai";
import {initDomMock, render} from "./dom-mock";
import {div, VElement, VNode} from "../src/vnodes";
import {box} from "../src/box";
import {dotRender} from "../src/render-engine";

// mocking document with jsdom
initDomMock();


function fragment(...children: any[]): VElement {
    return {tag: FRAGMENT, children}
}

describe('fragment',() => {
    it('fragment in root', () => {
        const target = dotRender(fragment(1,2,3), document.createElement('div'));

        assert.equal(target.innerHTML, "123")
    })
    it('simple', () => {
        const frag = fragment(1,2,3);

        const target = render(div(frag));

        assert.equal(target.innerHTML, "123");
    })
    it('simple with store', () => {
        const num$ = box(2);
        const frag = fragment(1, num$, "3");

        const target = render(div(frag));

        assert.equal(target.innerHTML, "123");
        num$.set(3)
        assert.equal(target.innerHTML, "133");
    })
    it('fragment in store', () => {
        const frag = fragment("1","2","3", div("4"), [1, 2]);
        const fragInnerHtml = "123<div>4</div>12";
        const el$ = box<VNode | VNode[]>(frag);

        const target = render(div(el$));
        assert.equal(target.innerHTML, fragInnerHtml);
        el$.set(div("World!"))
        assert.equal(target.innerHTML, "<div>World!</div>");
        el$.set(frag)
        assert.equal(target.innerHTML, fragInnerHtml);
    })
    it('store in fragment in store', () => {
        const num$ = box(0)
        const show$ = box(true);
        const el = div(show$.map( s => s ? fragment(1, num$) : null));

        const target = render(el);

        assert.equal(num$.getSubscriberCount(), 1);
        show$.set(false);
        assert.equal(num$.getSubscriberCount(), 0);
    })
    it('fragment with multiple stores', () => {
        const num0$ = box(-1)
        const num1$ = box(-1)
        const num2$ = box(-1)
        const el = div(fragment(num0$, num1$, num2$), 3)

        const target = render(el);
        num0$.set(0);
        num1$.set(1);
        num2$.set(2);

        assert.equal(target.innerHTML, "0123")
    })
    it('double nested fragment with stores', () => {
        const num$ = box(0)
        const el = div(fragment(fragment(1, num$),3), 4);

        const target = render(el);
        num$.set(2);

        assert.equal(target.innerHTML, "1234")
    })
})
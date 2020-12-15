// Fragment is not enabled but this is how it would look. We have some issues with implementing it

import {FRAGMENT} from "../src/constants";
import {describe} from "mocha";
import {assert, expect} from "chai";
import {render} from "./dom-mock";
import {div, VElement} from "../src/vnodes";
import {store} from "../src/store";

function fragment(...children: any[]): VElement {
    return {tag: FRAGMENT, children}
}

describe('fragment',() => {
    xit('fragment in root is not allowed', () => {
        const frag = fragment(1,2,3);

        expect(() => render(frag)).to.throw('Root element is not allowed to be a fragment')
    })
    xit('simple', () => {
        const frag = fragment(1,2,3);

        const target = render(div([frag]));

        assert.equal(target.innerHTML, "123");
    })
    xit('simple with store', () => {
        const num$ = store(2);
        const frag = fragment(1, num$, "3");

        const target = render(div([frag]));

        assert.equal(target.innerHTML, "123");
        num$.set(3)
        assert.equal(target.innerHTML, "133");
    })
    xit('fragment in store', () => {
        const el$ = store(div(["Hello"]));

        const target = render(div([el$]));

        assert.equal(target.children[0].innerHTML, "Hello");
        el$.set(fragment("1","2","3"))
        assert.equal(target.children[0].innerHTML, "123");
        el$.set(div([]))
        assert.equal(target.children[0].innerHTML, "World");
    })

})
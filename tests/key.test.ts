import {describe} from "mocha";
import {div} from "../src/vnodes";
import {store} from "../src/store";
import {initDomMock, render} from "./dom-mock";

// mocking document with jsdom
initDomMock();

describe('key in list', () => {
    it('div list', () => {
        const elements = [div({key: "1"}, 1), div({key: "2"}, 2)];
        const elements$ = store(elements)

        const target = render(div(elements$))
        for(let i = 0; i < target.children.length; i++) {
            target.children[i].className = i+"";
        }


        console.log(target.innerHTML);

    })
})
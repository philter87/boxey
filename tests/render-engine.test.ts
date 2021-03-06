import {describe} from "mocha";
import {a, button, Child, div, h1, input, p, span, VNode} from "../src/vnodes";
import { assert, expect } from "chai";
import {box} from "../src/box";
import {initDomMock, render} from "./dom-mock";

// mocking document with jsdom
initDomMock();

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
    it('number node', () => {
        const element = div(1, [2,3], box(4));

        const target = render(element);

        assert.equal(target.innerHTML, "1234");
    })
    it('number zero box', () => {
        const element = div(box(0));

        const target = render(element);

        assert.equal(target.innerHTML, "0");
    })
    it('number zero node', () => {
        const element = div(0, "-", [0], "-", box(0), "-", "0");

        const target = render(element);

        assert.equal(target.innerHTML, "0-0-0-0");
    })
    it('initialRender, two div children', () => {
        const elements = div({class: 'root'}, [
            div(['First']),
            div(['Second']),
        ]);

        const target = render(elements)

        assert.equal(target.children.length, 2);
    })
    it('style from box', () => {
        const height = "100px";
        const dot = box(height);
        const node = div({style: {height: dot}})

        const target = render(node)

        assert.equal(target.style.height, height)
    })
    it('class from box', () => {
        const className$ = box("1");
        const node = div({class: className$})

        const target = render(node)

        assert.equal(target.className, "1")
        className$.set("2")
        assert.equal(target.className, "2")
    })
    it('style from dot change', () => {
        const firstHeight = "100px";
        const dot = box(firstHeight);
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

        const height$ = box(height1);
        const onclick = () => height$.set(height2);
        const node = div({style: {height: height$}, onclick});

        const target = render(node)

        assert.equal(target.style.height, height1);
        target.click();
        assert.equal(target.style.height, height2);
    })
    it('child in box', () => {
        const div$ = box(div());
        const node = div(div$)

        const target = render(node);

        assert.equal(target.firstElementChild.tagName, 'DIV');
    })
    it('child replaced with box change', () => {
        const show = box(true);
        const node = div([
            show.map( b => b ? div() : span())
        ])

        const target = render(node);
        assert.equal(target.firstElementChild.tagName, 'DIV');
        show.set(false);
        assert.equal(target.firstElementChild.tagName, 'SPAN');
    })
    it('one of three children is replaced with box change', () => {
        const show = box(true);
        const node = div([
            a(),
            show.map( b => b ? div() : span()),
            a(),
        ])

        const target = render(node);
        assert.equal(target.children[1].tagName, 'DIV');
        show.set(false);
        assert.equal(target.children[1].tagName, 'SPAN');
    })
    it('child with subscriptions is replaced by one without', () => {
        const show$ = box(true);
        const str$ = box("Hello World");
        const height$ = box('100px');
        const node = div(show$.map( show => show ? div({style: {height: height$}}, str$): span()))

        render(node);

        assert.equal(str$.getSubscriberCount(), 1);
        assert.equal(height$.getSubscriberCount(), 1);

        show$.set(false);
        assert.equal(str$.getSubscriberCount(), 0);
        assert.equal(height$.getSubscriberCount(), 0);
    })
    it('child with subscriptions is replaced', () => {
        const show$ = box(true);
        const height$ = box('100px');
        const nestedEl$ = box(div("Hi"));
        const node = div(show$.map( show => show ? div(div({style: {height: height$}}), nestedEl$): span()))

        render(node);

        show$.set(false);
        assert.equal(height$.getSubscriberCount(), 0);
        assert.equal(nestedEl$.getSubscriberCount(), 0);
    })
    it('array child with subscriptions is replaced', () => {
        const show$ = box(false);
        const height$ = box('100px');
        const node = div(show$.map( show => show ? [div({style:{height: height$}})]: span()))

        render(node);

        assert.equal(height$.getSubscriberCount(), 0);
        show$.set(true);
        assert.equal(height$.getSubscriberCount(), 1);
    })
    it('allow first child to be null', () => {
        const show$ = box(false);
        const node = div(
            show$.map( show => show ? div() : null),
            a()
        )

        const target = render(node);

        assert.equal(target.childNodes.length, 1);
        show$.set(true);
        assert.equal(target.childNodes.length, 2);
        assert.equal(target.children[0].tagName, 'DIV');
    })
    it('allow second child to be null', () => {
        const show$ = box(false);
        const node = div(
            a(),
            show$.map( show => show ? div() : null),
            a()
        )

        const target = render(node);

        assert.equal(target.childNodes.length, 2);
        show$.set(true);
        assert.equal(target.children[1].tagName, 'DIV');
    })
    it('allow third child to be null', () => {
        const show$ = box(false);
        const node = div(
            a(),
            a(),
            show$.map( show => show ? div() : null),
        )

        const target = render(node);

        assert.equal(target.childNodes.length, 2);
        show$.set(true);
        assert.equal(target.children[2].tagName, 'DIV');
    })
    it('from div to null', () => {
        const show$ = box(true);
        const height$ = box('100px');
        const node = div(
            show$.map( show => show ? div({style: {height: height$}}) : null),
        )

        const target = render(node);
        show$.set(false);

        assert.equal(height$.getSubscriberCount(), 0);
        assert.equal(target.children.length, 0);
    })
    it('text nodes allow null', () => {
        const text$ = box<string | null>(null);

        const node = div(
            div('S','S','S'),
            div(text$, 'S','S'),
            div('S',text$, 'S'),
            div('S', 'S', text$),
        );

        const target = render(node);

        assert.equal(target.childNodes[0].textContent, 'SSS');
        assert.equal(target.childNodes[1].textContent, 'SS');
        assert.equal(target.childNodes[2].textContent, 'SS');
        assert.equal(target.childNodes[3].textContent, 'SS');

        text$.set('D')
        assert.equal(target.childNodes[0].textContent, 'SSS');
        assert.equal(target.childNodes[1].textContent, 'DSS');
        assert.equal(target.childNodes[2].textContent, 'SDS');
        assert.equal(target.childNodes[3].textContent, 'SSD');
    })
    it('A list child', () => {
        const node = div(
            "A",
            ["B","C","D"],
            "E"
        );

        const target = render(node);

        assert.equal(target.innerHTML, "ABCDE")
    })
    it('dot list', () => {
        const divs = box([div(), div(), div()]);
        const node = div([
            a(),
            divs,
            a()
        ]);

        const target = render(node);

        assert.equal(target.children.length, 5);
        assert.equal(target.children[0].tagName, 'A')
        assert.equal(target.children[1].tagName, 'DIV')
        assert.equal(target.children[2].tagName, 'DIV')
        assert.equal(target.children[3].tagName, 'DIV')
        assert.equal(target.children[4].tagName, 'A')
    })
    it('a dynamic list', () => {
        const nodes$ = box([div(), div(), div()]);
        const node = div([
            a(),
            nodes$,
            a()
        ]);

        const target = render(node);
        nodes$.set([span(), span()])

        assert.equal(target.children.length, 4);
        assert.equal(target.children[0].tagName, 'A')
        assert.equal(target.children[1].tagName, 'SPAN')
        assert.equal(target.children[2].tagName, 'SPAN')
        assert.equal(target.children[3].tagName, 'A')
    })
    it('three dynamic lists', () => {
        const nodes$1 = box([div(),div()]);
        const nodes$2 = box([a(), a(), a()]);
        const nodes$3 = box([span(), span(), span()]);
        const node = div([
            nodes$1,
            nodes$2,
            nodes$3,
        ]);

        const target = render(node);
        nodes$3.set([h1()])
        nodes$2.set([p()])
        nodes$1.set([button()])

        assert.equal(target.children.length, 3);
        assert.equal(target.children[0].tagName, 'BUTTON')
        assert.equal(target.children[1].tagName, 'P')
        assert.equal(target.children[2].tagName, 'H1')
    })
})

describe('tag types', () => {
    it('input static', () => {
        const value = "Something";
        const node = input({value})

        const target = render(node);

        // @ts-ignore
        assert.equal(target.value, value)
    })
    it('input box', () => {
        const value = box("Something");
        const node = input({value})

        const target = render(node);
        value.set("NewValue");

        // @ts-ignore
        assert.equal(target.value, "NewValue")
    })
})


import * as url from "url";
import {describe} from "mocha";
import {Location, Router} from "../src/router";
import {assert} from "chai";
import {div} from "../src/VNodes";
import {initDomMock, render} from "./dom-mock";

const HOST_NAME = "www.page.org";
const PROTO = "https:"
const ROUTE = "/a/sub-route";
const LOCATION: Location = {path: ROUTE, queryParams: {}};

initDomMock();

export const createLoc = (loc: Partial<Location>) => {
    return {...LOCATION, ...loc}
}

describe('router', () => {
    it('path and query', () => {
        const router = new Router(url.parse(`${PROTO}//${HOST_NAME}${ROUTE}?a=1&b=2`));

        const routeSnap = router.getSnapshot();

        assert.equal(routeSnap.path, ROUTE);
        assert.deepEqual(routeSnap.queryParams, {a: '1', b: '2'});
    })
    it('navigate', () => {
        const router = new Router(url.parse("https://www.page.org/a/something?a=1&b=2"));

        router.navigate("/somewhere-else");

        assert.deepEqual(router.getSnapshot(), {path: "/somewhere-else", queryParams: {}})
    })
    it('navigate with queryParams', () => {
        const router = new Router(url.parse("https://www.page.org/a/something?a=1&b=2"));

        router.navigate("/here", {queryParams: {x: 'y'}});

        assert.deepEqual(router.getSnapshot(), {path: "/here", queryParams: {x: 'y'}})
    })
    it('routes by matching paths', () => {
        const nodes = [];
        const router = new Router(url.parse("https://www.page.org/"));
        const routes = router.routes(
            {path: "/", node: "Home"},
            {path: "/about", node: "About"},
            {path: "/contact", node: "Hello"},
        );

        routes.subscribe(val => nodes.push(val));
        router.navigate("/about");
        router.navigate("/contact");
        assert.deepEqual(nodes, ['Home', "About", "Hello"])
    })
    it('rendered route', () => {
        const router = new Router(url.parse("https://www.page.org/"));
        const routes = router.routes(
            {path: "/", node: "Home"},
            {path: "/about", node: "About"},
            {path: "/contact", node: "Hello"},
        );

        const target = render(div(routes));

        assert.equal(target.innerHTML, "Home");
    })
    it('rendered route navigate', () => {
        const router = new Router(url.parse("https://www.page.org/"));
        const routes = router.routes(
            {path: "/", node: "Home"},
            {path: "/about", node: "About"},
            {path: "/contact", node: "Hello"},
        );

        const target = render(div(routes));
        router.navigate("/about");

        assert.equal(target.innerHTML, "About");
    })
    it('rendered subroute', () => {
        const router = new Router(url.parse("https://www.page.org/about"));
        const routes = router.routes(
            {path: "/", node: "Home"},
            {path: "/about", node: "About"},
            {path: "/contact", node: "Hello"},
        );
        const target = render(div(routes));

        assert.equal(target.innerHTML, "About");
    })
})
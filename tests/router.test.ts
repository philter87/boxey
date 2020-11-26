import * as url from "url";
import {describe} from "mocha";
import {parseUrl, Router, Url} from "../src/router";
import {assert} from "chai";
import {div} from "../src/VNodes";
import {initDomMock, render} from "./dom-mock";

const HOST_NAME = "www.page.org";
const PROTO = "https:"
const ROUTE = "/a/sub-route";
const LOCATION: Url = {path: ROUTE, queryParams: {}};

initDomMock();

export const createLoc = (loc: Partial<Url>) => {
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

        const url0 = router.getSnapshot();
        assert.equal(url0.path, "/somewhere-else");
        assert.deepEqual(url0.queryParams, {});
    })
    it('navigate with queryParams', () => {
        const router = new Router(url.parse("https://www.page.org/a/something?a=1&b=2"));

        router.navigate("/here", {queryParams: {x: 'y'}});

        const url0 = router.getSnapshot();
        assert.equal(url0.path, "/here");
        assert.deepEqual(url0.queryParams, {x: 'y'});
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
    it('dynamic route matching', () => {
        const router = new Router(url.parse("https://www.page.org"));
        const routes = router.routes(
            {path: "/", node: "Home"},
            {path: "/bla", node: "Bla"},
            {path: "/page/:id", node: "Page"},
        );

        router.navigate("/page/1234");

        assert.exists(router.getSnapshot().matchedRoute.node);
    })
})

const routes = [
    {path: "/", node: "Home"},
    {path: "/bla", node: "Bla"},
    {path: "/article/:articleId", node: "Article"},
    {path: "/page/:pageId/blog/:blogId", node: "Blog"},
    {path: "/page/:pageId", node: "Page"},

]

describe('route pattern matching', () => {
    it('exact route matching', () => {
        // assert.equal(matchRoute(routes, "/").matchedRoute.node, "Home");
        assert.equal(parseUrl(routes, "/bla").matchedRoute.node, "Bla");
    })
    it('dynamic matching. page', () => {
        const pageRoute = parseUrl(routes, "/page/abcd");
        assert.equal(pageRoute.matchedRoute.node, "Page");
        assert.deepEqual(pageRoute.pathParams, {pageId: "abcd"});
    })
    it('dynamic matching. article', () => {
        const articleRoute = parseUrl(routes, "/article/1234");
        assert.deepEqual(articleRoute.matchedRoute.node, "Article");
        assert.deepEqual(articleRoute.pathParams, {articleId: "1234"});
    })
    it('dynamic matching. nested blog under page', () => {
        const blogRoute = parseUrl(routes, "/page/abc/blog/1234");
        assert.deepEqual(blogRoute.matchedRoute.node, "Blog");
        assert.deepEqual(blogRoute.pathParams, {pageId: "abc", blogId: "1234"});
    })
})
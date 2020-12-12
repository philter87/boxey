import {store, Subscribable, WriteStore} from "./store";
import {Child, n, VNode} from "./vnodes";
import {UrlWithStringQuery} from "url";
import {isBrowser} from "./utils";
import {AnchorHTMLAttributes} from "./vnode-attributes";

export interface Route {
    path: string;
    node: VNode | VNode[];
}

export interface Url {
    path: string;
    queryParams: {[name: string] : string};
    pathParams?:  {[name: string] : string};
    matchedRoute?: Route;
}

const UNMATCH_ROUTE: Route = {path: '', node: null};

export interface RouteOptions {
    queryParams?: {[name: string] : string};
}

function parseQueryString(search: string) {
    const params: {[name: string] : string} = {};
    if(!search) return params;
    new URLSearchParams(search.substr(1))
        .forEach( (v,k) => params[k] = v);
    return params;
}

export const parseUrl = (routes: Route[], path: string): Partial<Url> => {
    const defaultRoute = routes.find( r => r.path.startsWith("*")) || UNMATCH_ROUTE;
    for (const route of routes) {
        if (route.path == path) {
            return {matchedRoute: route};
        }
        const pathParts = path.split("/");
        const routePatterns = route.path.split("/");
        if (pathParts.length != routePatterns.length) {
            continue;
        }
        const pathParams: {[name: string] : string} = {};
        let isMatched = true;
        for (let i = 0; i < pathParts.length; i++) {
            let routePattern = routePatterns[i];
            let pathPart = pathParts[i];
            if(routePattern.startsWith(":")) {
                pathParams[routePattern.substr(1)] = pathPart;
            } else if (routePattern !== pathPart) {
                isMatched = false;
            }
        }
        if(isMatched) {
            return {matchedRoute: route, pathParams};
        }
    }
    return {matchedRoute: defaultRoute};
}

export class Router {
    private _url: WriteStore<Url>;
    private _routes: Route[];

    constructor(location?: UrlWithStringQuery | globalThis.Location) {
        this._routes = [];
        this._url = store(this.createUrlFromLocation(location || window.location));
        if(isBrowser()) {
            window.onpopstate = () => {
                this._url.set(this.createUrlFromLocation(window.location))
            }
        }
    }

    private createUrlFromLocation(l: UrlWithStringQuery | globalThis.Location): Url {
        return this.createUrl(l.pathname, parseQueryString(l.search));
    }

    private createUrl(path: string, queryParams: {[name: string] : string}): Url {
        return {...parseUrl(this._routes, path), path, queryParams};
    }

    navigate(route: string, opt: RouteOptions = {queryParams: {}}){
        this._url.set(this.createUrl(route, opt.queryParams));
        if (isBrowser()) {
            window.history.pushState({}, route, window.location.origin + route);
        }
    }

    routes(...routes: Route[]): Subscribable<VNode | VNode[]> {
        this._routes = routes;
        this._url.update( url => this.createUrl(url.path, url.queryParams));
        return this._url.map( l => l.matchedRoute ? l.matchedRoute.node : null);
    }

    a(route: string, attr?: AnchorHTMLAttributes<HTMLAnchorElement>, ...children: Child[]): VNode{
        attr = {...attr, href: route,  onclick: (ev) => {
            ev.preventDefault();
            this.navigate(route)
        }};
        return n("a", attr, children);
    }

    getSnapshot() {
        return this._url.snapshot();
    }
}
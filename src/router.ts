
import {Store, store, Subscribable, WriteStore} from "./store";
import {AnchorAttributes, Child, n, NodeAttributes, VNode} from "./VNodes";
import {UrlWithStringQuery} from "url";
import {isBrowser} from "./utils";

export interface Route {
    path: string;
    node: VNode | VNode[];
}

export interface Location {
    hostName: string;
    queryParams: {[name: string] : string};
    route: string;
}

export interface RouteOptions {
    queryParams?: {[name: string] : string};
}

function parseQueryString(search: string) {
    if(!search) return {};
    const queryStatements = search.substr(1).split("&");
    const query = {};
    queryStatements.forEach( statement => {
        const kv = statement.split("=");
        query[kv[0]] = kv[1];
    })
    return query;
}

export class Router {
    private _location: WriteStore<Location>;

    constructor(location?: UrlWithStringQuery | globalThis.Location) {
        this._location = store(this.getLocation(location || window.location));

        if(isBrowser()) {
            window.onpopstate = () => {
                this._location.set(this.getLocation(window.location))
            }
        }
    }

    private getLocation(l: UrlWithStringQuery | globalThis.Location) {
        return { hostName: l.hostname,  route: l.pathname,  queryParams: parseQueryString(l.search)}
    }

    navigate(route: string, opt: RouteOptions = {queryParams: {}}){
        this._location.update(l => ({...l, route, queryParams: opt.queryParams}));
        if (isBrowser()) {
            window.history.pushState({}, route, window.location.origin + route);
        }
    }

    findRoute(location: Location, routes: Route[]): Route {
        const matchedRoute = routes.find( r => r.path == location.route);
        return matchedRoute || routes[0];
    }

    routes(...routes: Route[]): Subscribable<VNode | VNode[]> {
        return this._location.map(l => this.findRoute(l, routes).node);
    }

    a(route: string, attr?: AnchorAttributes, ...children: Child[]): VNode{
        attr = {...attr, href: route,  onclick: (ev) => {
            ev.preventDefault();
            this.navigate(route)
        }};
        return n("a", attr, children);
    }

    getSnapshot() {
        return this._location.snapshot();
    }
}
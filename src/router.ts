
import {store, Subscribable, WriteStore} from "./store";
import {AnchorAttributes, Child, n, NodeAttributes, VNode} from "./VNodes";
import {UrlWithStringQuery} from "url";

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
    private location: Location = {hostName: "", queryParams: {}, route: ""};
    private _routes: Route[];
    private _currentRoute: WriteStore<Route>;

    constructor(location?: UrlWithStringQuery | globalThis.Location) {
        if(!location) {
            location = window.location;
        }
        this._routes = [];
        this._currentRoute = store({path:"", node: null});
        this.location = {
            hostName: location.hostname,
            route: location.pathname,
            queryParams: parseQueryString(location.search)
        }
    }

    navigate(route: string, opt: RouteOptions = {queryParams: {}}){
        const matchedRoute = this._routes.filter( r => route == r.path);
        if (matchedRoute) {
            if(typeof window !== 'undefined') {
                window.history.pushState({}, route, window.location.origin + route);
            }
            this.location = {route, hostName: this.location.hostName, queryParams: opt.queryParams}
            this._currentRoute.set(matchedRoute[0]);
        } else {
            this._currentRoute.set(this._routes[0]);
        }
    }

    routes(...routes: Route[]): Subscribable<VNode | VNode[]> {
        this._currentRoute.set(routes[0]);
        routes.forEach( r => {
            this._routes.push(r);
            if(r.path === this.location.route ) {
                this._currentRoute.set(r);
            }
        })
        return this._currentRoute.map( r => r.node);
    }

    a(route: string, attr?: AnchorAttributes, ...children: Child[]): VNode{
        attr = {...attr, href: route,  onclick: (ev) => {
            ev.preventDefault();
            this.navigate(route)
        }};
        return n("a", attr, children);
    }

    getSnapshot() {
        return this.location;
    }
}
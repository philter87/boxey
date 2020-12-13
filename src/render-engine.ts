import {Child, VElement, VNode} from "./vnodes";
import {Subscription} from "./store";
import {isElement, isNodeArray, isNumber, isString, isSubscribable} from "./utils";
import {ChildGroup} from "./child-info";
import {FRAGMENT} from "./constants";

function handleFragments(children: Child[]) {
    const containsFragment = children.find( c => isElement(c) && c.tag === FRAGMENT);
    if (containsFragment) {
        const flat: Child[] = []
        children.forEach( c => {
            if(isElement(c) && c.tag === FRAGMENT) {
                c.children.forEach( nc => flat.push(nc))
            } else {
                flat.push(c);
            }
        })
        return flat;
    } else {
        return children;
    }
}

export const EMPTY_GROUP = new ChildGroup([]);

function findSibling(childGroups: ChildGroup[], currentI: number): Node {
    for (let i = currentI+1; i < childGroups.length; i++) {
        if(childGroups[i] && childGroups[i].domElement.length > 0) {
            return childGroups[i].domElement[0];
        }
    }
    return undefined;
}

export const createDomElement = (node?: VNode | VNode[]): ChildGroup => {
    if (node == null) {
        return new ChildGroup([]);
    } else if (isString(node) || isNumber(node)) {
        return new ChildGroup([document.createTextNode(node+"")]);
    } else if (isNodeArray(node)) {
        const domElements: Node[] = [];
        const subscriptions: Subscription[] = [];
        node.forEach( n => {
            const child = createDomElement(n);
            domElements.push(...child.domElement);
            subscriptions.push(...child.subscriptions);
        })
        return new ChildGroup(domElements, subscriptions);
    }

    const domElement = document.createElement(node.tag)

    const subscriptions: Subscription[] = [];

    if (node.children) {
        node.children = handleFragments(node.children);
        const childGroups: ChildGroup[] = [];
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if(isSubscribable(child)) {
                childGroups[i] = EMPTY_GROUP;
                // TODO will not work with fragment
                const subscription = child.subscribe(newChild => {
                    // clean up old if exist
                    childGroups[i]?.remove(domElement);
                    const childGroup = createDomElement(newChild);
                    domElement.insertBefore(childGroup.createElement(), findSibling(childGroups, i));
                    childGroups[i] = childGroup;
                })
                subscriptions.push(subscription);
            } else {
                const childInfo = createDomElement(child);
                subscriptions.push(...childInfo.subscriptions)
                domElement.appendChild(childInfo.createElement());
                childGroups[i] = childInfo;
            }
        }
    }

    if(node.attr?.class){
        node.attr.className = node.attr.class;
        delete node.attr.class
    }

    for(let key in node.attr) {
        if (key === 'style') {
            for(const key in node.attr.style) {
                const styleVal = node.attr.style[key];
                if ( isSubscribable(styleVal) ) {
                    subscriptions.push(styleVal.subscribe( newStyleVal => domElement.style[key] = newStyleVal))
                } else {
                    domElement.style[key] = styleVal;
                }
            }
        } else {
            const nodeAttr = node.attr[key];
            if (isSubscribable(nodeAttr)) {
                subscriptions.push(nodeAttr.subscribe( newVal => domElement[key] = newVal))
            } else {
                domElement[key] = nodeAttr
            }
        }
    }
    return new ChildGroup([domElement], subscriptions);
}

export const dotRender = (node: VElement, target: HTMLElement) => {
    if(node.tag === FRAGMENT) {
        throw Error("Root element is not allowed to be a fragment")
    }
    const childInfo = createDomElement(node);
    target.appendChild(childInfo.createElement());
    return target;
}
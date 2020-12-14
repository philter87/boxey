import {Child, VElement, VNode} from "./vnodes";
import {Subscription} from "./store";
import {isElement, isNodeArray, isNumber, isString, isSubscribable} from "./utils";
import {ChildGroup} from "./child-info";
import {FRAGMENT} from "./constants";
import {HTMLAttributes} from "./vnode-attributes";
export const EMPTY_GROUP = new ChildGroup([]);

export const dotRender = (node: VElement, target: HTMLElement) => {
    if(node.tag === FRAGMENT) {
        throw Error("Root element is not allowed to be a fragment")
    }
    const childInfo = createDomElement(node);
    target.appendChild(childInfo.createElement());
    return target;
}

export const createDomElement = (node?: VNode | VNode[]): ChildGroup => {
    if (node == null) {
        return new ChildGroup([]);
    } else if (isString(node) || isNumber(node)) {
        return new ChildGroup([document.createTextNode(node+"")]);
    } else if (isNodeArray(node)) {
        return handleNodeArray(node);
    }

    const domElement = document.createElement(node.tag)
    const subscriptions: Subscription[] = [];

    handleNodeChildren(node.children, domElement, subscriptions);
    handleAttributes(node.attr, domElement, subscriptions);

    return new ChildGroup([domElement], subscriptions);
}

function handleNodeArray(node: VNode[]) {
    const domElements: Node[] = [];
    const subscriptions: Subscription[] = [];
    node.forEach(n => {
        const child = createDomElement(n);
        domElements.push(...child.domElement);
        subscriptions.push(...child.subscriptions);
    })
    return new ChildGroup(domElements, subscriptions);
}

function handleFragments(children: Child[]) {
    if (children.find( c => isElement(c) && c.tag === FRAGMENT)) {
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

function findSibling(childGroups: ChildGroup[], currentI: number): Node {
    for (let i = currentI+1; i < childGroups.length; i++) {
        if(childGroups[i] && childGroups[i].domElement.length > 0) {
            return childGroups[i].domElement[0];
        }
    }
    return undefined;
}


function handleNodeChildren(children: Child[], parent: HTMLElement, subscriptions: Subscription[]) {
    if (!children) return;
    children = handleFragments(children);
    const childGroups: ChildGroup[] = [];
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (isSubscribable(child)) {
            childGroups[i] = EMPTY_GROUP;
            const subscription = child.subscribe(newChild => {
                childGroups[i]?.cleanUp(parent);
                const childGroup = createDomElement(newChild);
                parent.insertBefore(childGroup.createElement(), findSibling(childGroups, i));
                childGroups[i] = childGroup;
            });
            subscriptions.push(subscription);
        } else {
            const childGroup = createDomElement(child);
            subscriptions.push(...childGroup.subscriptions)
            parent.appendChild(childGroup.createElement());
            childGroups[i] = childGroup;
        }
    }
}

function handleAttributes(attr: HTMLAttributes<HTMLElement>, domElement: HTMLElement, subscriptions: Subscription[]) {
    if(!attr) return;
    if (attr.class) {
        attr.className = attr.class;
        delete attr.class
    }

    for (let key in attr) {
        if (key === 'style') {
            for (const key in attr.style) {
                const styleVal = attr.style[key];
                if (isSubscribable(styleVal)) {
                    subscriptions.push(styleVal.subscribe(newStyleVal => domElement.style[key] = newStyleVal))
                } else {
                    domElement.style[key] = styleVal;
                }
            }
        } else {
            const nodeAttr = attr[key];
            if (isSubscribable(nodeAttr)) {
                subscriptions.push(nodeAttr.subscribe(newVal => domElement[key] = newVal))
            } else {
                domElement[key] = nodeAttr
            }
        }
    }
}
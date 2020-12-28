import {Child, VElement, VNode} from "./vnodes";
import {Subscribable, Subscription} from "./box";
import {isElement, isNumber, isString, isSubscribable} from "./utils";
import {ChildGroup, EMPTY_ELEMENTS, EMPTY_SUBSCRIPTION} from "./child-info";
import {HTMLAttributes} from "./vnode-attributes";
import {FRAGMENT} from "./constants";

function callOnRendered(c: VElement | string | number | VNode[] | Subscribable<VNode | VNode[] | null>) {
    if (isElement(c)) {
        if (c?.attr?.onRendered) {
            c.attr.onRendered(null);
        }
        if (c.children) {
            c.children.forEach( c => callOnRendered(c));
        }
    }
}

export const dotRender = (node: VElement, target: HTMLElement) => {
    const childInfo = createDomElement(node, target);
    target.append(...childInfo.domElement);
    callOnRendered(node);
    return target;
}

export const createDomElement = (node?: Child, parentDom?: HTMLElement, parentSubscriptions?: Subscription[]): ChildGroup => {
    if (node == null) {
        return new ChildGroup(EMPTY_ELEMENTS, EMPTY_SUBSCRIPTION);
    } else if (isString(node) || isNumber(node)) {
        return new ChildGroup([document.createTextNode(node.toString())], EMPTY_SUBSCRIPTION);
    } else if (Array.isArray(node)) {
        return handleNodeChildren(node, parentDom);
    } else if(isSubscribable(node)) {
        return createDynamicGroup(node, parentDom, parentSubscriptions)
    }
    if(node.tag === FRAGMENT) {
        return handleNodeChildren(node.children, parentDom, parentSubscriptions);
    }

    const domElement = document.createElement(node.tag)
    const subscriptions: Subscription[] = [];

    handleNodeChildren(node.children, domElement, subscriptions);
    handleAttributes(node.attr, domElement, subscriptions);

    return new ChildGroup([domElement], subscriptions);
}

function createDynamicGroup(child: Subscribable<VNode | VNode[] | null>,
                            parentDom: HTMLElement,
                            parentSubscriptions: Subscription[]) {
    const currentGroup = new ChildGroup(EMPTY_ELEMENTS, EMPTY_SUBSCRIPTION, true);
    const subscription = child.subscribe(newChild => {
        const newGroup = createDomElement(newChild, parentDom, []);
        currentGroup.swap(newGroup, parentDom);
        callOnRendered(newChild)
    });
    parentSubscriptions.push(subscription)
    return currentGroup;
}

function handleNodeChildren(children: Child[],
                            parent: HTMLElement,
                            subscriptions: Subscription[] = []): ChildGroup {
    if (!children) return;
    let prevGroup: ChildGroup;
    let domElements = [];
    for (let i = 0; i < children.length; i++){
        let currentGroup = createDomElement(children[i],  parent, subscriptions);
        subscriptions.push(...currentGroup.subscriptions)

        // A group might have a child that is missing a drawAnchor
        const childWithMissingDrawAnchor = prevGroup?.getChildMissingDrawAnchor();
        if(childWithMissingDrawAnchor) {
            childWithMissingDrawAnchor.drawAnchor = currentGroup;
        }
        prevGroup = currentGroup;
        domElements.push(...currentGroup.domElement);
        parent.append(...currentGroup.domElement);
    }
    const group = new ChildGroup(domElements, subscriptions);
    group.childWithMissingDrawAnchor = prevGroup?.getChildMissingDrawAnchor();
    return group;
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
import {Child, VElement, VNode} from "./vnodes";
import {Subscribable, Subscription} from "./store";
import {isNumber, isString, isSubscribable} from "./utils";
import {ChildGroup, EMPTY_ELEMENTS} from "./child-info";
import {HTMLAttributes} from "./vnode-attributes";
import {FRAGMENT} from "./constants";

export const dotRender = (node: VElement, target: HTMLElement) => {
    const childInfo = createDomElement(node, target);
    target.append(...childInfo.domElement);
    return target;
}

export const createDomElement = (node?: Child, parentDom?: HTMLElement, parentSubscriptions?: Subscription[]): ChildGroup => {
    if (node == null) {
        return new ChildGroup();
    } else if (isString(node) || isNumber(node)) {
        return new ChildGroup([document.createTextNode(node.toString())]);
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
    const currentGroup = new ChildGroup(EMPTY_ELEMENTS,[]);
    const subscription = child.subscribe(newChild => {
        const newGroup = createDomElement(newChild, parentDom, []);
        currentGroup.swap(newGroup, parentDom);
    });
    parentSubscriptions.push(subscription)
    return currentGroup;
}

function handleNodeChildren(children: Child[],
                            parent: HTMLElement,
                            subscriptions: Subscription[] = []): ChildGroup {
    if (!children) return;
    // A dynamic group needs a reference to the next sibling in the dom tree. The dynamic group uses this reference to
    // append it self to the dom at the correct location (with the parent.insertBefore).
    let prevDynamicSibling: ChildGroup;
    let domElements = [];
    children.forEach( (child) => {
        let currentGroup = createDomElement(child,  parent, subscriptions);
        subscriptions.push(...currentGroup.subscriptions)

        // The current group stores a reference to the last dynamic group if it was dynamic.
        if(prevDynamicSibling) {
            prevDynamicSibling.nextSibling = currentGroup;
        }
        // prevDynamicGroup is only assigned when a child is dynamic or empty.
        const isDynamicOrEmpty = isSubscribable(child) || currentGroup.domElement.length == 0;
        prevDynamicSibling = isDynamicOrEmpty ? currentGroup : null;
        domElements.push(...currentGroup.domElement);
        return parent.append(...currentGroup.domElement);
    })
    return new ChildGroup(domElements, subscriptions);
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
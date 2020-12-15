import {Child, VElement, VNode} from "./vnodes";
import {Subscribable, Subscription} from "./store";
import {isNumber, isString, isSubscribable} from "./utils";
import {ChildGroup, EMPTY_ELEMENTS} from "./child-info";
import {HTMLAttributes} from "./vnode-attributes";

export const dotRender = (node: VElement, target: HTMLElement) => {
    const childInfo = createDomElement(node);
    target.appendChild(childInfo.createElement());
    return target;
}

export const createDomElement = (node?: VNode | VNode[], parent?: Node, prevChildGroup?: ChildGroup): ChildGroup => {
    if (node == null) {
        return new ChildGroup();
    } else if (isString(node) || isNumber(node)) {
        return new ChildGroup([document.createTextNode(node.toString())]);
    } else if (Array.isArray(node)) {
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

function createDynamicGroup(child: Subscribable<VNode | VNode[] | null>, parent: Node, subscriptions: Subscription[]) {
    const currentGroup = new ChildGroup(EMPTY_ELEMENTS,[]);
    const subscription = child.subscribe(newChild => {
        currentGroup.swap(createDomElement(newChild), parent);
        parent.insertBefore(currentGroup.createElement(), currentGroup.nextSibling?.getFirstDomElement());
    });
    subscriptions.push(subscription)
    return currentGroup;
}

function handleNodeChildren(children: Child[], parent: HTMLElement, subscriptions: Subscription[]) {
    if (!children) return;

    // A dynamic group needs a reference to the next sibling in the dom tree. The dynamic group uses this reference to
    // append it self to the dom at the correct location (with the parent.insertBefore).
    let prevDynamicGroup: ChildGroup;
    children.forEach( (child) => {
        let currentGroup = isSubscribable(child)
            ? createDynamicGroup(child, parent, subscriptions)
            : createDomElement(child);
        subscriptions.push(...currentGroup.subscriptions)
        parent.appendChild(currentGroup.createElement());

        // The current group stores a reference to the last dynamic group if it was dynamic.
        if(prevDynamicGroup) {
            prevDynamicGroup.nextSibling = currentGroup;
        }
        // prevDynamicGroup is only assigned when a child is dynamic or empty.
        const isDynamicOrEmpty = isSubscribable(child) || currentGroup.domElement.length == 0;
        prevDynamicGroup = isDynamicOrEmpty ? currentGroup : null;
    })
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
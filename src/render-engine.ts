import {Child, VElement, VNode} from "./vnodes";
import {Subscribable, Subscription} from "./store";
import {isNumber, isString, isSubscribable} from "./utils";
import {ChildGroup, EMPTY_ELEMENTS} from "./child-info";
import {HTMLAttributes} from "./vnode-attributes";
import {FRAGMENT} from "./constants";

export const dotRender = (node: VElement, target: HTMLElement) => {
    const childInfo = createDomElement(node, new ChildGroup([target], []));
    target.append(...childInfo.domElement);
    return target;
}

export const createDomElement = (node?: Child, parent?: ChildGroup): ChildGroup => {
    if (node == null) {
        return new ChildGroup();
    } else if (isString(node) || isNumber(node)) {
        return new ChildGroup([document.createTextNode(node.toString())]);
    } else if (Array.isArray(node)) {
        return handleNodeArray(node, parent);
    } else if(isSubscribable(node)) {
        return createDynamicGroup(node, parent)
    }
    if(node.tag === FRAGMENT) {
        return handleNodeChildren(node.children, new ChildGroup(parent.domElement, []));
    }

    const group = new ChildGroup([document.createElement(node.tag)], []);
    handleNodeChildren(node.children, group);
    handleAttributes(node.attr, group);

    return group;
}

function handleNodeArray(node: VNode[], parent: ChildGroup) {
    const domElements: Node[] = [];
    const subscriptions: Subscription[] = [];
    node.forEach(n => {
        const child = createDomElement(n, parent);
        domElements.push(...child.domElement);
        subscriptions.push(...child.subscriptions);
    })
    return new ChildGroup(domElements, subscriptions);
}

function createDynamicGroup(child: Subscribable<VNode | VNode[] | null>,
                            parent: ChildGroup) {
    const currentGroup = new ChildGroup(EMPTY_ELEMENTS,[]);
    const subscription = child.subscribe(newChild => {
        const newGroup = createDomElement(newChild, parent);
        currentGroup.swap(newGroup, parent);
        parent.domElement[0].insertBefore(currentGroup.createElement(), currentGroup.nextSibling?.getFirstDomElement());
    });
    parent.subscriptions.push(subscription)
    return currentGroup;
}

function handleNodeChildren(children: Child[], parent: ChildGroup): ChildGroup {
    if (!children) return;
    // A dynamic group needs a reference to the next sibling in the dom tree. The dynamic group uses this reference to
    // append it self to the dom at the correct location (with the parent.insertBefore).
    let prevDynamicSibling: ChildGroup;
    let domElements = [];
    children.forEach( (child) => {
        let currentGroup = createDomElement(child,  parent);
        parent.subscriptions.push(...currentGroup.subscriptions)

        // The current group stores a reference to the last dynamic group if it was dynamic.
        if(prevDynamicSibling) {
            prevDynamicSibling.nextSibling = currentGroup;
        }
        // prevDynamicGroup is only assigned when a child is dynamic or empty.
        const isDynamicOrEmpty = isSubscribable(child) || currentGroup.domElement.length == 0;
        prevDynamicSibling = isDynamicOrEmpty ? currentGroup : null;
        domElements.push(...currentGroup.domElement);
        return (parent.domElement[0] as HTMLElement).append(...currentGroup.domElement);
    })
    return new ChildGroup(domElements, parent.subscriptions);
}

function handleAttributes(attr: HTMLAttributes<HTMLElement>, group: ChildGroup) {
    if(!attr) return;
    const domElement: HTMLElement = group.domElement[0] as HTMLElement;
    if (attr.class) {
        attr.className = attr.class;
        delete attr.class
    }

    for (let key in attr) {
        if (key === 'style') {
            for (const key in attr.style) {
                const styleVal = attr.style[key];
                if (isSubscribable(styleVal)) {
                    group.subscriptions.push(styleVal.subscribe(newStyleVal => domElement.style[key] = newStyleVal))
                } else {
                    domElement.style[key] = styleVal;
                }
            }
        } else {
            const nodeAttr = attr[key];
            if (isSubscribable(nodeAttr)) {
                group.subscriptions.push(nodeAttr.subscribe(newVal => domElement[key] = newVal))
            } else {
                domElement[key] = nodeAttr
            }
        }
    }
}
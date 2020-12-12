import {Child, VElement, VNode} from "./vnodes";
import {multiSubscription, Subscription} from "./store";
import {calcArraySum, isElement, isNodeArray, isNumber, isString, isSubscribable} from "./utils";
import {ChildInfo} from "./child-info";
import {FRAGMENT} from "./constants";

export class ChildGroup {
    subscriptions: Subscription[];
    domNodes: Node[];

    constructor(nodes: null | VNode | VNode[]) {
        this.subscriptions = [];
        this.domNodes = [];
        if (nodes == null) {
            // do nothing
        } else if (isNodeArray(nodes)) {
            nodes.forEach(n => this.push(createDomElement(n)));
        } else {
            this.push(createDomElement(nodes))
        }
    }

    private push(childInfo: ChildInfo) {
        if (childInfo.subscription) {
            this.subscriptions.push(childInfo.subscription);
        }
        this.domNodes.push(childInfo.domElement);
    }

    createFragment() {
        const fragment = document.createDocumentFragment();
        this.domNodes.forEach(n => fragment.appendChild(n));
        return fragment;
    }

    size() {
        return this.domNodes.length;
    }

    remove(parentNode: Node) {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.domNodes.forEach(n => parentNode.removeChild(n));
    }
}

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

export const createDomElement = (node: VNode): ChildInfo => {
    if (isString(node) || isNumber(node)) {
        return {domElement: document.createTextNode(node+"")}
    }

    const domElement = document.createElement(node.tag)

    const subscriptions: Subscription[] = [];

    if (node.children) {
        node.children = handleFragments(node.children);
        const childGroups: {[order: number]: ChildGroup} = {};
        const childSizes: number[] = [];
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if(isSubscribable(child)) {
                childSizes[i] = 0;
                // TODO will not work with fragment
                const subscription = child.subscribe(newChild => {
                    // clean up old if exist
                    childGroups[i]?.remove(domElement);

                    let position = calcArraySum(childSizes, i);
                    const childGroup = new ChildGroup(newChild);

                    if (position == 0) {
                        domElement.prepend(childGroup.createFragment());
                    } else {
                        const prevNode = domElement.childNodes[position-1];
                        const next = prevNode.nextSibling
                        domElement.insertBefore(childGroup.createFragment(), next);
                    }
                    childGroups[i] = childGroup;
                    childSizes[i] = childGroup.size();
                })
                subscriptions.push(subscription);
            } else {
                const childGroup = new ChildGroup(child);
                domElement.appendChild(childGroup.createFragment());
                childGroup.subscriptions.forEach( s => subscriptions.push(s));
                childSizes[i] = childGroup.size();
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
    return {domElement, subscription: multiSubscription(subscriptions)};
}

export const dotRender = (node: VElement, target: HTMLElement) => {
    if(node.tag === FRAGMENT) {
        throw Error("Root element is not allowed to be a fragment")
    }
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createDomElement(node).domElement);
    target.appendChild(fragment);
    return target;
}
import {VNode} from "./VNodes";
import {Subscription} from "./store";
import {calcArraySum, isString, isSubscribable} from "./utils";

interface DynamicElement {
    id: number;
    domElement: Node;
    dynamicChildren: number[];
    subscriptions: Subscription[];
}

interface ChildInfo {
    domElement: Node;
    subscription?: Subscription;
    positionInParent?: number;
}

const createDomElement = (node: VNode | string): ChildInfo => {
    if (isString(node)) {
        return {domElement: document.createTextNode(node)}
    }
    const domElement = document.createElement(node.tag)
    const subscriptions = [];

    for(let key in node.attr) {
        if(key === 'class') {
            domElement.className = node.attr.class;
        } else if (key === 'style') {
            for(const key in node.attr.style) {
                const styleVal = node.attr.style[key];
                if ( isString(styleVal) ) {
                    domElement.style[key] = styleVal;
                } else {
                    subscriptions.push(styleVal.subscribe( newStyleVal => domElement.style[key] = newStyleVal))
                }
            }
        } else {
            domElement[key] = node.attr[key];
        }
    }
    if(node.children) {
        const childInfos: {[order: number]: ChildInfo} = {};
        const childSizes: number[] = [];
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if(isSubscribable(child)) {
                childSizes[i] = 0;
                const subscription = child.subscribe(newChild => {
                    // if child is null/undefined
                    if(!newChild) {
                        childSizes[i] = 0;
                        return;
                    }
                    const prevChildInfo = childInfos[i];
                    const newChildInfo = createDomElement(newChild);
                    if(prevChildInfo) {
                        prevChildInfo.subscription.unsubscribe();
                        domElement.replaceChild(newChildInfo.domElement, prevChildInfo.domElement);
                    } else {
                        let position = calcArraySum(childSizes, i);
                        if (position == 0) {
                            domElement.prepend(newChildInfo.domElement);
                        } else {
                            const prevNode = domElement.childNodes[position-1];
                            const next = prevNode.nextSibling
                            domElement.insertBefore(newChildInfo.domElement, next);
                        }
                    }
                    childInfos[i] = newChildInfo;
                    childSizes[i] = 1;
                })
                subscriptions.push(subscription);
            } else {
                childSizes[i] = 1;
                const childInfo = createDomElement(child);
                subscriptions.push(childInfo.subscription);
                domElement.appendChild(childInfo.domElement);
                childInfos[i] = childInfo;
            }
        }
    }
    return {domElement, subscription: {unsubscribe: () => subscriptions.forEach(s => s.unsubscribe())}};
}

export const dotRender = (node: VNode, target: HTMLElement) => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createDomElement(node).domElement);
    target.appendChild(fragment);
    return target;
}
import {VElement, VNode} from "./VNodes";
import {Subscription} from "./store";
import {calcArraySum, isNode, isNodeArray, isString, isSubscribable} from "./utils";

interface ChildInfo {
    domElement: Node;
    subscription?: Subscription;
    nestedList?: ChildInfo[];
}

const createDomElement = (node: VNode): ChildInfo => {
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
                    if(!newChild) { // if null
                        childSizes[i] = 0;
                        return;
                    }
                    const prevChildInfo = childInfos[i];

                    if(isNodeArray(newChild)) {
                        let position = calcArraySum(childSizes, i);
                        const fragment = document.createDocumentFragment();

                        if (prevChildInfo) {
                           prevChildInfo.subscription?.unsubscribe();
                           prevChildInfo.nestedList.forEach( c => {
                               c.subscription?.unsubscribe();
                               domElement.removeChild(c.domElement)
                           } );

                        } else {

                        }
                        childSizes[i] = newChild.length;
                        return;
                    }
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
            } else if(isNodeArray(child)) {
                childSizes[i] = child.length;
                const fragment = document.createDocumentFragment();
                child.forEach( subChild => {
                    const childInfo = createDomElement(subChild);
                    subscriptions.push(childInfo.subscription);
                    fragment.appendChild(childInfo.domElement);
                })
                domElement.appendChild(fragment);
            } else { // isArray
                const childInfo = createDomElement(child);
                subscriptions.push(childInfo.subscription);
                domElement.appendChild(childInfo.domElement);
                childSizes[i] = 1;
            }
        }
    }
    return {domElement, subscription: {unsubscribe: () => subscriptions.forEach(s => s.unsubscribe())}};
}

export const dotRender = (node: VElement, target: HTMLElement) => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createDomElement(node).domElement);
    target.appendChild(fragment);
    return target;
}
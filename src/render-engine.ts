import {VElement, VNode} from "./VNodes";
import {MultiSubscription, Subscription} from "./store";
import {calcArraySum, isNodeArray, isString, isSubscribable} from "./utils";

interface ChildInfo {
    domElement: Node;
    subscription?: Subscription;
}


export class ChildGroup {
    childInfos: ChildInfo[];

    constructor(nodes: null | VNode | VNode[]) {
        this.childInfos = [];
        if(!nodes) {
            // do nothing
        } else if(isNodeArray(nodes)) {
            for (const node of nodes) {
                this.childInfos.push(createDomElement(node))
            }
        } else {
            this.childInfos.push(createDomElement(nodes))
        }
    }

    createFragment(){
        const fragment = document.createDocumentFragment();
        this.childInfos.forEach( c => fragment.appendChild(c.domElement));
        return fragment;
    }

    size(){
        return this.childInfos.length;
    }

    remove(parentNode: Node) {
        for (const childInfo of this.childInfos) {
            childInfo.subscription.unsubscribe();
            parentNode.removeChild(childInfo.domElement);
        }
    }
}

const createDomElement = (node: VNode): ChildInfo => {
    if (isString(node)) {
        return {domElement: document.createTextNode(node)}
    }
    const domElement = document.createElement(node.tag)
    const subscriptions = new MultiSubscription();

    for(let key in node.attr) {
        if(key === 'class') {
            domElement.className = node.attr.class;
        } else if (key === 'style') {
            for(const key in node.attr.style) {
                const styleVal = node.attr.style[key];
                if ( isString(styleVal) ) {
                    domElement.style[key] = styleVal;
                } else {
                    subscriptions.add(styleVal.subscribe( newStyleVal => domElement.style[key] = newStyleVal))
                }
            }
        } else {
            domElement[key] = node.attr[key];
        }
    }
    if(node.children) {
        const childGroups: {[order: number]: ChildGroup} = {};
        const childSizes: number[] = [];
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            if(isSubscribable(child)) {
                childSizes[i] = 0;
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
                subscriptions.add(subscription);
            } else if(isNodeArray(child)) {
                const fragment = document.createDocumentFragment();
                child.forEach( subChild => {
                    const childInfo = createDomElement(subChild);
                    subscriptions.add(childInfo.subscription);
                    fragment.appendChild(childInfo.domElement);
                })
                domElement.appendChild(fragment);
                childSizes[i] = child.length;
            } else {
                const childInfo = createDomElement(child);
                subscriptions.add(childInfo.subscription);
                domElement.appendChild(childInfo.domElement);
                childSizes[i] = 1;
            }
        }
    }
    return {domElement, subscription: subscriptions};
}

export const dotRender = (node: VElement, target: HTMLElement) => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(createDomElement(node).domElement);
    target.appendChild(fragment);
    return target;
}
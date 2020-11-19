import {VNode} from "./VNodes";
import {Subscription} from "./store";
import {isString} from "./utils";

interface DynamicElement {
    id: number;
    domElement: HTMLElement;
    dynamicChildren: number[];
    subscriptions: Subscription[];
}

interface ChildInfo {
    domElement: HTMLElement;
    dynamicChildren: number[];
}

export class RenderEngine {
    private rootNode: VNode;
    private target: HTMLElement;
    private dynamicElements: {[id: string] : DynamicElement};
    private counter: number;

    constructor(node: VNode, target: HTMLElement) {
        this.rootNode = node;
        this.target = target;
        this.dynamicElements = {};
    }

    initialRender() {
        const fragment = document.createDocumentFragment();
        let dom = this.createDomElement(this.rootNode)
        fragment.appendChild(dom.domElement);
        this.target.appendChild(fragment);
    }


    private createDomElement(node: VNode): ChildInfo {
        const domElement = document.createElement(node.tag)
        const subscriptions = [];
        const dynamicChildren = [];

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
        if (node.children) {
            node.children.forEach( childEl => {
                if ( isString(childEl) ) {
                    domElement.appendChild(document.createTextNode(childEl))
                } else {
                    const childInfo = this.createDomElement(childEl);
                    dynamicChildren.push(childInfo.dynamicChildren);
                    domElement.appendChild(childInfo.domElement);
                }
            });
        }
        // If this element is dynamic, we create a dynamicElement (with the current dynamicChildren) and notify the
        // parent that this node is dynamic by returning dynamicChildren[idOfThisNode].
        // If this element is NOT dynamic, we tell the parent which children are.
        const isDynamic = subscriptions.length > 0;
        if (isDynamic) {
            const id = ++this.counter;
            this.dynamicElements[id] = {id, dynamicChildren, domElement, subscriptions}
            return {domElement, dynamicChildren: [id]};
        } else {
            return {domElement, dynamicChildren};
        }

    }
}

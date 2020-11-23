import {VNode} from "./VNodes";
import {isNodeArray} from "./utils";
import {ChildInfo, createDomElement} from "./render-engine";
import {Subscription} from "./store";

export class ChildGroup {
    subscriptions: Subscription[];
    domNodes: Node[];

    constructor(nodes: null | VNode | VNode[]) {
        this.subscriptions = [];
        this.domNodes = [];
        if (!nodes) {
            // do nothing
        } else if (isNodeArray(nodes)) {
            nodes.forEach( n => this.push(createDomElement(n)));
        } else {
            this.push(createDomElement(nodes))
        }
    }

    private push(childInfo: ChildInfo){
        this.subscriptions.push(childInfo.subscription);
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
        this.subscriptions.forEach( s => s.unsubscribe());
        this.domNodes.forEach( n => parentNode.removeChild(n));
    }
}
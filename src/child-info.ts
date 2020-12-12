import {Subscription} from "./store";

export class ChildGroup {
    size: number;

    constructor(public domElement: Node[], public subscriptions?: Subscription[]) {
        this.size = domElement.length;
        if(!subscriptions) {
            this.subscriptions = [];
        }
    }

    remove(parentNode: Node) {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.domElement.forEach(n => parentNode.removeChild(n));
    }

    createFragment(){
        const fragment = document.createDocumentFragment();
        this.domElement.forEach( d => fragment.appendChild(d));
        return fragment;
    }
}
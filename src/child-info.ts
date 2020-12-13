import {Subscription} from "./store";

export class ChildGroup {

    constructor(public domElement: Node[], public subscriptions?: Subscription[]) {
        if(!subscriptions) {
            this.subscriptions = [];
        }
    }

    cleanUp(parentNode: Node) {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.domElement.forEach(n => parentNode.removeChild(n));
    }

    createElement(){
        const fragment = document.createDocumentFragment();
        this.domElement.forEach( d => fragment.appendChild(d));
        return fragment;
    }
}
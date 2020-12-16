import {Subscription} from "./store";
export const EMPTY_SUBSCRIPTION: Subscription[] = []
export const EMPTY_ELEMENTS: Node[] = [];
export class ChildGroup {
    constructor(public domElement: Node[] = EMPTY_ELEMENTS,
                public subscriptions: Subscription[] = EMPTY_SUBSCRIPTION,
                public nextSibling?: ChildGroup) {
    }

    createElement(): Node {
        const fragment = document.createDocumentFragment();
        this.domElement.forEach( d => fragment.appendChild(d));
        return fragment;
    }

    getFirstDomElement(): Node {
        if (this.domElement.length > 0) {
            return this.domElement[0];
        }
        return this.nextSibling ? this.nextSibling.getFirstDomElement() : null;
    }

    swap(newGroup: ChildGroup, parent: HTMLElement){
        // First we clean up previous group
        this.subscriptions.forEach(s => s.unsubscribe());
        this.domElement.forEach(n => parent.removeChild(n));

        // Then we swap
        this.domElement = newGroup.domElement;
        this.subscriptions = newGroup.subscriptions;
    }

}
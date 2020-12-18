import {Subscription} from "./store";
export const EMPTY_SUBSCRIPTION: Subscription[] = []
export const EMPTY_ELEMENTS: Node[] = [];
export class ChildGroup {
    public drawAnchor?: ChildGroup;
    public childWithMissingDrawAnchor?: ChildGroup;

    constructor(public domElement: Node[] = EMPTY_ELEMENTS,
                public subscriptions: Subscription[] = EMPTY_SUBSCRIPTION,
                isThisMissingDrawAnchor: boolean = false) {
        if(isThisMissingDrawAnchor) {
            this.childWithMissingDrawAnchor = this;
        }
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
        return this.drawAnchor ? this.drawAnchor.getFirstDomElement() : null;
    }

    swap(newGroup: ChildGroup, parent: HTMLElement){
        // First we clean up previous group
        this.subscriptions.forEach(s => s.unsubscribe());
        this.domElement.forEach(n => parent.removeChild(n));

        // Then we swap
        this.domElement = newGroup.domElement;
        this.subscriptions = newGroup.subscriptions;

        parent.insertBefore(this.createElement(), this.drawAnchor?.getFirstDomElement());
    }

    getChildMissingDrawAnchor() {
        if(this.childWithMissingDrawAnchor) {
            return this.childWithMissingDrawAnchor;
        } else {
            return this.domElement.length == 0 ? this : null;
        }
    }

}
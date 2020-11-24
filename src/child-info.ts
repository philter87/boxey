import {Subscription} from "./store";

export interface ChildInfo {
    domElement: Node;
    subscription?: Subscription;
}
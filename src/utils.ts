import {Subscribable} from "./store";
import {VNode} from "./VNodes";

export const isString = (obj: any): obj is string => {
    return 'string' == typeof obj;
}

export const isArray = (obj: any): obj is [] => {
    return Array.isArray(obj);
}

export const calcArraySum = (numbers: number[], endIndex: number): number => {
    let sum = 0;
    for (let i = 0; i < endIndex; i++){
        sum += numbers[i];
    }
    return sum;
}

export const isSubscribable = <T>(obj: (T | any)): obj is Subscribable<T> => {
    return (typeof obj) == 'object' && !!obj && "subscribe" in obj;
}

export const isNode = (obj: any): obj is VNode => {
    return !!obj && !!obj?.tag;
}
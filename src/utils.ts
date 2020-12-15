import {Subscribable} from "./store";
import {CustomTagFunction} from "./vnodes";

export const isString = (obj: any): obj is string => {
    return 'string' == typeof obj;
}

export const isNumber = (obj: any): obj is number => {
    return 'number' == typeof obj;
}

export const isCustomTagFunction = (obj: any): obj is CustomTagFunction => {
    return typeof obj === 'function';
}

export const isBrowser = () => {
    return typeof window !== 'undefined';
}

export const isSubscribable = <T>(obj: (T | any)): obj is Subscribable<T> => {
    return (typeof obj) == 'object' && !!obj && "subscribe" in obj;
}
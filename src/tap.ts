export interface Unsubscribe {
    (): void;
}

export interface Subscriber<T> {
    (value: T) : void;
}

interface Subscribable<T> {
    subscribe(subscriber: Subscriber<T>): Unsubscribe;
}

const mapFunc = <T,R>(source: Subscribable<T>, mapperFunction: (value: T) => R) => {
    return new Drop<R>(subscriber => {
        return source.subscribe( val => subscriber(mapperFunction(val)))
    })
}

class Drop<T> implements Subscribable<T>{
    private _subscribe: (subscriber: Subscriber<T>) => Unsubscribe;

    constructor( subscribe: (subscriber: Subscriber<T>) => Unsubscribe) {
        this._subscribe = subscribe;
    }

    subscribe(subscriber: Subscriber<T>): Unsubscribe {
        return this._subscribe(subscriber);
    }

    to<R>(mapperFunction: (value: T) => R) {
        return mapFunc(this, mapperFunction);
    }
}

export class Tap<T> implements Subscribable<T> {
    private value: T;
    private subscribers: Subscriber<T>[];

    constructor(value: T) {
        this.value = value;
        this.subscribers = [];
    }

    subscribe(subscriber: (value: T) => void): Unsubscribe {
        subscriber(this.value);
        const index = this.subscribers.push(subscriber);
        return () => this.subscribers[index-1] = null;
    }

    set(value: T) {
        this.value = value;
        this.subscribers.forEach(o => o && o(this.value));
    }

    update(updateFunction: (currentValue: T) => T) {
        this.set(updateFunction(this.value))
    }

    to<R>(mapperFunction: (value: T) => R) {
        return mapFunc(this, mapperFunction);
    }
}



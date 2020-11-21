export interface Subscriber<T> {
    (value: T) : void;
}

export interface Subscription {
    unsubscribe();
}

export class MultiSubscription implements Subscription {
    private readonly subscriptions: Subscription[];

    constructor(){
        this.subscriptions = [];
    }

    add(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    size(): number{
        return this.subscriptions.length;
    }

    unsubscribe() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}

export interface Get {
    <T> (drop: Store<T>) : T
}

export interface Subscribable<T> {
    subscribe(subscriber: Subscriber<T>): Subscription;
}

export interface Store<T> extends Subscribable<T>{
    map<R>(mapperFunction: (value: T) => R);
    pick(key: keyof T);
    snapshot(): T;
}

const mapFunc = <T,R>(source: Subscribable<T>, mapperFunction: (value: T) => R) => {
    return new ReadStore<R>(subscriber => {
        return source.subscribe( val => subscriber(mapperFunction(val)))
    })
}

class ReadStore<T> implements Subscribable<T> {
    private _subscribe: (subscriber: Subscriber<T>) => Subscription;

    constructor( subscribe: (subscriber: Subscriber<T>) => Subscription) {
        this._subscribe = subscribe;
    }

    subscribe(subscriber: Subscriber<T>): Subscription {
        return this._subscribe(subscriber);
    }

    map<R>(mapperFunction: (value: T) => R) {
        return mapFunc(this, mapperFunction);
    }

    pick(key: keyof T) {
        return this.map(o => o[key]);
    }

    snapshot(): T {
        let value;
        this.subscribe(v => value = v).unsubscribe();
        return value;
    }
}

export const join = <R>(join: (get: Get) => R): Store<R> => {
    return new ReadStore<R>(observer => {
        let areAllSubscribersInitialized = false;
        const values = [];
        const subscriptions = new MultiSubscription();
        let index = 0;
        const get = <Q>(s: Subscribable<Q>) => {
            const currentIndex = index++;
            if(!areAllSubscribersInitialized){
                const subscription = s.subscribe( val => {
                    values[currentIndex] = val;
                    if(areAllSubscribersInitialized) {
                        index = 0;
                        observer(join(get))
                    }
                });
                subscriptions.add(subscription);
            }
            return values[currentIndex];
        }
        observer(join(get))
        areAllSubscribersInitialized = true;
        return subscriptions;
    })
}
export const store = <T>(defaultValue: T): WriteStore<T> => {
    return new WriteStore(defaultValue);
}

class WriteStore<T> implements Subscribable<T> {
    private value: T;
    private subscribers: Subscriber<T>[];

    constructor(value: T) {
        this.value = value;
        this.subscribers = [];
    }

    subscribe(subscriber: (value: T) => void): Subscription {
        subscriber(this.value);
        this.subscribers.push(subscriber);
        return { unsubscribe: () => {
            const index = this.subscribers.indexOf(subscriber);
            if (index > -1) {
                this.subscribers.splice(index, 1);
            }
            }
        };
    }

    set(value: T) {
        this.value = value;
        this.subscribers.forEach(subscriber => subscriber && subscriber(this.value));
    }

    update(updateFunction: (currentValue: T) => T) {
        this.set(updateFunction(this.value))
    }

    map<R>(mapperFunction: (value: T) => R) {
        return mapFunc(this, mapperFunction);
    }

    pick(key: keyof T) {
        return this.map(o => o[key]);
    }

    snapshot(): T {
        let value;
        this.subscribe(v => value = v).unsubscribe();
        return value;
    }

    getSubscriberCount(): number {
        return this.subscribers.length;
    }
}

export interface Subscriber<T> {
    (value: T) : void;
}

export interface Subscription {
    unsubscribe();
}

//4368 --> 4256 --> 4143 --> 4076

export const multiSubscription = (subscribtions: Subscription[]): Subscription => {
    if(subscribtions.length == 0) return undefined;
    return {unsubscribe: () => subscribtions.forEach( s => s.unsubscribe())};
}

export interface Get {
    <T> (drop: Box<T>) : T
}

export interface Subscribable<T> {
    subscribe(subscriber: Subscriber<T>): Subscription;
}

export abstract class Box<T> implements Subscribable<T>{
    abstract subscribe(subscriber: Subscriber<T>): Subscription;

    map<R>(mapperFunction: (value: T) => R) {
        return new ReadBox<R>(subscriber => {
            return this.subscribe( val => subscriber(mapperFunction(val)))
        })
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


class ReadBox<T> extends Box<T> {
    private _subscribe: (subscriber: Subscriber<T>) => Subscription;

    constructor( subscribe: (subscriber: Subscriber<T>) => Subscription) {
        super();
        this._subscribe = subscribe;
    }

    subscribe(subscriber: Subscriber<T>): Subscription {
        return this._subscribe(subscriber);
    }
}

export const join = <R>(join: (get: Get) => R): Box<R> => {
    return new ReadBox<R>(observer => {
        let areAllSubscribersInitialized = false;
        const values = [];
        const subscriptions: Subscription[] = [];
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
                subscriptions.push(subscription);
            }
            return values[currentIndex];
        }
        observer(join(get))
        areAllSubscribersInitialized = true;
        return multiSubscription(subscriptions);
    })
}
export const box = <T>(defaultValue: T): WriteBox<T> => {
    return new WriteBox(defaultValue);
}

export class WriteBox<T> extends Box<T> {
    private value: T;
    private subscribers: Subscriber<T>[];

    constructor(value: T) {
        super();
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

    getSubscriberCount(): number {
        return this.subscribers.length;
    }
}

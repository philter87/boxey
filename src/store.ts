export interface Subscriber<T> {
    (value: T) : void;
}

export interface Subscription {
    unsubscribe();
}

export interface Get {
    <T> (drop: Store<T>) : T
}

interface Subscribable<T> {
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
        const subscriptions: Subscription[] = [];
        let index = 0;
        const get = <Q>(s: Subscribable<Q>) => {
            const currentIndex = index++;
            if(!areAllSubscribersInitialized){
                subscriptions[currentIndex] = s.subscribe( val => {
                    values[currentIndex] = val;
                    if(areAllSubscribersInitialized) {
                        index = 0;
                        observer(join(get))
                    }
                });
            }
            return values[currentIndex];
        }
        observer(join(get))
        areAllSubscribersInitialized = true;
        return {unsubscribe : () => subscriptions.forEach( sub => sub.unsubscribe()) };
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
        const index = this.subscribers.push(subscriber);
        return { unsubscribe: () => delete this.subscribers[index-1] };
    }

    set(value: T) {
        this.value = value;
        this.subscribers.forEach(o => o && o(this.value));
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
}

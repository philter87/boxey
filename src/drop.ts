export interface Unsubscribe {
    (): void;
}

export interface Subscriber<T> {
    (value: T) : void;
}
export interface Get {
    <T> (drop: Drop<T>) : T
}

interface Subscribable<T> {
    subscribe(subscriber: Subscriber<T>): Unsubscribe;
}

export interface Drop<T> extends Subscribable<T>{
    map<R>(mapperFunction: (value: T) => R);
    pick(key: keyof T);
    snapshot(): T;
}

const mapFunc = <T,R>(source: Subscribable<T>, mapperFunction: (value: T) => R) => {
    return new ReadDrop<R>(subscriber => {
        return source.subscribe( val => subscriber(mapperFunction(val)))
    })
}

class ReadDrop<T> implements Drop<T>{
    private _subscribe: (subscriber: Subscriber<T>) => Unsubscribe;

    constructor( subscribe: (subscriber: Subscriber<T>) => Unsubscribe) {
        this._subscribe = subscribe;
    }

    subscribe(subscriber: Subscriber<T>): Unsubscribe {
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
        this.subscribe(v => v = value)();
        return value;
    }
}

export const join = <R>(join: (get: Get) => R): Drop<R> => {
    return new ReadDrop<R>(observer => {
        let areAllSubscribersInitialized = false;
        const values = [];
        const unsubscribes: Unsubscribe[] = [];
        let index = 0;
        const get = <Q>(s: Subscribable<Q>) => {
            const currentIndex = index++;
            if(!areAllSubscribersInitialized){
                unsubscribes[currentIndex] = s.subscribe( val => {
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
        return () => unsubscribes.forEach( unsub => unsub());
    })
}
export const drop = <T>(defaultValue: T): WriteDrop<T> => {
    return new WriteDrop(defaultValue);
}

class WriteDrop<T> implements Drop<T> {
    private value: T;
    private subscribers: Subscriber<T>[];

    constructor(value: T) {
        this.value = value;
        this.subscribers = [];
    }

    subscribe(subscriber: (value: T) => void): Unsubscribe {
        subscriber(this.value);
        const index = this.subscribers.push(subscriber);
        return () => delete this.subscribers[index-1];
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
        this.subscribe(v => value = v)();
        return value;
    }
}

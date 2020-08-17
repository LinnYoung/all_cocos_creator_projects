export interface EventObserver {
    eventObserver: boolean
}

type EventTarget = cc.Node | cc.Component | EventObserver

interface EventHandler {
    callback: Function
    callbackTarget: EventTarget
    once: boolean
}

class EventManager {
    private _events: Set<Event> = new Set()

    public register(e: Event) {
        this._events.add(e)
    }

    constructor() {
        setInterval(this.intervalCleanup.bind(this), 10000)
    }

    private _deleteMark: Event[] = []

    private intervalCleanup() {
        this._events.forEach(e => {
            if (!cc.isValid(e.emitter)) {
                this._deleteMark.push(e)
            } else {
                e.purgeUnavailable()
            }
        })
        if (this._deleteMark.length > 0) {
            // console.log('删除过期的Event对象', this._deleteMark.length)
            this._deleteMark.forEach(e => {
                this._events.delete(e)
            })
            this._deleteMark.length = 0
        }
    }
}

const eventManager = new EventManager()

export class Event {
    private handlers: Array<EventHandler> = null

    private _emitter: any = null

    constructor(emitter: any) {
        this._emitter = emitter
        eventManager.register(this)
    }

    get emitter() {
        return this._emitter
    }

    get empty(): boolean {
        return this.handlers === null || this.handlers.length === 0
    }

    attach(callback: Function, callbackTarget: EventTarget) {
        if (this.handlers === null) {
            this.handlers = []
        }
        this.handlers.push({
            callback,
            callbackTarget,
            once: false
        })
    }

    once(callback: Function, callbackTarget: EventTarget) {
        if (this.handlers === null) {
            this.handlers = []
        }
        this.handlers.push({
            callback,
            callbackTarget,
            once: true
        })
    }

    detach(callback: Function, callbackTarget: EventTarget) {
        if (this.handlers === null) {
            return
        }
        for (let i = this.handlers.length - 1; i >= 0; --i) {
            let hd = this.handlers[i]
            if (
                hd.callback === callback &&
                hd.callbackTarget === callbackTarget
            ) {
                this.handlers.splice(i, 1)
            }
        }
    }

    detachForObject(callbackTarget: Object) {
        if (this.handlers === null) {
            return
        }
        for (let i = this.handlers.length - 1; i >= 0; --i) {
            let hd = this.handlers[i]
            if (hd.callbackTarget === callbackTarget) {
                this.handlers.splice(i, 1)
            }
        }
    }

    detachAll() {
        if (this.handlers === null) {
            return
        }
        this.handlers = null
    }

    purgeUnavailable() {
        if (this.handlers === null) {
            return
        }
        for (let i = this.handlers.length - 1; i >= 0; --i) {
            let hd = this.handlers[i]
            let exist = true
            if (hd.callbackTarget !== undefined) {
                if (hd.callbackTarget instanceof cc.Node) {
                    exist = cc.isValid(hd.callbackTarget)
                } else if (hd.callbackTarget instanceof cc.Component) {
                    exist = cc.isValid(hd.callbackTarget)
                } else {
                    let observer = hd.callbackTarget['_eventObserver']
                    exist = observer === undefined || observer
                }
            }
            if (!exist) {
                this.handlers.splice(i, 1)
            }
        }
    }

    trigger(...args) {
        if (this.handlers === null) {
            return
        }
        this.purgeUnavailable()
        for (let i = this.handlers.length - 1; i >= 0; --i) {
            let hd = this.handlers[i]
            hd.callback.call(hd.callbackTarget, ...args)
            if (hd.once) {
                this.handlers.splice(i, 1)
            }
        }
    }
}

export class Event1<T> extends Event {
    attach(callback: (a1: T) => void, callbackTarget: EventTarget) {
        super.attach(callback, callbackTarget)
    }

    once(callback: (a1: T) => void, callbackTarget: EventTarget) {
        super.once(callback, callbackTarget)
    }

    trigger(arg: T) {
        super.trigger(arg)
    }
}

export class Event2<T1, T2> extends Event {
    attach(callback: (a1: T1, a2: T2) => void, callbackTarget: EventTarget) {
        super.attach(callback, callbackTarget)
    }

    once(callback: (a1: T1, a2: T2) => void, callbackTarget: EventTarget) {
        super.once(callback, callbackTarget)
    }

    trigger(arg1: T1, arg2: T2) {
        super.trigger(arg1, arg2)
    }
}

export class Event3<T1, T2, T3> extends Event {
    attach(
        callback: (a1: T1, a2: T2, a3: T3) => void,
        callbackTarget: EventTarget
    ) {
        super.attach(callback, callbackTarget)
    }

    once(
        callback: (a1: T1, a2: T2, a3: T3) => void,
        callbackTarget: EventTarget
    ) {
        super.once(callback, callbackTarget)
    }

    trigger(arg1: T1, arg2: T2, arg3: T3) {
        super.trigger(arg1, arg2, arg3)
    }
}

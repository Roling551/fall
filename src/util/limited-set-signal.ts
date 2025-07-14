import { computed, Signal } from "@angular/core"
import { createForceSignal } from "./force-signal"

export class LimitedSetSignal {
    items = createForceSignal(new Map<any, Signal<number>>())

    constructor(public maxCapacity: Signal<number>) {}

    currentCapacity = computed(()=>{
        let capacity = 0
        for(const [key, size] of this.items.get()) {
            capacity += size()
        }
        return capacity
    })

    add(key: any, size: Signal<number>) {
        if(this.currentCapacity() + size() > this.maxCapacity()) {
            return false
        }
        this.items.get().set(key, size)
        this.items.forceUpdate()
        return true
    }

    delete(key: any) {
        this.items.get().delete(key)
        this.items.forceUpdate()
    }

    isValid = computed(()=> {
        return this.maxCapacity() <= this.currentCapacity()
    })

    canAddMore(more: number) {
        return this.maxCapacity() + more <= this.currentCapacity()
    }
}
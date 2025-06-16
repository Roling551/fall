export class LimitedSet<T> {
    set = new Set<T>
    currentCapacity = 0

    constructor(public maxCapacity: number, public getSize:(item:T)=>number) {}

    add(item: T): boolean {
        if(this.currentCapacity + this.getSize(item) > this.maxCapacity) {
            return false
        }
        this.set.add(item)
        this.currentCapacity += this.getSize(item)
        return true
    }

    delete(item: T) {
        if(this.set.delete(item)) {
            this.currentCapacity -= this.getSize(item)
        }
    }

    values() {
        return this.set.values()
    }
}
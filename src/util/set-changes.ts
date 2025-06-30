import { BehaviorSubject, first, skip, Subject } from "rxjs";
import { createForceSignal, ForceSignal } from "./force-signal";

type ArrayAndChange<T> = {
    array: Set<T>,
    changeType: "None" | "Add" | "Delete",
    change?: T
}

export class SetChangesEmitter<T>{
    items = new Set<T>()
    subject = new BehaviorSubject<ArrayAndChange<T>>({
        array:this.items,
        changeType: "None"
    })
    add(item: T) {
        this.items.add(item)
        this.subject.next({
            array:this.items,
            changeType: "Add",
            change: item
        })
    }
    remove(item: T) {
        this.items.delete(item)
        this.subject.next({
            array:this.items,
            changeType: "Delete",
            change: item
        })
    }
    getListener(
        forEachInit: (item: T)=>{},
        forAdd: (item: T)=>{},
        forDelete: (item: T)=>{})
    {
        return new SetChangesListener(
            this.subject,
            forEachInit,
            forAdd,
            forDelete
        )
    }

}

export class SetChangesListener<T>{
    subscribtion
    constructor(
        public subject: BehaviorSubject<ArrayAndChange<T>>,
        public forEachInit: (item: T)=>{},
        public forAdd: (item: T)=>{},
        public forDelete: (item: T)=>{})
    {
        subject.pipe(first()).subscribe(
            (arrayAndChange=>{
                for(const item of arrayAndChange.array) {
                    forEachInit(item)
                }
            })
        )
        this.subscribtion = subject.pipe(skip(1)).subscribe(
            (arrayAndChange=>{
                if(arrayAndChange.changeType === "Add") {
                    forAdd(arrayAndChange.change!)
                } else if(arrayAndChange.changeType === "Delete") {
                    forDelete(arrayAndChange.change!)
                }
            })
        )
    }
}
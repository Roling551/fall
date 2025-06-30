import { BehaviorSubject, first, skip } from "rxjs";


export class SetChangesEmitter<T>{
    items:T[]=[]
    subject = new BehaviorSubject<T[]>(this.items)
    add(item: T) {
        this.items.push(item)
        this.subject.next(this.items)
    }
    remove(item: T) {
        this.items = this.items.filter(i => i !== item);
        this.subject.next(this.items)
    }
    getListener(
        forAdd: (item: T)=>void,
        forDelete: (item: T)=>void)
    {
        return new SetChangesListener(
            this.subject,
            forAdd,
            forDelete
        )
    }

}

export class SetChangesListener<T>{
    subscribtion
    prieviousItems:T[] = []
    constructor(
        public subject: BehaviorSubject<T[]>,
        public forAdd: (item: T)=>void,
        public forDelete: (item: T)=>void)
    {
        this.subscribtion = subject.pipe().subscribe((items: T[])=>{
            const added = items.filter(x => !this.prieviousItems.includes(x));
            const deleted = this.prieviousItems.filter(x => !items.includes(x));
            for(const item of added) {
                forAdd(item)
            }
            for(const item of deleted) {
                forDelete(item)
            }
            this.prieviousItems = [...items]
        })
    }
    destroy() {
        this.subscribtion.unsubscribe();
    }
}
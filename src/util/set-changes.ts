import { BehaviorSubject, first, skip } from "rxjs";


export class SetChangesEmitter<T,U>{
    items=new Map<T,U>()
    subject = new BehaviorSubject<Map<T,U>>(this.items)
    add(key: T, value: U) {
        this.items.set(key, value)
        this.subject.next(this.items)
    }
    remove(key: T) {
        this.items.delete(key);
        this.subject.next(this.items)
    }
    getListener(
        forAdd: (key: T, value: U)=>void,
        forDelete: (key: T, value: U)=>void)
    {
        return new SetChangesListener(
            this.subject,
            forAdd,
            forDelete
        )
    }

}

export class SetChangesListener<T,U>{
    subscribtion
    prieviousItems:Map<T,U> = new Map<T,U>()
    constructor(
        public subject: BehaviorSubject<Map<T,U>>,
        public forAdd: (key: T, value: U)=>void,
        public forDelete: (key: T, value: U)=>void)
    {
        this.subscribtion = subject.pipe().subscribe((items: Map<T,U>)=>{
            const added = new Map([...items].filter(x => !this.prieviousItems.has(x[0])));
            const deleted = new Map([...this.prieviousItems].filter(x => !items.has(x[0])));
            for(const item of added) {
                forAdd(...item)
            }
            for(const item of deleted) {
                forDelete(...item)
            }
            this.prieviousItems = new Map(items)
        })
    }
    destroy() {
        this.subscribtion.unsubscribe();
    }
}
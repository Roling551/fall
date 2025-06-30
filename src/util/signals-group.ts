import { computed, Signal } from "@angular/core";
import { SetChangesEmitter } from "./set-changes";

export class SignalsGroup<T, U> {
    listener
    output
    signals = new Map<T, {getter:Signal<U>, qualifier: Signal<boolean>}>();
    constructor(
        emitter: SetChangesEmitter<T>,
        qualifier: (item: T)=>boolean,
        getter: (item: T)=>U,
        combinator: (cumulation: U, item: U) => U,
        getCombinatorInitialValue: ()=>U
    ) {
        this.listener = emitter.getListener(
            (item: T)=>{
                this.signals.set(item, {getter:computed(()=>getter(item)), qualifier:computed(()=>qualifier(item))})
            },
            (item: T)=>{
                this.signals.delete(item)
            },
        )
        this.output = computed(()=>{
            let cumulation = getCombinatorInitialValue()
            for(const[key, value] of this.signals) {
                if(value.qualifier()) {
                    cumulation = combinator(cumulation, value.getter())
                }
            }
            return cumulation
        })
    }


}
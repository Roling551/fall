import { computed, Signal } from "@angular/core";
import { SetChangesEmitter } from "./set-changes";
import { createForceSignal } from "./force-signal";

export class SignalsGroup<T, U> {
    public output
    private listener
    private signals = createForceSignal(new Map<T, {getter:Signal<U>, qualifier: Signal<boolean>}>());
    constructor(
        emitter: SetChangesEmitter<T>,
        qualifier: (item: T)=>boolean,
        getter: (item: T)=>U,
        combinator: (cumulation: U, item: U) => U,
        getCombinatorInitialValue: ()=>U
    ) {
        this.listener = emitter.getListener(
            (item: T)=>{
                this.signals.get().set(item, {getter:computed(()=>getter(item)), qualifier:computed(()=>qualifier(item))})
                this.signals.forceUpdate()
            },
            (item: T)=>{
                this.signals.get().delete(item)
                this.signals.forceUpdate()
            },
        )
        this.output = computed(()=>{
            let cumulation = getCombinatorInitialValue()
            for(const[key, value] of this.signals.get()) {
                if(value.qualifier()) {
                    cumulation = combinator(cumulation, value.getter())
                }
            }
            return cumulation
        })
    }


}
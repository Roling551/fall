import { computed, Signal } from "@angular/core";
import { SetChangesEmitter, SignalChangesEmitter } from "./set-changes";
import { createForceSignal } from "./force-signal";

export class SignalsGroup<T, U, V> {
    public output
    private listener
    private signals = createForceSignal(new Map<T, {getter:Signal<V>, qualifier: Signal<boolean>}>());
    constructor(
        emitter: SetChangesEmitter<T, U> | SignalChangesEmitter<T, U>,
        qualifier: (key: T, value: U)=>boolean,
        getter: (key: T, value: U)=>V,
        combinator: (cumulation: V, item: V) => V,
        getCombinatorInitialValue: ()=>V
    ) {
        this.listener = emitter.getListener(
            (key: T, value: U)=>{
                this.signals.get().set(key, {getter:computed(()=>getter(key, value)), qualifier:computed(()=>qualifier(key, value))})
                this.signals.forceUpdate()
            },
            (key: T, value: U)=>{
                this.signals.get().delete(key)
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
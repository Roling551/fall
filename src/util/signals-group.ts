import { computed, Signal } from "@angular/core";
import { SetChangesEmitter, SignalChangesEmitter } from "./set-changes";
import { createForceSignal } from "./force-signal";
import { Addable } from "./addable";

export class SignalsGroup<T, U, V> {
    public output
    private listener
    private signals = createForceSignal(new Map<T, {getter:Signal<V>, qualifier: Signal<boolean>}>());
    constructor(
        emitter: SetChangesEmitter<T, U> | SignalChangesEmitter<T, U>,
        qualifier: Signal<(key: T, value: U)=>boolean>,
        getter: (key: T, value: U)=>V,
        combinator: (cumulation: V, item: V) => V,
        getCombinatorInitialValue: ()=>V
    ) {
        this.listener = emitter.getListener(
            (key: T, value: U)=>{
                this.signals.get().set(key, {getter:computed(()=>getter(key, value)), qualifier:computed(()=>qualifier()(key, value))})
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
    static getAddableSignalsGroup<T, U, V extends Addable<V>>(
        emitter: SetChangesEmitter<T, U> | SignalChangesEmitter<T, U>,
        qualifier: Signal<(key: T, value: U)=>boolean>,
        getter: (key: T, value: U)=>V,
        getCombinatorInitialValue: ()=>V
    ) {
        return new SignalsGroup(
            emitter,
            qualifier,
            getter,
            (cumulation: V, item: V) => cumulation.add(item),
            getCombinatorInitialValue
        )
    }
}
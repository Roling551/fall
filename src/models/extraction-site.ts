import { computed, Signal, signal } from "@angular/core";
import { LimitedSet } from "../util/limited-set";
import { LimitedSetSignal } from "../util/limited-set-signal";
import { MapEntity } from "./map-entity";
import { createForceSignal } from "../util/force-signal";
import { Extraction } from "./extraction";
import { addNumericalValuesFunctional, substractNumericalValuesFunctional } from "../util/map-functions";



export class ExtractionSiteItem {
    capacity
    constructor(public _capacity: number) {
        this.capacity = signal(_capacity)
    }
}

export class ExtractionSite extends MapEntity{
    readonly type = "extractionSite"

    extractors = createForceSignal(new Map<any, Signal<Map<string, number>>>())
    extractionSiteItems = createForceSignal(new Map<string, ExtractionSiteItem>())

    constructor(public name: string, _extractionSiteItems:[string, number][]) {
        super(name, 0)
        for(const [itemName, capacity] of _extractionSiteItems) {
            this.extractionSiteItems.get().set(itemName, new ExtractionSiteItem(capacity))
        }
        this.extractionSiteItems.forceUpdate()
    }

    canNextTurn = computed(()=>{
        return true
    })

    addExtractor(belongsTo: any, extractionRate: Signal<Map<string, number>>) {
        if(this.extractors.get().has(belongsTo)) {
            return
        }
        this.extractors.get().set(belongsTo, extractionRate)
        this.extractors.forceUpdate()
    }

    getExtractionRates = computed(() => {
        let resultExtraction = new Map<string, number>()
        for(const [_,extraction] of this.extractors.get()) {
            resultExtraction = addNumericalValuesFunctional(resultExtraction, extraction())
        }
        return resultExtraction
    })

    getExtractionLeft = computed(() => {
        let resultExtraction = new Map<string, number>()
        for(const [item, extraction] of this.extractionSiteItems.get()) {
            resultExtraction.set(item, extraction.capacity())
        }
        for(const [_,extraction] of this.extractors.get()) {
            resultExtraction = substractNumericalValuesFunctional(resultExtraction, extraction())
        }
        return resultExtraction
    })
}
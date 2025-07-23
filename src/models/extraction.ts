import { computed, Signal } from "@angular/core";
import { Coordiante } from "./coordinate";
import { ExtractionSite, ExtractionSiteItem } from "./extraction-site";
import { KeyValuePair } from "./key-value-pair";
import { Tile } from "./tile";
import { createForceSignal } from "../util/force-signal";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { Benefit } from "./benefit";

export interface ExtractionSettings {
    changeStep: number;
    maxExtraction: number;
}

// export class ExtractionSource {
//     constructor(public item: string, public siteLocation: KeyValuePair<Coordiante, Tile>){}

//     getKey() {
//         return this.siteLocation.key.getKey() + "_" + this.item
//     }
// }

export class Extraction {
    sources = createForceSignal(new Map<string, Map<string, number>>())
    constructor(
        public possibleExtractionItems: Set<string>,
        public producedList: Map<string, number>,
        public possibeBenefits: Map<string,Benefit>, 
        public settings: ExtractionSettings = {changeStep:1, maxExtraction: Infinity}){}

    changeExtraction(location: Coordiante, item: string, change: number) {
        const s = this.sources.get()
        let items
        if(!s.has(location.getKey())) {
            items = new Map<string, number>()
            s.set(location.getKey(), items)
        } else {
            items = s.get(location.getKey())
        }
        let n = 0
        if(items!.has(item)) {
            n = items!.get(item)!
        }
        const newNumber = Math.max(0,change*this.settings.changeStep + n)
        if(newNumber <= this.settings.maxExtraction) {
            items!.set(item, newNumber)
        }
        this.sources.forceUpdate()
    }

    canIncreaseExtraction = computed(() => {
        return this.sumOfSources() + this.settings.changeStep <= this.settings.maxExtraction
    })

    sumOfSources = computed(()=>{
        let num = 0
        for(const [_, map1] of this.sources.get()) {
            for(const [_, val] of map1) {
                num += val
            }   
        }
        return num
    })

    benefits: Signal<Map<string,Benefit>> = computed(()=>{
        const result = new Map<string,Benefit>();
        for(const [key, value] of this.possibeBenefits) {
            if(this.sumOfSources()>=1) {
                result.set(key, value)
            }
        }
        return result
    })

    produced = computed(()=> {
        this.sources.get()
        return new Map(multiplyNumericalValuesFunctional(this.producedList, this.sumOfSources()/this.settings.changeStep))
    })
}

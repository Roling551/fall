import { computed, Signal } from "@angular/core";
import { Coordiante } from "./coordinate";
import { ExtractionSite, ExtractionSiteItem } from "./extraction-site";
import { KeyValuePair } from "./key-value-pair";
import { Tile } from "./tile";
import { createForceSignal } from "../util/force-signal";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";


// export class ExtractionSource {
//     constructor(public item: string, public siteLocation: KeyValuePair<Coordiante, Tile>){}

//     getKey() {
//         return this.siteLocation.key.getKey() + "_" + this.item
//     }
// }

export class Extraction {
    sources = createForceSignal(new Map<string, Map<string, number>>())
    constructor(public possibleExtractionItems: Set<string>, public producedList: Map<string, number>){}

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
        items!.set(item, Math.max(0,change + n))
        this.sources.forceUpdate()
    }

    sumOfSources = computed(()=>{
        let num = 0
        for(const [_, map1] of this.sources.get()) {
            for(const [_, val] of map1) {
                num += val
            }   
        }
        return num
    })

    produced = computed(()=> {
        this.sources.get()
        return new Map(multiplyNumericalValuesFunctional(this.producedList, this.sumOfSources()))
    })
}

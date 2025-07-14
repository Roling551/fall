import { Signal } from "@angular/core";
import { Coordiante } from "./coordinate";
import { ExtractionSite, ExtractionSiteItem } from "./extraction-site";
import { KeyValuePair } from "./key-value-pair";
import { Tile } from "./tile";
import { createForceSignal } from "../util/force-signal";


// export class ExtractionSource {
//     constructor(public item: string, public siteLocation: KeyValuePair<Coordiante, Tile>){}

//     getKey() {
//         return this.siteLocation.key.getKey() + "_" + this.item
//     }
// }

export class Extraction {
    sources = createForceSignal(new Map<string, Map<string, number>>())
    constructor(public possibleExtractionItems: Set<string>){}

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
}

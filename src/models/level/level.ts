import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { LevelMap } from "../level-map";
import { KeyValuePair } from "../key-value-pair";
import { Benefit } from "../benefit";
import { Station } from "../station";

export class Level {
    constructor(public map: LevelMap){}

    station = createForceSignal<undefined|KeyValuePair<string, Station>>(undefined)

    canNextTurn = computed(()=>{
        return true;
    })

    public nextTurn() {
    }

    benefits = computed<Map<string, Benefit>>(()=>{
        let result = new Map<string, Benefit>();
        return result
    })

    // toJSON() {
    //     return this
    // }

    // static fromJSON(json: any) {
    //     const level = new Level()
    //     level.map = LevelMap.fromJSON(json["map"]) 
    //     return level
    // }
}
import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { LevelMap } from "../level-map";
import { KeyValuePair } from "../key-value-pair";
import { Benefit } from "../benefit";
import { Station } from "../station";
import { dijkstraAllNodes } from "../../util/path-finding";

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

    distanceFromStation = computed<Map<string, number>>(()=>{
        if(this.station.get()) {
            return new Map(this.map.getDistancesFromTile(this.station.get()!.key).map(x=>[x.node, x.distance]))
        } else {
            return new Map([...this.map.tiles.keys()].map(x=>[x, Infinity]))
        }
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
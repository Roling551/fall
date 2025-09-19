import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { LevelMap } from "../level-map";
import { KeyValuePair } from "../key-value-pair";
import { Benefit } from "../benefit";
import { Coordinate } from "../coordinate";
import { Tile } from "../tile";
import { Estate } from "../estate";
import { TurnActorsService } from "../../services/turn-actors.service";
import { Station } from "../station";

export class Level {
    map = new LevelMap()

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

    toJSON() {
        return this
    }

    static fromJSON(json: any) {
        const level = new Level()
        level.map = LevelMap.fromJSON(json["map"]) 
        return level
    }
}
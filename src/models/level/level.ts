import { computed } from "@angular/core";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { City } from "../city";
import { LevelMap } from "../level-map";
import { KeyValuePair } from "../key-value-pair";
import { Benefit } from "../benefit";
import { Coordinate } from "../coordinate";
import { Tile } from "../tile";
import { Estate } from "../estate";
import { TurnActorsService } from "../../services/turn-actors.service";

export class Level {
    map = new LevelMap()

    cities = createForceSignal(new Map<string, ForceSignal<City>>());

    canNextTurn = computed(()=>{
        for (const [coordinate, city] of this.cities.get().entries()) {
            if(!city.get().canNextTurn()) {
                return false;
            }
        }
        return true;
    })

    public nextTurn() {
        for (const [coordinate, city] of this.cities.get().entries()) {
            city.get().nextTurn()
        }
    }

    public addCity(coordinate:string, city: ForceSignal<City>) {
        this.cities.get().set(coordinate, city)
        this.cities.forceUpdate()
    }

    public removeCity(tile: KeyValuePair<Coordinate, Tile>) {
        if(tile.value.mapEntity && tile.value.mapEntity.get()?.type === "city") {
        const city = tile.value.mapEntity.get() as City
        for(const [key, value] of city.ownedTiles.get().entries()) {
            value.value.belongsTo.set(undefined);
        }
        city.clearOwnedTiles()
        tile.value.mapEntity.set(undefined);
        this.cities.get().delete(tile.key.getKey())
        this.cities.forceUpdate()
        }
    }

    benefits = computed<Map<string, Benefit>>(()=>{
        let result = new Map<string, Benefit>();
        for(const [key, value] of this.cities.get()) {
            result = new Map([...result, ...value.get().benefits()])
        }
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
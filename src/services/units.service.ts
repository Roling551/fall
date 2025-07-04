import { Injectable } from "@angular/core";
import { Unit } from "../models/unit";
import { Tile } from "../models/tile";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { WorldStateService } from "./world-state.service";
import { createForceSignal } from "../util/force-signal";

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

    constructor(worldStateService:WorldStateService) {}

    unitsPosition = createForceSignal(new Map<Unit, {current:KeyValuePair<Coordiante, Tile>, stationed:KeyValuePair<Coordiante, Tile>}>())

    addUnit(unit: Unit, tile: KeyValuePair<Coordiante, Tile>) {
        tile.value.units.get().add(unit)
        tile.value.units.forceUpdate()
        this.unitsPosition.get().set(unit, {current: tile, stationed:tile})
        tile.value.units.forceUpdate()
    }

    moveUnitStationed(units: Set<Unit>, previousTile: KeyValuePair<Coordiante, Tile>, destinationTile: KeyValuePair<Coordiante, Tile>,) {
        for(const unit of units) {
            previousTile.value.units.get().delete(unit)
            previousTile.value.units.forceUpdate()
            destinationTile.value.units.get().add(unit)
            destinationTile.value.units.forceUpdate()
            this.unitsPosition.get().set(unit, {current: destinationTile, stationed:destinationTile})
        }
    }

    moveUnitsBattle(units: Set<Unit>, previousTile: KeyValuePair<Coordiante, Tile>, destinationTile: KeyValuePair<Coordiante, Tile>,) {
        for(const unit of units) {
            previousTile.value.units.get().delete(unit)
            previousTile.value.units.forceUpdate()
            destinationTile.value.units.get().add(unit)
            destinationTile.value.units.forceUpdate()
            this.unitsPosition.get().get(unit)!["current"] = destinationTile
        }
    }

    backToStationed() {
        for(const [unit, position] of this.unitsPosition.get()) {
            const {current, stationed} = position
            current.value.units.get().delete(unit)
            current.value.units.forceUpdate()
            stationed.value.units.get().add(unit)
            stationed.value.units.forceUpdate()
            position.current = stationed
        }
    }
}
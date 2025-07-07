import { Injectable } from "@angular/core";
import { EnemyUnit, Unit } from "../models/unit";
import { Tile } from "../models/tile";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { WorldStateService } from "./world-state.service";
import { createForceSignal } from "../util/force-signal";
import { UIStateService } from "./ui-state/ui-state.service";
import { Army } from "../models/army";

@Injectable({
  providedIn: 'root'
})
export class BattleService {

    constructor(private worldStateService: WorldStateService) {}

    unitsPosition = createForceSignal(new Map<Unit, KeyValuePair<Coordiante, Tile>>())
    enemyArmies = createForceSignal(new Map<Army, KeyValuePair<Coordiante, Tile>>)

    addUnit(unit: Unit, tile: KeyValuePair<Coordiante, Tile>) {
        tile.value.units.get().add(unit)
        tile.value.units.forceUpdate()
        this.unitsPosition.get().set(unit, tile)
        this.unitsPosition.forceUpdate()
    }

    changeUnitPosition(unit: Unit, previousTile: KeyValuePair<Coordiante, Tile>, destinationTile: KeyValuePair<Coordiante, Tile>,) {
        previousTile.value.units.get().delete(unit)
        previousTile.value.units.forceUpdate()
        destinationTile.value.units.get().add(unit)
        destinationTile.value.units.forceUpdate()
        this.unitsPosition.get().set(unit, destinationTile)
    }

    changeUnitsPosition(units: Set<Unit>, previousTile: KeyValuePair<Coordiante, Tile>, destinationTile: KeyValuePair<Coordiante, Tile>,) {
        for(const unit of units) {
            this.changeUnitPosition(unit, previousTile, destinationTile)
        }
    }

    moveUnits(units: Set<Unit>, previousTile: KeyValuePair<Coordiante, Tile>, path: string[]) {
        if(path.length==0) {
            return previousTile
        }
        
        let movesLeft = Infinity
        for(const unit of units) {
            movesLeft = Math.min(movesLeft, unit.movesLeft)
        }

        while(path.length > 0 && movesLeft>0) {
            const nextLocation = path[0]
            const nextTile = this.worldStateService.tiles.get(nextLocation)!
            const weight = this.worldStateService.getEdgeWeight(previousTile.key.getKey(), nextLocation)
            for(const unit of units) {
                previousTile.value.units.get().delete(unit)
                previousTile.value.units.forceUpdate()
                nextTile.value.units.get().add(unit)
                nextTile.value.units.forceUpdate()
                this.unitsPosition.get().set(unit, nextTile)
                unit.movesLeft -= weight
            }
            movesLeft -= weight
            path.shift()
            previousTile = nextTile
        }
        return previousTile
    }

    startBattle() {
        const startLocation = "0_0"
        const startTile = this.worldStateService.tiles.get(startLocation)
        if(!startTile) {
            return
        }
        const army = new Army()
        this.enemyArmies.get().set(army, startTile)
        const unit = new EnemyUnit("barbarian", 2)
        army.units.get().add(unit)
        army.units.forceUpdate()
        startTile.value.units.get().add(unit)
        startTile.value.units.forceUpdate()
        if(this.worldStateService.cities.get().size<=0) {
            return
        }
        for(const [cityLocation, city] of this.worldStateService.cities.get()) {
            const pathing = this.worldStateService.findPathByKey(startLocation, cityLocation)
            if(!pathing) {
                return
            }
            army.path = pathing.path
            break;
        }
        this.startBattleTurn()
    }

    startBattleTurn() {
        for(const [unit, _] of this.unitsPosition.get()) {
            unit.startBattleTurn()
        }
    }

    deleteUnit(unit: Unit, tile: KeyValuePair<Coordiante, Tile>) {
        tile.value.units.get().delete(unit)
        tile.value.units.forceUpdate()
    }

    endBattle() {
        for(const [unit,tile] of this.unitsPosition.get()) {
            tile.value.units.get().delete(unit)
            tile.value.units.forceUpdate()
            unit.endBattle(this, tile)
        }
        this.enemyArmies.get().clear()
        this.enemyArmies.forceUpdate()
    }

    endBattleTurn() {
       this.moveArmiesToDestination()
       this.startBattleTurn()
    }


    moveArmiesToDestination() {
        for(let [army, previousTile] of this.enemyArmies.get()) {
            if(!army.path || army.path.length <= 0) {
                return
            }
            this.enemyArmies.get().set(army, this.moveUnits(army.units.get(), previousTile, army.path))
        }

    }
}
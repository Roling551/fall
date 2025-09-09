import { Injectable } from "@angular/core";
import { EnemyUnit, Unit } from "../models/unit";
import { Tile } from "../models/tile";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordinate } from "../models/coordinate";
import { createForceSignal } from "../util/force-signal";
import { UIStateService } from "./ui-state/ui-state.service";
import { Army } from "../models/army";
import { getFirstOfSet } from "../util/util";
import { CurrentLevelService } from "./current-level.service";

@Injectable({
  providedIn: 'root'
})
export class BattleService {

    constructor(private levelService: CurrentLevelService) {}

    unitsPosition = createForceSignal(new Map<Unit, KeyValuePair<Coordinate, Tile>>())
    enemyArmies = createForceSignal(new Map<Army, KeyValuePair<Coordinate, Tile>>)

    addUnit(unit: Unit, tile: KeyValuePair<Coordinate, Tile>) {
        tile.value.units.get().add(unit)
        tile.value.units.forceUpdate()
        this.unitsPosition.get().set(unit, tile)
        this.unitsPosition.forceUpdate()
    }

    changeUnitPosition(unit: Unit, previousTile: KeyValuePair<Coordinate, Tile>, destinationTile: KeyValuePair<Coordinate, Tile>,) {
        previousTile.value.units.get().delete(unit)
        previousTile.value.units.forceUpdate()
        destinationTile.value.units.get().add(unit)
        destinationTile.value.units.forceUpdate()
        this.unitsPosition.get().set(unit, destinationTile)
    }

    changeUnitsPosition(units: Set<Unit>, previousTile: KeyValuePair<Coordinate, Tile>, destinationTile: KeyValuePair<Coordinate, Tile>,) {
        for(const unit of units) {
            this.changeUnitPosition(unit, previousTile, destinationTile)
        }
    }

    moveUnits(units: Set<Unit>, previousTile: KeyValuePair<Coordinate, Tile>, path: string[]) {
        const level = this.levelService.level.get()
        if(path.length==0 || !level) {
            return previousTile
        }
        
        let movesLeft = Infinity
        for(const unit of units) {
            movesLeft = Math.min(movesLeft, unit.movesLeft)
        }

        while(path.length > 0 && movesLeft>0) {
            const nextLocation = path[0]
            const nextTile = level.map.tiles.get(nextLocation)!
            this.encounter(units, nextTile)
            const weight = level.map.getEdgeWeight(previousTile.key.getKey(), nextLocation)
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

    encounter(units: Set<Unit>, tile: KeyValuePair<Coordinate, Tile>) {
        const anyUnit = getFirstOfSet(units)
        if(!anyUnit.isEnemyOf(tile.value.units.get())) {
            return
        }
        tile.value.units.get().forEach(unit=>this.deleteUnit(unit, tile))
    }

    startBattle() {
        const level = this.levelService.level.get()
        if(!level) {
            return
        }
        const startLocation = "0_0"
        const startTile = level.map.tiles.get(startLocation)
        if(!startTile) {
            return
        }
        const army = new Army()
        this.enemyArmies.get().set(army, startTile)
        const unit = new EnemyUnit("barbarian", 2)
        army.units.get().add(unit)
        this.addUnit(unit, startTile)
        if(level.cities.get().size<=0) {
            return
        }
        for(const [cityLocation, city] of level.cities.get()) {
            const pathing = level.map.findPathByKey(startLocation, cityLocation)
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

    deleteUnit(unit: Unit, tile: KeyValuePair<Coordinate, Tile>) {
        tile.value.units.get().delete(unit)
        tile.value.units.forceUpdate()
        this.unitsPosition.get().delete(unit)
    }

    endBattle() {
        for(const [unit,tile] of this.unitsPosition.get()) {
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
        const level = this.levelService.level.get()
        if(!level) {
            return
        }
        for(let [army, previousTile] of this.enemyArmies.get()) {
            if(!army.path) {
                return
            }
            if(army.path.length == 0) {
                level.removeCity(previousTile)
            }
            this.enemyArmies.get().set(army, this.moveUnits(army.units.get(), previousTile, army.path))

        }

    }
}
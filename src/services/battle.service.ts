import { Injectable } from "@angular/core";
import { Unit } from "../models/unit";
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

    unitsPosition = createForceSignal(new Map<Unit, {current:KeyValuePair<Coordiante, Tile>, stationed:KeyValuePair<Coordiante, Tile>}>())
    enemyArmies = createForceSignal(new Map<Army, KeyValuePair<Coordiante, Tile>>)

    addPlayerUnit(unit: Unit, tile: KeyValuePair<Coordiante, Tile>) {
        tile.value.units.get().add(unit)
        tile.value.units.forceUpdate()
        this.unitsPosition.get().set(unit, {current: tile, stationed:tile})
        this.unitsPosition.forceUpdate()
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

    startBattle() {
        const startLocation = "0_0"
        const startTile = this.worldStateService.tiles.get(startLocation)
        if(!startTile) {
            return
        }
        const army = new Army()
        this.enemyArmies.get().set(army, startTile)
        const unit = new Unit("barbarian", 2, false)
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
        for(const [army, _] of this.enemyArmies.get()) {
            army.movesLeft.set(army.speed())
        }
    }

    endBattle() {
        this.backToStationed()
        for(const [army, tile] of this.enemyArmies.get()) {
            for(const unit of army.units.get()) {
                tile.value.units.get().delete(unit)
                tile.value.units.forceUpdate()
            }
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
            while(army.path?.length > 0 && army.movesLeft()>0) {
                const destination = army.path[0]
                const destinationTile = this.worldStateService.tiles.get(destination)!
                for(const unit of army.units.get()) {
                    previousTile.value.units.get().delete(unit)
                    previousTile.value.units.forceUpdate()

                    destinationTile.value.units.get().add(unit)
                    destinationTile.value.units.forceUpdate()
                }
                this.enemyArmies.get().set(army, destinationTile)
                army.path.shift()
                army.movesLeft.update(x=>x-this.worldStateService.getEdgeWeight(previousTile.key.getKey(), destinationTile.key.getKey()))
                previousTile = destinationTile
            }
        }
    }

}
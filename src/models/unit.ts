import { BattleService } from "../services/battle.service"
import { Coordiante } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Tile } from "./tile"

export abstract class Unit {
    movesLeft
    constructor(public name:string, public speed: number, public belongsToPlayer=true) {
        this.movesLeft = speed
    }

    startBattleTurn() {
        this.movesLeft = this.speed
    }

    abstract endBattle(battleService: BattleService, tile: KeyValuePair<Coordiante, Tile>): void;
}

export class PlayerUnit extends Unit{
    constructor(name:string, speed: number, public stationedTile: KeyValuePair<Coordiante, Tile>) {
        super(name, speed, true)
    }

    override endBattle(battleService: BattleService, tile: KeyValuePair<Coordiante, Tile>): void {
        battleService.changeUnitPosition(this, tile, this.stationedTile)
    }
}

export class EnemyUnit extends Unit{
    constructor(name:string, speed: number) {
        super(name, speed, false)
    }

    override endBattle(battleService: BattleService, tile: KeyValuePair<Coordiante, Tile>): void {
        battleService.deleteUnit(this, tile)
    }
}
export class Unit {
    movesLeft
    constructor(public name:string, public speed: number, public belongsToPlayer=true) {
        this.movesLeft = speed
    }

    endBattleTurn() {
        this.movesLeft = this.speed
    }
}
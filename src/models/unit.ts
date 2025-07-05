export class Unit {
    movesLeft
    constructor(public name:string, public speed: number, public belongsToPlayer=true) {
        this.movesLeft = speed
    }

    startBattleTurn() {
        this.movesLeft = this.speed
    }
}
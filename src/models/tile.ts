export class Tile {

    constructor(public key: {x: number, y: number}, public value: {name: string}) {
    }

    getKey() {
        return this.key.x + "-" + this.key.y
    }
}
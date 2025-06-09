export class Coordiante {
    constructor(public x: number, public y: number) {
    }

    getKey() {
        return this.x + "_" + this.y
    }
}
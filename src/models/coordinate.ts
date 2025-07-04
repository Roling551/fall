export class Coordiante {
    constructor(public x: number, public y: number) {
    }

    getKey() {
        return this.x + "_" + this.y
    }

    static getComponents(key: string) {
        return key.split("_").map(n=>Number(n))
    }

    static getKey(x: number, y: number) {
        return x + "_" + y
    }
}
import { TileDirection } from "./tile-direction"

export class Coordiante {

    static fromKey(key: string) {
        const [x, y] = key.split("_").map(n=>Number(n))
        return new Coordiante(x, y)
    }

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

    getNeighbors(sizeX: number, sizeY: number) {
        const neighbors: Coordiante[] = []
        if(this.x>0) {
            neighbors.push(new Coordiante(this.x-1, this.y))
        }
        if(this.x<sizeX-1) {
            neighbors.push(new Coordiante(this.x+1, this.y))
        }
        if(this.y>0) {
            neighbors.push(new Coordiante(this.x, this.y-1))
        }
        if(this.y<sizeY-1) {
            neighbors.push(new Coordiante(this.x, this.y+1))
        }
        return neighbors
    }

    getNeighborsAndDirections(sizeX: number, sizeY: number) {
        const neighbors: {direction: TileDirection, coordinate:Coordiante}[] = []
        if(this.x>0) {
            neighbors.push({direction: "xMinus" ,coordinate:new Coordiante(this.x-1, this.y)})
        }
        if(this.x<sizeX-1) {
            neighbors.push({direction: "xPlus" ,coordinate:new Coordiante(this.x+1, this.y)})
        }
        if(this.y>0) {
            neighbors.push({direction: "yMinus" ,coordinate:new Coordiante(this.x, this.y-1)})
        }
        if(this.y<sizeY-1) {
            neighbors.push({direction: "yPlus" ,coordinate:new Coordiante(this.x, this.y+1)})
        }
        return neighbors
    }
}
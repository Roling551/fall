import { computed } from "@angular/core"
import { dijkstra, dijkstraAllNodes } from "../util/path-finding"
import { Coordinate } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Obstacles } from "./obstacles"
import { RegularResourceSource } from "./resource-source"
import { Tile } from "./tile/tile"
import { TileDirection } from "./tile-direction"

export class LevelMap {
    sizeX = 10
    sizeY = 10

    tiles:Map<string, KeyValuePair<Coordinate, Tile>> = this.createTiles(this.sizeX, this.sizeY)

    private createTile(coordinate: Coordinate) {
        const tile = new Tile(
            coordinate,
            "ground",
            new Obstacles(new Map([["mountain",1]]))
        )
        tile.resourcesSources.addResourceSource("mining", 0, "oil", 10)
        return tile
    }

    private createTiles(sizeX: number, sizeY: number): Map<string, KeyValuePair<Coordinate, Tile>> {
        let tiles = new Map<string, KeyValuePair<Coordinate, Tile>>()
        for(let i = 0; i < sizeX; i++) {
        for(let j = 0; j < sizeY; j++) {
            const coordinate = new Coordinate(i, j)
            const tile = {key:coordinate, value: this.createTile(coordinate)}
            tiles.set(tile.key.getKey(), tile)
        } 
        }
        return tiles
    }

    findPath(start: KeyValuePair<Coordinate, Tile>, end: KeyValuePair<Coordinate, Tile>) {
        return this.findPathByKey(start.key.getKey(), end.key.getKey())
    }

    doesCoordinateExists(coordinate: Coordinate) {
        return coordinate.x>0 && coordinate.x<this.sizeX-1 && coordinate.y>0 && coordinate.y<this.sizeY-1
    }

    getNeighborTiles(coordinate: Coordinate): Map<TileDirection, KeyValuePair<Coordinate, Tile>> {
        const neighbors = new Map<TileDirection, KeyValuePair<Coordinate, Tile>>()
        return new Map(coordinate.getNeighborsAndDirections(this.sizeX, this.sizeY).map(cd=>[cd.direction, this.tiles.get(cd.coordinate.getKey())!]))
    }

    getEdgeWeight = (from: string, to: string) => 1

    getNeighbors = (node: string) => {
        return Coordinate.fromKey(node).getNeighbors(this.sizeX, this.sizeY).map(coordiante=>coordiante.getKey())
    }

    findPathByKey(start: string, end: string, getEdgeWeight: (from: string, to: string) => number = this.getEdgeWeight) {
        return dijkstra<string>(this.getNeighbors, getEdgeWeight, start, end)
    }

    getReacheableTiles(start: string, distance: number, getEdgeWeight: (from: string, to: string) => number = this.getEdgeWeight) {
        return dijkstraAllNodes(this.getNeighbors, getEdgeWeight, start, distance)
    }

        getDirectionsFunction(condition: (tile: KeyValuePair<Coordinate, Tile>)=>boolean) { 
        return (tileInfoIsAbout: KeyValuePair<Coordinate, Tile>)=> {
            return computed(
                ()=> {
                    const directions = [...this.getNeighborTiles(tileInfoIsAbout.key).entries()].
                    filter(keyV=>!condition(keyV[1])).
                    map(keyV=>keyV[0])
                    return directions
                }
            )
        }
    }

    toJSON() {
        return {
            tiles: [...this.tiles]
        }
    }

    // static fromJSON(json: any) {
    //     const levelMap = new LevelMap();
    //     levelMap.tiles = new Map(json.tiles.map((tileJSON_:any)=>{
    //         const tileJSON = tileJSON_[1]
    //         const coordinate = new Coordinate(tileJSON.key.x, tileJSON.key.y)
    //         const tile = [coordinate.getKey(), {key:coordinate, value: Tile.fromJSON(tileJSON.value)}]
    //         return tile
    //     }))
    //     return levelMap
    // }

    getTile(coordinate: Coordinate) {
        return this.tiles.get(coordinate.getKey())
    }
}
import { computed, Signal } from "@angular/core"
import { dijkstra, dijkstraAllNodes } from "../util/path-finding"
import { Coordinate } from "./coordinate"
import { KeyValuePair } from "./key-value-pair"
import { Obstacles } from "./obstacles"
import { Tile } from "./tile/tile"
import { TileDirection } from "./tile-direction"
import { SimpleTile } from "./tile/simple-tile"
import { EnvironmentMapEntity } from "./environment-map-entity"
import { SignalsGroup } from "../util/signals-group"
import { MovementBonus } from "./bonus"

export class LevelMap {
    bonuses:Map<string, Signal<number>>

    constructor(
        public sizeX: number, public sizeY: number, 
        public tiles:Map<string, KeyValuePair<Coordinate, Tile>>, movementBonuses: (tile: Tile) => SignalsGroup<string, MovementBonus, number>
    ) {
        this.bonuses = new Map(Array.from(this.tiles.entries()).map(([key, value]) => [key, movementBonuses(value.value).output]))
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

    getEdgeWeight = (from: string, to: string) => {
        const tile = this.tiles.get(to)?.value
        if(!tile) {
            return Infinity
        }
        const bonus = this.bonuses.get(to)?.() || 0
        return 1 / (bonus + 1)
    }

    getNeighbors = (node: string) => {
        return Coordinate.fromKey(node).getNeighbors(this.sizeX, this.sizeY).map(coordiante=>coordiante.getKey())
    }

    findPathByKey(start: string, end: string, getEdgeWeight: (from: string, to: string) => number = this.getEdgeWeight) {
        return dijkstra<string>(this.getNeighbors, getEdgeWeight, start, end)
    }

    getReacheableTiles(start: string, distance: number, getEdgeWeight: (from: string, to: string) => number = this.getEdgeWeight) {
        return dijkstraAllNodes(this.getNeighbors, getEdgeWeight, start, distance)
    }

    getDistancesFromTile(start: string) {
        return dijkstraAllNodes(this.getNeighbors, this.getEdgeWeight, start, Infinity, true)
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
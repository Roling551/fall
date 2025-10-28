import { Injectable } from "@angular/core";
import { Coordinate } from "../models/coordinate";
import { EnvironmentMapEntity } from "../models/environment-map-entity";
import { KeyValuePair } from "../models/key-value-pair";
import { Obstacles } from "../models/obstacles";
import { SimpleTile } from "../models/tile/simple-tile";
import { Tile } from "../models/tile/tile";
import { getRandomVoronoi } from "../util/voronoi";
import { RewardFactoryService } from "./reward-factory.service";

@Injectable({
  providedIn: 'root'
})
export class LevelMapFactoryService {

    constructor(private rewardFactoryService: RewardFactoryService) {}

    repeat = 20
    terrains = [
        ()=>new EnvironmentMapEntity("forest", 10, new Map([["water", 1]])),
        ()=>new EnvironmentMapEntity("oil", 10, new Map([["oil", 1]])),
        ()=>new EnvironmentMapEntity("scrap", 5, new Map([]), [this.rewardFactoryService.createReward({type:"Decision"})]),
    ]

    private createTile(terrainNumber: number, coordinate: Coordinate) {
        const tile = new SimpleTile(
            coordinate,
            "ground",
            new Obstacles(new Map([]))
        )
        const environmentMapEntity = this.terrains[terrainNumber]()
        tile.addMapEntity(environmentMapEntity);
        return tile
    }

    createTiles(sizeX: number, sizeY: number): Map<string, KeyValuePair<Coordinate, Tile>> {
        let tiles = new Map<string, KeyValuePair<Coordinate, Tile>>()
        const voronoi = getRandomVoronoi(sizeX, sizeY, this.terrains.length * this.repeat)
        for(let i = 0; i < sizeX; i++) {
            for(let j = 0; j < sizeY; j++) {
                const coordinate = new Coordinate(i, j)
                const tile = {key:coordinate, value: this.createTile(voronoi[i][j]%this.terrains.length, coordinate)}
                tiles.set(tile.key.getKey(), tile)
            }
        }
        return tiles
    }
}
import { Injectable } from "@angular/core";
import { Coordinate } from "../models/coordinate";
import { EnvironmentMapEntity } from "../models/environment-map-entity";
import { KeyValuePair } from "../models/key-value-pair";
import { Obstacles } from "../models/obstacles";
import { SimpleTile } from "../models/tile/simple-tile";
import { Tile } from "../models/tile/tile";
import { getRandomVoronoi } from "../util/voronoi";
import { RewardFactoryService } from "./reward-factory.service";
import { chooseRandom } from "../util/random-functions";

@Injectable({
  providedIn: 'root'
})
export class LevelMapFactoryService {

    constructor(private rewardFactoryService: RewardFactoryService) {}

    tilePresets = new Map<string, () => EnvironmentMapEntity[]>([
        ["nothing", () => []],
        ["forest", () => [
            new EnvironmentMapEntity("forest", {
                skill: "mining",
                maxProgress: 5,
                difficulty: 0
            }, 
            new Map([["water", 1]]))]],
        ["oilSource", () => [
            new EnvironmentMapEntity("oil", {
                    skill: "mining",
                    maxProgress: 5,
                    difficulty: 0
                },
                new Map([["oil", 1]])
            ),
            new EnvironmentMapEntity("oil-left")
        ]],
        ["scrapPile", () => [
            new EnvironmentMapEntity(
                "scrap",
                {
                    skill: "mining",
                    maxProgress: 5,
                    difficulty: 0
                },
                undefined,
                () => [
                    this.rewardFactoryService.createReward({
                        type: "Decision",
                        decisionFactoryOptions: [
                            { metaOptionType: "RandomCard", level: [[0.5, 0], [0.5, 1]], rarity: [[0.4, 0], [0.3, 1], [0.3, 2]] },
                            { metaOptionType: "RandomCard", level: 0, rarity: 0 },
                            { type: "Resources", resources: new Map([["scrap", 5]])}
                        ]
                    })
                ]
            )
        ]]
    ]);

    repeat = 20
    terrains = [
        ()=>{
            return chooseRandom(
                [[0.7, "forest"],[0.3, "empty"]]
            )
        },
        ()=>{
            return chooseRandom(
                [[0.7, "oilSource"],[0.3, "empty"]]
            )
        },
        ()=>{
            return chooseRandom(
                [[0.3, "scrapPile"],[0.7, "empty"]]
            )
        }
    ]

    private createTile(terrainNumber: number, coordinate: Coordinate) {
        const tile = new SimpleTile(
            coordinate,
            "ground",
            new Obstacles(new Map([]))
        )
        const environmentMapEntities = this.tilePresets.get(this.terrains[terrainNumber]())?.()
        if(environmentMapEntities) {
            for(const entity of environmentMapEntities) {
                tile.addMapEntity(entity)
            }
        }
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
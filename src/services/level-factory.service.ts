import { Injectable } from "@angular/core";
import { LevelGoalsService } from "./level-goals.service";
import { BenefitsService } from "./benefits.service";
import { LevelMap } from "../models/level-map";
import { Level } from "../models/level/level";
import { LevelMapFactoryService } from "./level-map-factory.service";
import { Coordinate } from "../models/coordinate";
import { KeyValuePair } from "../models/key-value-pair";
import { Tile } from "../models/tile/tile";

type LevelInfo = {
}

const levels: LevelInfo[] = [
    {
    },
    {
    }
]

@Injectable({
  providedIn: 'root'
})
export class LevelFactoryService {

    constructor(
        private levelGoalsService: LevelGoalsService,
        private benefitsService: BenefitsService,
        private levelMapFactoryService: LevelMapFactoryService,
    ) {}

    createLevel(levelNumber: number) {
        const xSize = 16
        const ySize = 16

        const tiles = this.levelMapFactoryService.createTiles(xSize, ySize)

        const levelMap = new LevelMap(
            xSize, ySize,
            tiles,
            this.benefitsService.listenForMovementBonuses)
        this.levelGoalsService.nextLevel()
        this.levelGoalsService.setGoals({goalsRequired: 2}, [
            {type: "resources", resources: new Map([["oil", 30]])},
            {type: "turnsPassed", turns: 3}
        ])
        const level = new Level(levelMap)
        return level

    }
}
import { Injectable } from "@angular/core";
import { Level } from "../models/level/level";
import { createForceSignal } from "../util/force-signal";
import { CurrentLevelService } from "./current-level.service";
import { TurnActorsService } from "./turn-actors.service";
import { ResourcesService } from "./resources.service";
import { LevelGoalsService } from "./level-goals.service";
import { LevelInfo } from "../models/level-info";
import { LevelMap } from "../models/level-map";
import { BenefitsService } from "./benefits.service";
import { LevelMapFactoryService } from "./level-map-factory.service";

@Injectable({
  providedIn: 'root'
})
export class LevelsService {
    constructor(
        private currentLevelService: CurrentLevelService, 
        private turnActorService: TurnActorsService,
        private resourcesService: ResourcesService,
        private levelGoalsService: LevelGoalsService,
        private benefitsService: BenefitsService,
        private levelMapFactoryService: LevelMapFactoryService,
    ) {}
    
    nextLevel() {
        const xSize = 16
        const ySize = 16

        const tiles = this.levelMapFactoryService.createTiles(xSize, ySize)

        const levelMap = new LevelMap(
            xSize, ySize,
            tiles,
            this.benefitsService.listenForMovementBonuses)
        const level = new Level(levelMap)
        this.currentLevelService.level.set(level)
        this.currentLevelService.levelInfo.set(
            new LevelInfo(
                [
                    {type:"resources", resources: new Map([["oil", 20]])}
                ]))
        this.turnActorService.clear()
    }

    canNextLevel() {
        return this.levelGoalsService.isGoalsMet()
    }
}
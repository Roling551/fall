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

@Injectable({
  providedIn: 'root'
})
export class LevelsService {
    constructor(
        private currentLevelService: CurrentLevelService, 
        private turnActorService: TurnActorsService,
        private resourcesService: ResourcesService,
        private levelGoalsService: LevelGoalsService,
        private benefitsService: BenefitsService
    ) {}
    
    nextLevel() {
        this.currentLevelService.level.set(new Level(new LevelMap(this.benefitsService.listenForMovementBonuses)))
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
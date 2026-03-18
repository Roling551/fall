import { Injectable, signal } from "@angular/core";
import { Level } from "../models/level/level";
import { createForceSignal } from "../util/force-signal";
import { CurrentLevelService } from "./current-level.service";
import { TurnActorsService } from "./turn-actors.service";
import { ResourcesService } from "./resources.service";
import { LevelGoalsService } from "./level-goals.service";
import { LevelMap } from "../models/level-map";
import { BenefitsService } from "./benefits.service";
import { LevelMapFactoryService } from "./level-map-factory.service";
import { TurnService } from "./turn.service";
import { LevelFactoryService } from "./level-factory.service";
import { CharactersCardsService } from "./character-cards/characters-cards.service";

@Injectable({
  providedIn: 'root'
})
export class LevelsService {

    levelNumber = signal(0)

    constructor(
        private currentLevelService: CurrentLevelService, 
        private turnActorService: TurnActorsService,
        private levelGoalsService: LevelGoalsService,
        private turnService: TurnService,
        private levelFactoryService: LevelFactoryService,
        private charactersCardsService: CharactersCardsService,
    ) {}
    
    endLevel() {
        this.levelGoalsService.fulfillGoals()
    }

    nextLevel() {
        const level = this.levelFactoryService.createLevel(this.levelNumber())
        this.currentLevelService.level.set(level)
        this.turnActorService.nextLevel()
        this.turnService.nextLevel()
        this.charactersCardsService.cardsHand.reshuffle()
        this.levelNumber.update(x=>x+1)
    }
}
import { Injectable } from "@angular/core";
import { Level } from "../models/level/level";
import { createForceSignal } from "../util/force-signal";
import { CurrentLevelService } from "./current-level.service";
import { TurnActorsService } from "./turn-actors.service";

@Injectable({
  providedIn: 'root'
})
export class LevelsService {
    constructor(private currentLevelService: CurrentLevelService, private turnActorService: TurnActorsService) {}
    
    nextLevel() {
        this.currentLevelService.level.set(new Level())
        this.turnActorService.clear()
    }
}
import { Injectable } from "@angular/core";
import { Level } from "../models/level/level";
import { createForceSignal } from "../util/force-signal";
import { CurrentLevelService } from "./current-level.service";

@Injectable({
  providedIn: 'root'
})
export class LevelsService {
    constructor(private currentLevelService: CurrentLevelService) {}
    
    nextLevel() {
        this.currentLevelService.level.set(new Level())
    }
}
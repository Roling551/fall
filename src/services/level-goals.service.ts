import { computed, Injectable } from "@angular/core";
import { CurrentLevelService } from "./current-level.service";
import { ResourcesService } from "./resources.service";

@Injectable({
  providedIn: 'root'
})
export class LevelGoalsService {
    constructor(private currentLevelService: CurrentLevelService, private resourcesService: ResourcesService) {}

    isGoalsMet = computed(()=>{
        const goals = this.currentLevelService.levelInfo.get()?.levelGoals
        if(!goals) {
            return true
        }
        for(const goal of goals) {
            if(goal.type == "resources") {
                if(!this.resourcesService.canAffordResources(goal.resources)) {
                    return false
                }
            }
        }
        return true
    })
}
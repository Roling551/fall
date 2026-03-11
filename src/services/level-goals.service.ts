import { computed, Injectable, signal } from "@angular/core";
import { CurrentLevelService } from "./current-level.service";
import { ResourcesService } from "./resources.service";
import { LevelGoal, LevelGoalCreationInfo, LevelGoalsInfo } from "../models/level-goals";
import { TurnService } from "./turn.service";
import { createForceSignal } from "../util/force-signal";
import { resourcesToTextParts } from "../models/resource";

@Injectable({
  providedIn: 'root'
})
export class LevelGoalsService {
    constructor(private turnService: TurnService, private resourcesService: ResourcesService) {}

    goalsInfo = signal<LevelGoalsInfo>({goalsRequired: 0})
    goals = createForceSignal<LevelGoal[]>([])

    goalsCheckedNumber = computed(()=>{
        let goalsMet = 0
        for(const goal of this.goals.get()) {
            if(goal.isChecked()) {
                goalsMet += 1
            }
        }
        return goalsMet
    })

    createGoal(levelGoalCreationInfo: LevelGoalCreationInfo): LevelGoal {
        let goal: any
        switch(levelGoalCreationInfo.type) {
            case "resources":
                goal = {
                    isMet: computed(()=>{
                        return this.resourcesService.canAffordResources(levelGoalCreationInfo.resources)
                    }),
                    getDescription: computed(()=>{
                        return ["Spend ", ...resourcesToTextParts(levelGoalCreationInfo.resources)]
                    }),
                    getStatus: computed(()=>{
                        return [...resourcesToTextParts(this.resourcesService.getResourcesLeftToAfford(levelGoalCreationInfo.resources)), " left"]
                    }),
                    fulfill: ()=>{
                        this.resourcesService.spendResources(levelGoalCreationInfo.resources)
                    }
                }
                break;
            case "turnsPassed":
                goal = {
                    isMet: computed(()=>{
                        return this.turnService.turn() >= levelGoalCreationInfo.turns
                    }),
                    getDescription: computed(()=>{
                        return ["Need ", levelGoalCreationInfo.turns.toString(),  " turns passed"]
                    }),
                    getStatus: computed(()=>{
                        return [this.turnService.turn().toString(), "/", levelGoalCreationInfo.turns.toString()]
                    })
                }
                break;
        }
        let isChecked =  signal(false)
        goal.isChecked = computed(()=>isChecked() && goal.isMet())
        goal.check = ()=>{
            if(goal.isMet()) {
                isChecked.update(x=>{
                    return !x
                })
            }
        }
        return goal as LevelGoal
    }

    setGoals(levelGoalsInfo: LevelGoalsInfo, levelGoalsCreationInfo: LevelGoalCreationInfo[]) {
        this.goalsInfo.set(levelGoalsInfo)
        this.goals.set(levelGoalsCreationInfo.map(x=>this.createGoal(x)))
    }

    fulfillGoals() {
        for(const goal of this.goals.get()) {
            if(goal.isMet()) {
                goal.fulfill?.()
            }
        }
    }
}
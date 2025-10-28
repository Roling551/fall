import { Injectable } from "@angular/core";
import { Decision } from "../models/decision";
import { RewardFactoryService } from "./reward-factory.service";
import { RewardOption } from "../models/reward";

@Injectable({
  providedIn: 'root'
})
export class DecisionFactoryService {
    constructor(private rewardFactoryService: RewardFactoryService) {}
    getDecision() {
        const rewardOptions: RewardOption[] = [{type:"Resources", resources:new Map([["oil", 10]])}, {type:"Resources", resources:new Map([["water", 10]])}]
        return new Decision(this.rewardFactoryService.createRewards(rewardOptions)!)
    }
}
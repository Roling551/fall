import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { Decision } from "../models/decision";
import { RewardOption } from "../models/reward";
import { RewardFactoryService } from "./reward-factory.service";

@Injectable({
  providedIn: 'root'
})
export class DecisionsService {
    decisions = createForceSignal<Decision[]>([])

    constructor(private rewardFactoryService: RewardFactoryService) {}

    addDecisionFromRewards(rewardOptions: RewardOption[]) {
        const decision = new Decision(rewardOptions.map(x=>this.rewardFactoryService.createReward(x)))
        this.addDecision(decision)
    }

    addDecision(decision: Decision) {
        this.decisions.get().push(decision)
        this.decisions.forceUpdate()
    }

    removeFirstDecision() {
        this.decisions.get().shift()
        this.decisions.forceUpdate()
    }

    getFirstDecision() {
        return this.decisions.get()[0]
    }
}
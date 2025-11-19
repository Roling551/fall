import { Injectable } from "@angular/core";
import { Decision } from "../models/decision";
import { RewardFactoryService } from "./reward-factory.service";
import { RewardOption } from "../models/reward";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";

export type DecisionFactoryMetaOption = {
    metaOptionType: "RandomCard",
    level: number,
    rarity: 0 | 1 | 2
}

export type DecisionFactoryOption = RewardOption | DecisionFactoryMetaOption

@Injectable({
  providedIn: 'root'
})
export class DecisionFactoryService {
    constructor(private rewardFactoryService: RewardFactoryService, private actionCardList: ActionCardInfoList) {}
    getDecision(decisionFactoryOptions: DecisionFactoryOption[]) {
        const rewardOptions: RewardOption[] = decisionFactoryOptions.map(x=>this.rewardOptionFromMetaOption(x))
        return new Decision(this.rewardFactoryService.createRewards(rewardOptions)!)
    }
    rewardOptionFromMetaOption(option: DecisionFactoryOption): RewardOption {
        if(!("metaOptionType" in option)) {
            return option as RewardOption
        }
        const metaOption = option as DecisionFactoryMetaOption
        if(metaOption.metaOptionType === "RandomCard") {
            const cardName = this.actionCardList.getRandomByLevelAndRarity(metaOption.level, metaOption.rarity, Math.random())
            return {
                type: "Card",
                cardName
            }
        }
        throw new Error("Wrong metaOptionType")
    }
}
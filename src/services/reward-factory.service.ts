import { Injectable, Injector } from "@angular/core";
import { CardReward, DecisionReward, ResourcesReward, Reward, RewardOption } from "../models/reward";
import { InjectorService } from "./injector.service";
import { ResourcesService } from "./resources.service";
import { TurnBenefitsService } from "./turn-benefits.service";
import { Decision } from "../models/decision";

@Injectable({
  providedIn: 'root'
})
export class RewardFactoryService {
    constructor(private injectorService: InjectorService, private resourcesService: ResourcesService, private turnBenefitsService: TurnBenefitsService) {

    }

    createRewards(rewardOptions?: RewardOption[]) {
        return rewardOptions?.map(x=>this.createReward(x))
    }
    
    createReward(rewardOption: RewardOption) {
        switch(rewardOption.type) {
            case "Card":
                const card = rewardOption.card
                return new CardReward(
                    card,
                    ()=>{this.injectorService.getActionsCardsService().addNewCardToDiscard(card)}
                )
            case "Resources":
                return new ResourcesReward(
                    rewardOption.resources,
                    ()=>{
                        this.resourcesService.addResources(rewardOption.resources)
                    }
                )
            case "Decision":
                return new DecisionReward(()=>{
                    const decision = new Decision(rewardOption.decisionFactoryOptions.map(x=>this.createReward(x)))
                    this.injectorService.getDecisionsService().addDecision(decision)
                })
        }
    }
}
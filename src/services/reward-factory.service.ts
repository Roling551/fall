import { Injectable, Injector } from "@angular/core";
import { CardReward, DecisionReward, ExtractionActionBonusReward, ResourcesReward, Reward, RewardOption } from "../models/reward";
import { InjectorService } from "./injector.service";
import { ResourcesService } from "./resources.service";
import { TurnBenefitsService } from "./turn-benefits.service";

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
                const card = this.injectorService.getActionCardInfoList().list.get(rewardOption.cardName)!()
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
            case "ExtractionActionBonus":
                return new ExtractionActionBonusReward(
                    rewardOption.extractionBonus,
                    ()=>{this.turnBenefitsService.addBonus(
                        {
                            type: "extraction-bonus",
                            bonus: rewardOption.extractionBonus
                        }
                    )}
                )
            case "Decision":
                return new DecisionReward(()=>{
                    const decision = this.injectorService.getDecisionFactoryService().getDecision(rewardOption.decisionFactoryOptions)
                    this.injectorService.getDecisionsService().addDecision(decision)
                })
        }
    }
}
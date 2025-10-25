import { Injectable, Injector } from "@angular/core";
import { CardReward, ResourcesReward, Reward, RewardOption } from "../models/reward";
import { InjectorService } from "./injector.service";
import { ResourcesService } from "./resources.service";

@Injectable({
  providedIn: 'root'
})
export class RewardFactoryService {
    constructor(private injectorService: InjectorService, private resourcesService: ResourcesService) {

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
                    ()=>{this.resourcesService.addResources(rewardOption.resources)}
                )
        }
    }
}
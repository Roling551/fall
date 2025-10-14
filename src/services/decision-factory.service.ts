import { Injectable } from "@angular/core";
import { CardDecisionOption, Decision, ResourcesDecisionOption } from "../models/decision";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ResourcesService } from "./resources.service";
import { Resource } from "../models/resource";

export type CreateDecisionOptionInfo = {
    type: "Card",
    cardName: string
} | {
    type: "Resources",
    resources: Map<Resource, number>
}

@Injectable({
  providedIn: 'root'
})
export class DecisionFactoryService {
    constructor(private actionCardInfoList: ActionCardInfoList, private actionsCardsService: ActionsCardsService, private resourcesService: ResourcesService) {}
    createDecision(options: CreateDecisionOptionInfo[]): Decision {
        return new Decision(options.map(x=>{
            switch(x.type) {
                case "Card":
                    const card = this.actionCardInfoList.list.get(x.cardName)!()
                    return new CardDecisionOption(
                        card,
                        ()=>{this.actionsCardsService.addNewCardToDiscard(card)}
                    )
                case "Resources":
                    return new ResourcesDecisionOption(
                        x.resources,
                        ()=>{this.resourcesService.addResources(x.resources)}
                    )
            }
        }))
    }
}
import { Injectable } from "@angular/core";
import { CardDecisionOption, Decision } from "../models/decision";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { ActionsCardsService } from "./action-cards/actions-cards.service";

export type CreateDecisionOptionInfo = {
    type: "Card",
    cardName: string
}

@Injectable({
  providedIn: 'root'
})
export class DecisionFactoryService {
    constructor(private actionCardInfoList: ActionCardInfoList, private actionsCardsService: ActionsCardsService) {}
    createDecision(options: CreateDecisionOptionInfo[]): Decision {
        return new Decision(options.map(x=>{
            switch(x.type) {
                case "Card":
                    const card = this.actionCardInfoList.list.get(x.cardName)!()
                    return new CardDecisionOption(
                        this.actionsCardsService.createMultiStageActionCard(card), 
                        ()=>{this.actionsCardsService.addNewCardToDiscard(card)}
                    ) 
            }
        }))
    }
}
import { Injectable } from "@angular/core";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ActionCardInfo } from "../models/action-card-info";

@Injectable({
  providedIn: 'root'
})
export class CardOnHandRewardService {
    constructor(private actionsCardsService: ActionsCardsService) {}

    nextTurn() {
        if(this.actionsCardsService.cardsSet) {
            for(const card of this.actionsCardsService.cardsSet!.hand.get()) {
                if(card instanceof ActionCardInfo && card.cardOnHandRewards) {
                    for(const reward of card.cardOnHandRewards) {
                        reward.claim()
                    }
                }
            }
        }
    }
}
import { Injectable } from "@angular/core";
import { ActionsCardsService } from "./action-cards/actions-cards.service";

@Injectable({
  providedIn: 'root'
})
export class CardOnHandRewardService {
    constructor(private actionsCardsService: ActionsCardsService) {}

    nextTurn() {
        if(this.actionsCardsService.cardsHand) {
            for(const card of this.actionsCardsService.cardsHand!.hand.get()) {
                if(card.cardOnHandRewards) {
                    for(const reward of card.cardOnHandRewards) {
                        reward.claim()
                    }
                }
            }
        }
    }
}
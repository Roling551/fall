import { Component, computed, Input } from '@angular/core';
import { CardsHand } from '../../models/card-hands/cards-hand';
import { CardInfo } from '../../models/card-info';
import { CardComponent } from '../card/card.component';
import { GroupByCardsHand } from '../../models/card-hands/group-by-cards-hand';

@Component({
  selector: 'app-cards-list',
  imports: [CardComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss'
})
export class CardsListComponent<T extends CardInfo> {
    @Input({required: true}) cardsHand!: GroupByCardsHand<T>;

    constructor() {}

    groups = computed(()=>{
        return this.cardsHand.groupedCards()
    })

    onCardClick(card: T, avaliable: boolean) {
        this.cardsHand.selectCard(card, !avaliable)
    }

    isCardSelected(card: T) {
        return this.cardsHand.isCardSelected(card)
    }

    isCardOverrideSelected(card: T) {
        return this.cardsHand.isCardOverrideSelected(card)
    }

    onDiscardClick() {
        this.cardsHand.discardSelectedCards()
    }

    drawCard() {
        this.cardsHand.manualDraw()
    }
}

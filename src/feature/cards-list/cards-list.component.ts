import { Component, computed, Input } from '@angular/core';
import { CardsHand } from '../../models/card-hands/cards-hand';
import { CardInfo } from '../../models/card-info';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-cards-list',
  imports: [CardComponent],
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss'
})
export class CardsListComponent<T extends CardInfo> {
    @Input({required: true}) cardsHand!: CardsHand<T>;

    constructor() {}

    hand = computed(()=>{
        return this.cardsHand.hand.get()
    })

        onCardClick(card: T) {
        this.cardsHand.selectCard(card)
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

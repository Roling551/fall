import { Component, computed, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { ActionsCardsService } from '../../services/action-cards/actions-cards.service';
import { CardInfo } from '../../models/card-info';
import { CardsHand } from '../../models/cards-hand';

@Component({
  selector: 'app-cards',
  imports: [CardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent<T extends CardInfo> {

    @Input({required: true}) cardsHand!: CardsHand<T>;

    constructor() {}

    hand = computed(()=>{
        return this.cardsHand.hand.get()
    })
    drawSize = computed(()=>{
        return this.cardsHand.drawDeck.get().length
    })
    discardSize = computed(()=>{
        return this.cardsHand.discardDeck.get().length
    })

    onCardClick(card: T) {
        this.cardsHand.selectCard(card)
    }

    isCardSelected(card: T) {
        return this.cardsHand.isCardSelected(card)
    }
}

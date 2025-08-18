import { Component, computed, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { ActionsCardsService } from '../../services/actions-cards.service';
import { CardInfo } from '../../models/card-info';
import { CardsHand } from '../../models/cards-hand';

@Component({
  selector: 'app-cards',
  imports: [CardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {

    @Input({required: true}) cardsHand!: CardsHand;

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

    onCardClick(card: CardInfo) {
        this.cardsHand.selectCard(card)
    }

    isCardSelected(card: CardInfo) {
        return this.cardsHand.isCardSelected(card)
    }
}

import { Component, computed, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CardsService } from '../../services/cards.service';
import { CardInfo } from '../../models/card-info';
import { CardsHand } from '../../models/cards-hand';

@Component({
  selector: 'app-cards',
  imports: [CardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {

    //@Input({required: true}) cardsHand!: CardsHand;

    cardsHand

    constructor(private cardsService: CardsService) {
        this.cardsHand = cardsService.cardHand
    }

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

    selectedCard = computed(()=>{
        return this.cardsHand.selectedCard.get()
    })
}

import { Component, computed, Input } from '@angular/core';
import { CardsHand } from '../../models/card-hands/cards-hand';
import { CardInfo } from '../../models/card-info';
import { CardComponent } from '../card/card.component';
import { GroupByCardsSet } from '../../models/cards-set/group-by-cards-set';

@Component({
  selector: 'app-grouped-cards-list',
  imports: [CardComponent],
  templateUrl: './grouped-cards-list.component.html',
  styleUrl: './grouped-cards-list.component.scss'
})
export class GroupedCardsListComponent<T extends CardInfo> {
    @Input({required: true}) cardsHand!: GroupByCardsSet<T>;
    @Input() forceOverrideClick: boolean = false

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
}

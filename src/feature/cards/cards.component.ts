import { Component, computed } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { CardsService } from '../../services/cards.service';

@Component({
  selector: 'app-cards',
  imports: [CardComponent],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  constructor(private cardsService: CardsService) {}
  hand = computed(()=>{
    return this.cardsService.hand.get()
  })
  drawSize = computed(()=>{
    return this.cardsService.drawDeck.get().length
  })
  discardSize = computed(()=>{
    return this.cardsService.discardDeck.get().length
  })
}

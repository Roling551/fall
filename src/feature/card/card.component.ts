import { Component, Input } from '@angular/core';
import { CardInfo } from '../../models/card-info';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input({required: true}) card!: CardInfo
}

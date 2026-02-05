import { ChangeDetectionStrategy, Component, computed, effect, HostBinding, input, Input } from '@angular/core';
import { CardInfo } from '../../models/card-info';
import { CharacterCardInfo } from '../../models/character-card-info';
import { ActionCardInfo } from '../../models/action-card-info';
import { CardContentCharacterComponent } from '../card-content-character/card-content-character.component';
import { CardContentActionComponent } from '../card-content-action/card-content-action.component';
import { CardOverlayComponent } from '../card-overlay/card-overlay.component';
import { CardOverlayCardInfo } from '../../models/card-overlay-card-info';

@Component({
  selector: 'app-card',
  imports: [CardContentActionComponent, CardContentCharacterComponent, CardOverlayComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
    @Input({required: true}) card!: CardInfo
    avaliable = input(true);

    @HostBinding('class.disabled')
    disabled = false;

    displayedCard = computed(()=>{
        if(this.card instanceof CardOverlayCardInfo) {
            return this.card.overlayedCard
        } else {
            return this.card
        }
    })

    constructor() {
        effect(() => {
            this.disabled = !this.avaliable();
        });
    }

    cardAsCharacterCardInfo = computed(()=>{
        const card = this.displayedCard()
        if(card instanceof CharacterCardInfo) {
            return card as CharacterCardInfo
        }
        return undefined
    })
    cardAsActionCardInfo = computed(()=>{
        const card = this.displayedCard()
        if(card instanceof ActionCardInfo) {
            return card as ActionCardInfo
        }
        return undefined
    })
    cardAsOverlay = computed(()=>{
        const card = this.card
        if(card instanceof CardOverlayCardInfo) {
            return card as CardOverlayCardInfo
        }
        return undefined
    })
}

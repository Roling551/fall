import { ChangeDetectionStrategy, Component, computed, effect, HostBinding, input, Input } from '@angular/core';
import { CardInfo } from '../../models/card-info';
import { CharacterCardInfo } from '../../models/character-card-info';
import { ActionCardInfo } from '../../models/action-card-info';
import { CardContentCharacterComponent } from '../card-content-character/card-content-character.component';
import { CardContentActionComponent } from '../card-content-action/card-content-action.component';
import { CardOverlayComponent } from '../card-overlay/card-overlay.component';

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

    constructor() {
        effect(() => {
            this.disabled = !this.avaliable();
        });
    }

    cardAsCharacterCardInfo = computed(()=>{
        if(this.card instanceof CharacterCardInfo) {
            return this.card as CharacterCardInfo
        }
        return undefined
    })
    cardAsActionCardInfo = computed(()=>{
        if(this.card instanceof ActionCardInfo) {
            return this.card as ActionCardInfo
        }
        return undefined
    })
}

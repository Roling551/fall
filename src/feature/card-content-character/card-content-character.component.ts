import { Component, computed, Input } from '@angular/core';
import { CharacterCardInfo } from '../../models/character-card-info';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';
import { skillsToTextPart } from '../../models/skill';
import { TextPart } from '../../models/text-part';

@Component({
  selector: 'app-card-content-character',
  imports: [TransformTextComponent],
  templateUrl: './card-content-character.component.html',
  styleUrl: './card-content-character.component.scss'
})
export class CardContentCharacterComponent {
    @Input({required: true}) card!: CharacterCardInfo

    skills = computed(()=>{
        return skillsToTextPart(this.card.skills)
    })

    getTexture(card: CharacterCardInfo) {
        return `assets/pictures/${(card.cardPicture||card.name)}.png`
    }

    getCardName(card: CharacterCardInfo): TextPart[] {
        return ["CHARACTER_CARDS.CARD_NAMES."+card.name]
    }
    
    actionDescription = computed(()=>{
        const repeatNumberText = ("repeatNumber" in this.card.actionInfo) ? [this.card.actionInfo.repeatNumber.toString(), "x - "] : []
        return [...repeatNumberText, ...this.card.actionDescription]
    })
}

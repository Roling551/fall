import { Component, computed, Input } from '@angular/core';
import { CharacterCardInfo } from '../../models/character-card-info';
import { skillsToString } from '../../models/skill';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-card-content-character',
  imports: [TransformTextComponent],
  templateUrl: './card-content-character.component.html',
  styleUrl: './card-content-character.component.scss'
})
export class CardContentCharacterComponent {
    @Input({required: true}) card!: CharacterCardInfo

    skills = computed(()=>{
        return skillsToString(this.card.skills)
    })

    getTexture(card: CharacterCardInfo) {
        return `assets/pictures/${(card.cardPicture||card.name)}.png`
    }

    actionDescription = computed(()=>{
        const repeatNumberText = ("repeatNumber" in this.card.actionInfo) ? [this.card.actionInfo.repeatNumber.toString(), "x - "] : []
        return [...repeatNumberText, ...this.card.actionDescription]
    })
}

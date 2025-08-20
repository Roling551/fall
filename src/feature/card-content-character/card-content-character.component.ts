import { Component, computed, Input } from '@angular/core';
import { CharacterCardInfo } from '../../models/character-card-info';
import { skillsToString } from '../../models/skill';

@Component({
  selector: 'app-card-content-character',
  imports: [],
  templateUrl: './card-content-character.component.html',
  styleUrl: './card-content-character.component.scss'
})
export class CardContentCharacterComponent {
    @Input({required: true}) card!: CharacterCardInfo

    skills = computed(()=>{
        return skillsToString(this.card.skills)
    })
}

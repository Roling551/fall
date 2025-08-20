import { Component, computed, Input } from '@angular/core';
import { ActionCardInfo } from '../../models/action-card-info';
import { skillsToString } from '../../models/skill';

@Component({
  selector: 'app-card-content-action',
  imports: [],
  templateUrl: './card-content-action.component.html',
  styleUrl: './card-content-action.component.scss'
})
export class CardContentActionComponent {
    @Input({required: true}) card!: ActionCardInfo

    requiredSkills = computed(()=>{
        return skillsToString(this.card.requiredSkills)
    })
}

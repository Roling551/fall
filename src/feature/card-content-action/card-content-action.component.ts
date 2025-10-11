import { Component, computed, Input } from '@angular/core';
import { ActionCardInfo } from '../../models/action-card-info';
import { skillsToString } from '../../models/skill';
import { resourcesToString } from '../../models/resource';
import { cardOnHandBenefitsToString } from '../../models/card-on-hand-benefit';

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

    price = computed(()=>{
        const price = this.card.price
        if(!price) {
            return undefined
        }
        return resourcesToString(price) 
    })

    cardOnHandBenefits = computed(()=>{
        if(!this.card.cardOnHandBenefits) {
            return ""
        }
        return cardOnHandBenefitsToString(this.card.cardOnHandBenefits)
    })
}

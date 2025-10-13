import { Component, computed, Input } from '@angular/core';
import { ActionCardInfo } from '../../models/action-card-info';
import { skillsToString } from '../../models/skill';
import { resourcesToString } from '../../models/resource';
import { cardOnHandBenefitsToString } from '../../models/card-on-hand-benefit';
import { getFactoryCardInputsReadable } from '../../services/action-cards/action-card-creation-info-factory.service';

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

    cardActionType = computed(()=>{
        return getFactoryCardInputsReadable(this.card.additionalInfo.type)
    })

    cardActionEffect = computed(()=>{
        const effects = []
        const info = this.card.additionalInfo
        if(info.type === "EstateCardInputs") {
            if(info.skillApplied) {
                effects.push("apply:" + skillsToString(info.skillApplied))
            }
            if(info.skillMapActionSkillBonus) {
                effects.push("bonus: " + skillsToString(info.skillMapActionSkillBonus))
            }
            let str = effects.join(",")
            if(info.runCost) {
                str += "/" + resourcesToString(info.runCost)
            }
            return str
        } else if(info.type === "InstantExtractionCardInputs") {
            effects.push(skillsToString(info.skillApplied))
            return effects.join(",")
        }
        return ""
    })
}

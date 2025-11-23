import { Component, computed, Input } from '@angular/core';
import { ActionCardInfo } from '../../models/action-card-info';
import { skillsToString } from '../../models/skill';
import { resourcesToString } from '../../models/resource';
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

    cardOnHandRewards = computed(()=>{
        if(!this.card.cardOnHandRewards) {
            return undefined
        }
        return this.card.cardOnHandRewards.map(x=>x.getText()).join(", ")
    })

    cardActionType = computed(()=>{
        return getFactoryCardInputsReadable(this.card.additionalInfo.type)
    })

    cardActionEffect = computed(()=>{
        const info = this.card.additionalInfo
        if(info.type === "EstateCardInputs") {
            let str = this.card.effectsDescriptions.join(",")
            if(info.runCost) {
                str += "/" + resourcesToString(info.runCost)
            }
            return str
        } else if(info.type === "InstantExtractionCardInputs") {
            return this.card.effectsDescriptions.join(",")
        }
        return ""
    })
    
    getTexture(card: ActionCardInfo) {
        return `assets/pictures/${(card.cardPicture||card.name)}.png`
    }
}

import { Component, computed, Input } from '@angular/core';
import { ActionCardInfo } from '../../models/action-card-info';
import { skillsToString } from '../../models/skill';
import { resourcesToTextParts } from '../../models/resource';
import { getFactoryCardInputsReadable } from '../../services/action-cards/action-card-info-factory.service';
import { TextPart } from '../../models/text-part';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-card-content-action',
  imports: [TransformTextComponent],
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
            return []
        }
        return resourcesToTextParts(price)
    })

    cardOnHandRewards = computed(()=>{
        if(!this.card.cardOnHandRewards) {
            return undefined
        }
        return this.card.cardOnHandRewards.map(x=>x.getTextParts())
    })

    cardActionType = computed(()=>{
        return getFactoryCardInputsReadable(this.card.additionalInfo.type)
    })

    cardActionEffect = computed<TextPart[]>(()=>{
        const info = this.card.additionalInfo
        if(info.type === "EstateCardInputs") {
            let textParts = this.card.effectsDescriptions.flatMap(x=>x)
            if(info.runCost) {
                textParts = textParts.concat(["/", ...resourcesToTextParts(info.runCost)])
            }
            return textParts
        } else if(info.type === "InstantExtractionCardInputs") {
            return this.card.effectsDescriptions.flatMap(x=>x)
        }
        return []
    })
    
    getTexture(card: ActionCardInfo) {
        return `assets/pictures/${(card.cardPicture||card.name)}.png`
    }

    print(t: any) {
        console.log(t)
    }
}

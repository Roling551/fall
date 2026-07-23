import { Component, computed, Input } from '@angular/core';
import { ActionCardInfo } from '../../models/action-card-info';
import { resourcesToTextParts } from '../../models/resource';
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
        return this.card.cardOnHandRewards.flatMap(x=>x.getTextParts())
    })

    cardActionType = computed(()=>{
        return this.card.inputsInfo.operation.name
    })

    cardActionEffect = computed<TextPart[]|undefined>(()=>{
        if(true/*info.type === "EstateCardInputs"*/) {
            let textParts = this.card.effectsDescriptions.flatMap(x=>x)
            // if(info.runCost) {
            //     textParts = textParts.concat(["/", ...resourcesToTextParts(info.runCost)])
            // }
            return textParts
        } else if(false/*info.type === "InstantExtractionCardInputs"*/) {
            return this.card.effectsDescriptions.flatMap(x=>x)
        }
        return undefined
    })
    
    getTexture(card: ActionCardInfo) {
        return `assets/pictures/${(card.cardPicture||card.name)}.png`
    }
}

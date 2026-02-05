import { Component, computed, Input } from '@angular/core';
import { CardOverlayCardInfo } from '../../models/card-overlay-card-info';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';
import { resourcesToTextParts } from '../../models/resource';
import { TextPart } from '../../models/text-part';
import { Skill, skillsToTextPart } from '../../models/skill';

@Component({
  selector: 'app-card-overlay',
  imports: [TransformTextComponent],
  templateUrl: './card-overlay.component.html',
  styleUrl: './card-overlay.component.scss'
})
export class CardOverlayComponent {
    @Input({required: true}) card!: CardOverlayCardInfo

    requiredSqillText = computed<TextPart[]>(()=>{
        return [
            ...(this.card.skillRequired ? skillsToTextPart(this.card.skillRequired): []),
        ]
    })

    priceText = computed<TextPart[]>(()=>{
        return [
            ...(this.card.price ? resourcesToTextParts(this.card.price): [])
        ]
    })
}


import { Component, Input } from '@angular/core';
import { TextPart, getEmoticonSource, getTextPartType } from '../../models/text-part';

@Component({
  selector: 'app-transform-text',
  imports: [],
  templateUrl: './transform-text.component.html',
  styleUrl: './transform-text.component.scss'
})
export class TransformTextComponent {
    @Input({required: true}) textParts!: TextPart[]

    public isEmoticon(part: TextPart) {
        return
    }

    public getEmoticonPicture(part: TextPart) {
        return getEmoticonSource(part)
    }

    getTextPartType(textPart: TextPart) {
        return getTextPartType(textPart)
    }
}

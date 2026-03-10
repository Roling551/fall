import { Component, Input } from '@angular/core';
import { TextPart, getEmoticonSource, getTextPartType, getTextPartsText } from '../../models/text-part';
import { HoverInfoService } from '../../services/hover-info.service';
import { HoverInfoDirective } from '../hover-info.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-transform-text',
  imports: [HoverInfoDirective, TranslateModule],
  templateUrl: './transform-text.component.html',
  styleUrl: './transform-text.component.scss'
})
export class TransformTextComponent {

    constructor(private hoverInfoService: HoverInfoService) {}

    @Input({required: true}) textParts!: TextPart[]

    public isEmoticon(part: TextPart) {
        return
    }

    public getEmoticonPicture(part: TextPart) {
        return getEmoticonSource(part)
    }

    public getTextPartsText(part: TextPart) {
        return getTextPartsText(part)
    }

    getTextPartType(textPart: TextPart) {
        return getTextPartType(textPart)
    }

    getHoverInfo(textPart: TextPart) {
        if(typeof textPart == "string") {
            return undefined
        } else {
            return textPart.hoverInfo
        }
    }

}

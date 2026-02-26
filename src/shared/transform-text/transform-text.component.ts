import { Component, Input } from '@angular/core';
import { TextPart, getEmoticonSource, getTextPartType, getTextPartsText } from '../../models/text-part';
import { HoverInfoService } from '../../services/hover-info.service';

@Component({
  selector: 'app-transform-text',
  imports: [],
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

    enter(event: MouseEvent, textPart: TextPart) {
        let x = event.clientX;
        let y = event.clientY; 
        if(typeof textPart == "string") {
            return
        }
        const hoverInfo = textPart.hoverInfo
        if(!hoverInfo) {
            return
        }
        this.hoverInfoService.enter({textParts: hoverInfo, element: event.target as HTMLElement})
    }
    leave() {
        this.hoverInfoService.leave()
    }
}

import { Injectable, signal } from "@angular/core";
import { TextPart } from "../models/text-part";

export type HoverInfo = {textParts: TextPart[], element: Element}

@Injectable({
  providedIn: 'root'
})
export class HoverInfoService {

    currentHover = signal<HoverInfo|undefined>(undefined)
    private hoverInfoKey = "__hoverInfo"

    mouseEvent(event: MouseEvent) {
        const x = event.clientX
        const y = event.clientY
        const elements = document.elementsFromPoint(x, y);
        let wasAnyDetected = false
        for (const element of elements) {
            const textParts = (element as any)[this.hoverInfoKey] as TextPart[] | undefined;
            if (textParts) {
                wasAnyDetected = true
                this.currentHover.set({textParts, element})
            }
        }
        if(!wasAnyDetected) {
            this.currentHover.set(undefined)
        }
    }
}
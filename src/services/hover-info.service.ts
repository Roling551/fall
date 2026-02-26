import { Injectable, signal } from "@angular/core";
import { TextPart } from "../models/text-part";

export type HoverInfo = {textParts: TextPart[], element: HTMLElement}

@Injectable({
  providedIn: 'root'
})
export class HoverInfoService {

    currentHover = signal<HoverInfo|undefined>(undefined)

    enter(hover: HoverInfo) {
        this.currentHover.set(hover)
    }

    leave() {
        this.currentHover.set(undefined)
    }
}
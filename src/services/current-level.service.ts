import { Injectable } from "@angular/core";
import { Level } from "../models/level/level";
import { createForceSignal } from "../util/force-signal";

@Injectable({
  providedIn: 'root'
})
export class CurrentLevelService {
    level = createForceSignal<Level|undefined>(undefined)
    
}
import { Injectable } from "@angular/core";
import { Level } from "../models/level/level";
import { createForceSignal } from "../util/force-signal";
import { LevelInfo } from "../models/level-info";

@Injectable({
  providedIn: 'root'
})
export class CurrentLevelService {
    level = createForceSignal<Level|undefined>(undefined)
    levelInfo = createForceSignal<LevelInfo|undefined>(undefined)

    save() {
        // const str = JSON.stringify(this.level.get())
        // localStorage.setItem('save_game', str);
    }

    load() {
        // const str = localStorage.getItem('save_game');
        
        // if(str) {
        //     const json = JSON.parse(str)
        //     const obj = Level.fromJSON(json)
        //     this.level.set(obj);
        // }
    }
}
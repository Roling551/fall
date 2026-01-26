import { Component, computed, Input, Signal } from '@angular/core';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { Tile } from '../../models/tile/tile';
import { ForceSignal } from '../../util/force-signal';
import { Skill, skillsToTextPart } from '../../models/skill';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';
import { TextPart } from '../../models/text-part';

@Component({
  selector: 'app-player-action',
  imports: [TransformTextComponent],
  templateUrl: './player-action.component.html',
  styleUrl: './player-action.component.scss'
})
export class PlayerActionComponent<I,T> {
  @Input() repeatInfo?: {
    selectedItems: ForceSignal<Map<I, T>>
    repeatsNumber: number
  }
  @Input() acceptAction?: ()=> void
  @Input() skillInfo?: {
    requiredSkills: Map<Skill, number>,
    sumOfSkills: () => Map<any, any>
  }

  getRepetitionInfo = computed(()=>{
        let str = "" 
        if(this.repeatInfo) {
            str += "Selected: " + this.repeatInfo.selectedItems.get().size + "/" + this.repeatInfo.repeatsNumber
        }
        return str
  })
  getSkillInfo = computed<TextPart[]>(()=>{
    if(!this.skillInfo) {
        return []
    }
    return [...skillsToTextPart(this.skillInfo.sumOfSkills()), "/", ...skillsToTextPart(this.skillInfo.requiredSkills)]
  })
  isWithinLimit = computed(()=> {
    if(!this.repeatInfo) {
        return true
    }
    return this.repeatInfo.selectedItems.get().size <= this.repeatInfo.repeatsNumber
  })
  onAcceptClick(){
    if(this.isWithinLimit()) {
        this.acceptAction!()
    }
  }
}

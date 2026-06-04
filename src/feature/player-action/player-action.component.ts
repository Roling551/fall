import { Component, computed, Input } from '@angular/core';
import { ForceSignal } from '../../util/force-signal';

@Component({
  selector: 'app-player-action',
  imports: [],
  templateUrl: './player-action.component.html',
  styleUrl: './player-action.component.scss'
})
export class PlayerActionComponent<I,T> {
  @Input() repeatInfo?: {
    selectedItems: ForceSignal<Map<I, T>>
    repeatsNumber: number
  }
  @Input() acceptAction?: ()=> void

  getRepetitionInfo = computed(()=>{
        let str = "" 
        if(this.repeatInfo) {
            str += "Selected: " + this.repeatInfo.selectedItems.get().size + "/" + this.repeatInfo.repeatsNumber
        }
        return str
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

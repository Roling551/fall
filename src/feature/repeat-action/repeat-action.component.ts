import { Component, computed, Input, Signal } from '@angular/core';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { Tile } from '../../models/tile/tile';
import { ForceSignal } from '../../util/force-signal';

@Component({
  selector: 'app-repeat-action',
  imports: [],
  templateUrl: './repeat-action.component.html',
  styleUrl: './repeat-action.component.scss'
})
export class RepeatActionComponent<I,T> {
  @Input({required: true}) selectedItems!: ForceSignal<Map<I, T>>
  @Input({required: true}) repeatsNumber!: number
  @Input({required: true}) acceptAction!: ()=> void

  getText = computed(()=>{
    return this.selectedItems.get().size + "/" + this.repeatsNumber
  })
  isWithinLimit = computed(()=> {
    return this.selectedItems.get().size <= this.repeatsNumber
  })
  onAcceptClick(){
    if(this.isWithinLimit()) {
        this.acceptAction()
    }
  }
}

import { Component, computed, Signal } from '@angular/core';
import { WorldStateService } from '../../services/world-state.service';

@Component({
  selector: 'app-game-info-panel',
  imports: [],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {

  canNextTurn: Signal<boolean>

  constructor(public worldStateService: WorldStateService){
    this.canNextTurn = this.worldStateService.canNextTurn
  }

  public turnText = computed(()=>{
    return "Turn: " + this.worldStateService.turn()
  })

  public goldText = computed(()=> {
    return "Gold: " + this.worldStateService.gold()
  })

  onNextTurn() {
    this.worldStateService.nextTurn()
  }
}

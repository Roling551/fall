import { Component, computed, Signal } from '@angular/core';
import { WorldStateService } from '../../services/world-state.service';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { BattleInfoPanelComponent } from '../battle-info-panel/battle-info-panel.component';
import { TurnService } from '../../services/turn-service';

@Component({
  selector: 'app-game-info-panel',
  imports: [],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {

  canNextTurn: Signal<boolean>

  constructor(private worldStateService: WorldStateService, private turnService: TurnService){
    this.canNextTurn = this.turnService.canNextTurn
  }

  public turnText = computed(()=>{
    return "Turn: " + this.turnService.turn()
  })

  public goldText = computed(()=> {
    return "Gold: " + this.worldStateService.resources.get().get("gold")
  })

  onNextTurn() {
    this.turnService.nextTurn()
  }
}

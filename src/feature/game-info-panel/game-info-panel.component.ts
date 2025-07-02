import { Component, computed, Signal } from '@angular/core';
import { WorldStateService } from '../../services/world-state.service';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { BattleInfoPanelComponent } from '../battle-info-panel/battle-info-panel.component';

@Component({
  selector: 'app-game-info-panel',
  imports: [],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {

  canNextTurn: Signal<boolean>

  constructor(private worldStateService: WorldStateService, private uiStateService: UIStateService){
    this.canNextTurn = this.worldStateService.canNextTurn
  }

  public turnText = computed(()=>{
    return "Turn: " + this.worldStateService.turn()
  })

  public goldText = computed(()=> {
    return "Gold: " + this.worldStateService.resources.get().get("gold")
  })

  onNextTurn() {
    this.worldStateService.nextTurn()
    this.uiStateService.setUIMode_.battle()
  }
}

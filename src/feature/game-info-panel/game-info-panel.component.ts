import { Component, computed } from '@angular/core';
import { WorldStateService } from '../../services/world-state.service';

@Component({
  selector: 'app-game-info-panel',
  imports: [],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {
  constructor(public worldStateService: WorldStateService){}

  public turn = computed(()=>{
    return "Turn: " + this.worldStateService.turn()
  })

  onNextTurn() {
    this.worldStateService.nextTurn()
  }
}

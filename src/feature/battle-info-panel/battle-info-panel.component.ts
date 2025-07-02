import { Component } from '@angular/core';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { GameInfoPanelComponent } from '../game-info-panel/game-info-panel.component';

@Component({
  selector: 'app-battle-info-panel',
  imports: [],
  templateUrl: './battle-info-panel.component.html',
  styleUrl: './battle-info-panel.component.scss'
})
export class BattleInfoPanelComponent {

  constructor(private uiStateService: UIStateService){
  }

  onNextTurn() {
    this.uiStateService.setUIMode_.main()
  }
}

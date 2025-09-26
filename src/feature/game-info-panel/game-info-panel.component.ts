import { Component, computed, Signal } from '@angular/core';
import { TurnService } from '../../services/turn.service';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-game-info-panel',
  imports: [],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {

  canNextTurn: Signal<boolean>

  constructor(private resourcesService: ResourcesService, private turnService: TurnService){
    this.canNextTurn = this.turnService.canNextTurn
  }

  public turnText = computed(()=>{
    return "Turn: " + this.turnService.turn()
  })

  public goldText = computed(()=> {
    return "Oil: " + this.resourcesService.resources.get().get("oil")
  })

  onNextTurn() {
    this.turnService.nextTurn()
  }
}

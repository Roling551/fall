import { Component, computed, resource, Signal } from '@angular/core';
import { TurnService } from '../../services/turn.service';
import { ResourcesService } from '../../services/resources.service';
import { TurnActorsService } from '../../services/turn-actors.service';

@Component({
  selector: 'app-game-info-panel',
  imports: [],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {

  canNextTurn: Signal<boolean>

  constructor(private resourcesService: ResourcesService, private turnService: TurnService, private turnActorsService: TurnActorsService){
    this.canNextTurn = this.turnService.canNextTurn
  }

  public turnText = computed(()=>{
    return "Turn: " + this.turnService.turn()
  })

  public resourcesText = computed(() => {
    const resourcesChange = this.turnActorsService.resourcesChange()
    let s = "Resources: "
    for(const [resource, currentAmount] of this.resourcesService.resources.get()) {
        const change = resourcesChange.get(resource)
            s += `${resource} - ${currentAmount || 0}(${change || 0}) `
    }
    return s
  })

  onNextTurn() {
    this.turnService.nextTurn()
  }
}

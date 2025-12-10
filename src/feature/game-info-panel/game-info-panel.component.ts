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
    const requiredResources = this.turnActorsService.requiredResources()
    let s = "Resources: "
    for(const resource of this.resourcesService.resources.get()) {
        s += `${resource[0]} - ${resource[1]}(${requiredResources.get(resource[0])||0}) `
    }
    return s
  })

  onNextTurn() {
    this.turnService.nextTurn()
  }
}

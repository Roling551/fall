import { Component, computed, resource, Signal } from '@angular/core';
import { TurnService } from '../../services/turn.service';
import { ResourcesService } from '../../services/resources.service';
import { TurnActorsService } from '../../services/turn-actors.service';
import { TextPart } from '../../models/text-part';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-game-info-panel',
  imports: [TransformTextComponent],
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

  public resourcesText = computed<TextPart[]>(() => {
    const resourcesChange = this.turnActorsService.resourcesChange()
    let s:TextPart[] = ["Resources: "]
    for(const [resource, currentAmount] of this.resourcesService.resources.get()) {
        const change = resourcesChange.get(resource)
            s.push({
                type: "emoticon",
                emoticon:resource
            }) 
            s.push(`- ${currentAmount || 0}(${change || 0}) `)
    }
    return s
  })

  onNextTurn() {
    this.turnService.nextTurn()
  }
}

import { Component, computed, resource, Signal } from '@angular/core';
import { TurnService } from '../../services/turn.service';
import { ResourcesService } from '../../services/resources.service';
import { TurnActorsService } from '../../services/turn-actors.service';
import { TextPart } from '../../models/text-part';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';
import { CurrentLevelService } from '../../services/current-level.service';
import { toTextParts } from '../../models/level-attributes';

@Component({
  selector: 'app-game-info-panel',
  imports: [TransformTextComponent],
  templateUrl: './game-info-panel.component.html',
  styleUrl: './game-info-panel.component.scss'
})
export class GameInfoPanelComponent {

  canNextTurn: Signal<boolean>

  constructor(private resourcesService: ResourcesService, private turnService: TurnService, private turnActorsService: TurnActorsService, private currentLevelService: CurrentLevelService){
    this.canNextTurn = this.turnService.canNextTurn
  }

  public turnText = computed(()=>{
    return "Turn: " + this.turnService.turn()
  })

  public levelAttributesText = computed<TextPart[]>(()=>{
    return toTextParts(this.currentLevelService.level.get()?.levelAttributes.get() || new Map())
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

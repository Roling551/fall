import { Component, computed, Input } from '@angular/core';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { ForceSignal } from '../../util/force-signal';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { GenericMapEntity } from '../../models/generic-map-entity';

@Component({
  selector: 'app-city-panel',
  imports: [],
  templateUrl: './city-panel.component.html',
  styleUrl: './city-panel.component.scss'
})
export class CityPanelComponent {
  @Input({required: true}) city!: City;
  constructor(public uiStateService: UIStateService) {}

  public onAddTileActionClick() {
    this.uiStateService.setMapAction_.addTileToCity()
  }

  isAddTileSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addTileToCity"
  })

  public onAddFarmActionClick() {
    this.uiStateService.setMapAction_.createGenericMapEntity(()=>new GenericMapEntity("farm", new Map([["food",2], ["food-need", 1]])), "farm")
  }

  isAddFarmSelected = computed(()=>{
    console.log(this.uiStateService.additionalInfo()["currentAction"])
    return this.uiStateService.additionalInfo()["currentAction"] === "createGenericMapEntityAction-farm"
  })

  public onAddTowerActionClick() {
    this.uiStateService.setMapAction_.createGenericMapEntity(()=>new GenericMapEntity("tower", new Map([["authority",5], ["food-need", 1]])), "tower")
  }

  isAddTowerSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "createGenericMapEntityAction-tower"
  })

  public onAddMineActionClick() {
    this.uiStateService.setMapAction_.createGenericMapEntity(()=>new GenericMapEntity("mine", new Map([["gold",1], ["food-need", 1]])), "mine")
  }

  isAddMineSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "createGenericMapEntityAction-mine"
  })

  public onRemoveGenericMapEntityActionClick() {
    this.uiStateService.setMapAction_.removeGenericMapEntity();
  }

  public isRemoveGenericMapEntityActionSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "removeGenericMapEntityAction"
  })
}

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
    this.uiStateService.setMapAction_.addBuilding(()=>new GenericMapEntity("farm", new Map([["food",1]])), "farm")
  }

  isAddFarmSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addBuilding-farm"
  })

  public onAddTowerActionClick() {
    this.uiStateService.setMapAction_.addBuilding(()=>new GenericMapEntity("tower", new Map([["authority",5]])), "tower")
  }

  isAddTowerSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addBuilding-tower"
  })

  public onAddMineActionClick() {
    this.uiStateService.setMapAction_.addBuilding(()=>new GenericMapEntity("mine", new Map([["gold",1]])), "mine")
  }

  isAddMineSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addBuilding-mine"
  })
}

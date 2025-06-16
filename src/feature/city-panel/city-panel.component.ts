import { Component, computed, Input } from '@angular/core';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { ForceSignal } from '../../util/force-signal';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { Estate } from '../../models/estate';

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
    this.uiStateService.setMapAction_.createEstate(()=>new Estate("farm", new Map([["food",2], ["food-need", 1]])), "farm")
  }

  isAddFarmSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "createEstateAction-farm"
  })

  public onAddTowerActionClick() {
    this.uiStateService.setMapAction_.createEstate(()=>new Estate("tower", new Map([["authority",5], ["food-need", 1]])), "tower")
  }

  isAddTowerSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "createEstateAction-tower"
  })

  public onAddMineActionClick() {
    this.uiStateService.setMapAction_.createEstate(()=>new Estate("mine", new Map([["gold",1], ["food-need", 1]])), "mine")
  }

  isAddMineSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "createEstateAction-mine"
  })

  public onRemoveEstateActionClick() {
    this.uiStateService.setMapAction_.removeEstate();
  }

  public isRemoveEstateActionSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "removeEstateAction"
  })
}

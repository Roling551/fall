import { Component, computed, Input } from '@angular/core';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { ForceSignal } from '../../util/force-signal';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';

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

  isAddTileSlected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addTileToCity"
  })

  public onAddBuildingActionClick() {
    this.uiStateService.setMapAction_.addBuilding()
  }

  isAddBuildingSlected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addBuilding"
  })
}

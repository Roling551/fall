import { Component, computed, Input } from '@angular/core';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { ForceSignal } from '../../util/force-signal';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { Estate } from '../../models/estate';
import { Building } from '../../models/building';
import { AvaliableService } from '../../services/avaliable.service';
import { Unit } from '../../models/unit';

@Component({
  selector: 'app-city-panel',
  imports: [],
  templateUrl: './city-panel.component.html',
  styleUrl: './city-panel.component.scss'
})
export class CityPanelComponent {
  @Input({required: true}) city!: ForceSignal<City>;
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>
  constructor(public uiStateService: UIStateService, public avaliableService: AvaliableService) {}

  isMainMode = computed(()=>{return this.uiStateService.uiModeName()==="main"})

  public onAddTileActionClick() {
    this.uiStateService.setMapAction_.addTileToCity()
  }

  isAddTileSelected = computed(()=>{
    return this.uiStateService.additionalInfo()["currentAction"] === "addTileToCity"
  })

  public onAddEstateActionClick(estateName: string, getEstate: ()=> Estate) {
    this.uiStateService.setMapAction_.createEstate(getEstate, estateName)
  }

  public isAddEstateSelected(estateName: string) {
    return computed(()=>{
      return this.uiStateService.additionalInfo()["currentAction"] === "createEstateAction-" + estateName
    })
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

  public onCreateTempleClick() {
    this.city.get().createBuilding(new Building("temple", 1, new Map([["gold",1]])))
    this.city.forceUpdate()
  }

  public onRemoveBuildingClick(building: ForceSignal<Building>) {
    this.city.get().removeBuilding(building)
    this.city.forceUpdate()
  }

  public onAddUnitClick() {
    this.tile.value.units.get().add(new Unit("knight"))
    this.tile.value.units.forceUpdate()
  }
}

import { Component, computed, Input, OnChanges, SimpleChanges } from '@angular/core';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { ForceSignal } from '../../util/force-signal';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { Estate } from '../../models/estate';
import { Building } from '../../models/building';
import { PlayerUnit, Unit } from '../../models/unit';
import { WorldStateService } from '../../services/world-state.service';
import { BattleService } from '../../services/battle.service';
import { Extraction } from '../../models/extraction';
import { BenefitsService } from '../../services/benefits.service';
import { OneTimeJobPanelComponent } from '../one-time-job-panel/one-time-job-panel.component';
import { OneTimeJob } from '../../models/one-time-job';

@Component({
  selector: 'app-city-panel',
  imports: [OneTimeJobPanelComponent],
  templateUrl: './city-panel.component.html',
  styleUrl: './city-panel.component.scss'
})
export class CityPanelComponent{
  @Input({required: true}) city!: ForceSignal<City>;
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>

  public avaliableEstates
  public avaliableExtractions

  constructor(public uiStateService: UIStateService, public battleService: BattleService, public benefitsService: BenefitsService) {
    this.avaliableEstates = this.benefitsService.avaliableEstates
    this.avaliableExtractions = this.benefitsService.avaliableExtractions
  }

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
    const unit = new PlayerUnit("knight", 2, this.tile)
    this.battleService.addUnit(unit, this.tile)
  }

  public onAddExtractionClick(extractionName: string, extractionConstructor: (belongsTo: any)=> Extraction) {
    const extraction = this.city.get().getOrCreateExtraction(extractionName, extractionConstructor)
    this.uiStateService.setMapAction_.addExtraction(extraction);
  }

  public onAddJobClick() {
    this.city.get().addJob(new OneTimeJob("Construction of building", 2, ()=>{console.log("Job done")}))
  }
}

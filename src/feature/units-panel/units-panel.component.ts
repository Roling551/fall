import { AfterViewInit, Component, computed, Input, OnInit } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { Unit } from '../../models/unit';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { createForceSignal } from '../../util/force-signal';
import { SelectedUnitsService } from '../../services/selected-units.service';

@Component({
  selector: 'app-units-panel',
  imports: [],
  templateUrl: './units-panel.component.html',
  styleUrl: './units-panel.component.scss'
})
export class UnitsPanelComponent{

  selectedUnitsSignal
  constructor(public uiStateService: UIStateService, public selectedUnitsServeice: SelectedUnitsService){
    this.selectedUnitsSignal = this.selectedUnitsServeice.selectedUnitsSignal
  }

  @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>

  units = computed(()=>{
    return this.tile.value.units.get()
  })

  onUnitClick(unit: Unit) {
    if(unit.belongsToPlayer) {
      this.selectedUnitsServeice.selectUnit(unit)
    } 
  }

  isUnitSelected(unit: Unit) {
    return this.selectedUnitsSignal.get().has(unit)
  }
}

import { AfterViewInit, Component, computed, Input, OnInit } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { Unit } from '../../models/unit';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { createForceSignal } from '../../util/force-signal';

@Component({
  selector: 'app-units-panel',
  imports: [],
  templateUrl: './units-panel.component.html',
  styleUrl: './units-panel.component.scss'
})
export class UnitsPanelComponent{

  selectedUnitsSignal
  constructor(public uiStateService: UIStateService){
    this.selectedUnitsSignal = this.uiStateService.selectedUnitsSignal
  }

  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>

  units = computed(()=>{
    return this.tile.value.units.get()
  })

  onUnitClick(unit: Unit) {
    this.uiStateService.selectUnit(unit)
  }

  isUnitSelected(unit: Unit) {
    return this.selectedUnitsSignal.get().has(unit)
  }
}

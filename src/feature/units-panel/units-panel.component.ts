import { AfterViewInit, Component, computed, Input, OnInit } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { Unit } from '../../models/unit';
import { UIStateService } from '../../services/ui-state/ui-state.service';

@Component({
  selector: 'app-units-panel',
  imports: [],
  templateUrl: './units-panel.component.html',
  styleUrl: './units-panel.component.scss'
})
export class UnitsPanelComponent implements OnInit{

  constructor(public uiStateService: UIStateService){}

  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>
  @Input() selectedUnits?: Set<Unit>

  ngOnInit(): void {
    this.updateUnitAction()
  }

  units = computed(()=>{
    return this.tile.value.units.get()
  })

  onUnitClick(unit: Unit) {
    if(!this.selectedUnits || this.selectedUnits.size==0) {
      this.selectedUnits = new Set([unit])
    } else {
      if(this.selectedUnits.has(unit)) {
        this.selectedUnits.delete(unit)
      } else {
        this.selectedUnits.add(unit)
      }
    }
    this.updateUnitAction()
  }

  updateUnitAction() {
    if(this.selectedUnits && this.selectedUnits.size > 0) {
      this.uiStateService.setMapAction_.moveUnits(this.tile, this.selectedUnits)
    } else if(this.selectedUnits) {
      this.uiStateService.cancelButtonAction()()
    }
  }

  isUnitSelected(unit: Unit) {
    return this.selectedUnits?.has(unit)
  }
}

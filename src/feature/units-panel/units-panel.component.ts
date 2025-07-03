import { Component, computed, Input } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';

@Component({
  selector: 'app-units-panel',
  imports: [],
  templateUrl: './units-panel.component.html',
  styleUrl: './units-panel.component.scss'
})
export class UnitsPanelComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>

  units = computed(()=>{
    return this.tile.value.units.get()
  })
}

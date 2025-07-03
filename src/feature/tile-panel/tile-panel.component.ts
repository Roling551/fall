import { Component, computed, Input } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { CityPanelComponent } from '../city-panel/city-panel.component';
import { ForceSignal } from '../../util/force-signal';
import { City } from '../../models/city';
import { UnitsPanelComponent } from '../units-panel/units-panel.component';
import { Unit } from '../../models/unit';

@Component({
  selector: 'app-tile-panel',
  imports: [CityPanelComponent, UnitsPanelComponent],
  templateUrl: './tile-panel.component.html',
  styleUrl: './tile-panel.component.scss'
})
export class TilePanelComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>

  entityType = computed(()=>{
    return this.tile.value.mapEntity.get()?.type || "none"
  })

  getCity() {
    return this.tile.value.mapEntity as unknown as ForceSignal<City>
  }
}

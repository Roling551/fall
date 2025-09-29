import { Component, computed, Input } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile/tile';
import { ForceSignal } from '../../util/force-signal';
import { UnitsPanelComponent } from '../units-panel/units-panel.component';
import { Unit } from '../../models/unit';

@Component({
  selector: 'app-tile-panel',
  imports: [UnitsPanelComponent],
  templateUrl: './tile-panel.component.html',
  styleUrl: './tile-panel.component.scss'
})
export class TilePanelComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>

  entityType = computed(()=>{
    return this.tile.value.mapEntity.get()?.type || "none"
  })
}

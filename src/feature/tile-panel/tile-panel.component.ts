import { Component, computed, Input } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile/tile';
import { ForceSignal } from '../../util/force-signal';
import { MapEntityDescriptionComponent } from '../map-entity-description/map-entity-description.component';

@Component({
  selector: 'app-tile-panel',
  imports: [MapEntityDescriptionComponent],
  templateUrl: './tile-panel.component.html',
  styleUrl: './tile-panel.component.scss'
})
export class TilePanelComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StyleVariablesService } from '../../services/style-variables.service';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';

@Component({
  selector: 'app-map-marking',
  imports: [],
  templateUrl: './map-marking.component.html',
  styleUrl: './map-marking.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapMarkingComponent {
  @Input() tile?: KeyValuePair<Coordiante, Tile>;

  sizeX
  sizeY
  constructor(public styleVariablesService: StyleVariablesService) {
    this.sizeX = styleVariablesService.sizeX
    this.sizeY = styleVariablesService.sizeY
  }
  
}

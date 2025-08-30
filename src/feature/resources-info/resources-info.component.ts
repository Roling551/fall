import { Component, Input } from '@angular/core';
import { Tile } from '../../models/tile';
import { Coordiante } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { StyleVariablesService } from '../../services/style-variables.service';

@Component({
  selector: 'app-resources-info',
  imports: [],
  templateUrl: './resources-info.component.html',
  styleUrl: './resources-info.component.scss'
})
export class ResourcesInfoComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>;
  @Input({required: true}) input!: any;

    sizeX
    sizeY
    constructor(public styleVariablesService: StyleVariablesService) {
        this.sizeX = styleVariablesService.sizeX
        this.sizeY = styleVariablesService.sizeY
    }
}

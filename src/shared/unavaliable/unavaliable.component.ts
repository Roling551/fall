import { Component, Input } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { StyleVariablesService } from '../../services/style-variables.service';

@Component({
  selector: 'app-unavaliable',
  imports: [],
  templateUrl: './unavaliable.component.html',
  styleUrl: './unavaliable.component.scss'
})
export class UnavaliableComponent {
    @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>;
    @Input({required: true}) input!: any;

    sizeX
    sizeY

    getTexture(): string {
        return `assets/pictures/unavaliable.png`
    }

    constructor(public styleVariablesService: StyleVariablesService) {
        this.sizeX = styleVariablesService.sizeX
        this.sizeY = styleVariablesService.sizeY
    }

    getImgTop() {
        return (this.sizeY - this.sizeX) / 2
    }
}

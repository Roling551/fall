import { Component, Input } from '@angular/core';
import { StyleVariablesService } from '../../services/style-variables.service';

@Component({
  selector: 'app-map-marking',
  imports: [],
  templateUrl: './map-marking.component.html',
  styleUrl: './map-marking.component.scss'
})
export class MapMarkingComponent {
  sizeX
  sizeY
  constructor(public styleVariablesService: StyleVariablesService) {
    this.sizeX = styleVariablesService.sizeX
    this.sizeY = styleVariablesService.sizeY
  }
  
}

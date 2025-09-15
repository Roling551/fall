import { Component, computed, Input } from '@angular/core';
import { Tile } from '../../models/tile';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { StyleVariablesService } from '../../services/style-variables.service';
import { getResourceSymbol } from '../../models/resource';
import { RegularResourceSource, ResourceSource } from '../../models/resource-source';

@Component({
  selector: 'app-resources-info',
  imports: [],
  templateUrl: './resources-info.component.html',
  styleUrl: './resources-info.component.scss'
})
export class ResourcesInfoComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>;
  @Input({required: true}) input!: any;

    sizeX
    sizeY
    constructor(public styleVariablesService: StyleVariablesService) {
        this.sizeX = styleVariablesService.sizeX
        this.sizeY = styleVariablesService.sizeY
    }

    resourcesTexts = computed(()=>{
        return this.tile?.value.resourcesSources.sources.get().map(x=>this.getText(x))
    })

    getText(resourceSource: ResourceSource){
        if(resourceSource instanceof RegularResourceSource) {
            return getResourceSymbol(resourceSource.resourceType) + "-" + resourceSource.resourceAmount()
        } else {
            return ""
        }
    }
}

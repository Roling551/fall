import { Component, computed, Input } from '@angular/core';
import { Tile } from '../../models/tile/tile';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { StyleVariablesService } from '../../services/style-variables.service';
import { getResourceSymbol } from '../../models/resource';
import { RegularResourceSource, ResourceSource } from '../../models/resource-source';
import { getSkillSymbol, skillsToString } from '../../models/skill';
import { BaseTile } from '../../models/tile/base-tile';

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
        const tile = this.tile?.value
        if(tile instanceof BaseTile) {
            return tile.resourcesSources.sources.get().map(x=>this.getText(x))
        }
        return [""]
    })

    getText(resourceSource: ResourceSource){
        if(resourceSource instanceof RegularResourceSource) {
            return getSkillSymbol(resourceSource.mainSkill) + "-" + resourceSource.difficulty() +
            "=>" +
            getResourceSymbol(resourceSource.resourceType) + "-" + resourceSource.resourceAmount()
        } else {
            return ""
        }
    }
}

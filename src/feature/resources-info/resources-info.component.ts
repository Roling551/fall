import { Component, computed, Input } from '@angular/core';
import { Tile } from '../../models/tile/tile';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { StyleVariablesService } from '../../services/style-variables.service';
import { getResourceSymbol } from '../../models/resource';
import { RegularResourceSource, ResourceSource } from '../../models/resource-source';
import { getSkillSymbol, skillsToString } from '../../models/skill';
import { BaseTile } from '../../models/tile/base-tile';
import { SimpleTile } from '../../models/tile/simple-tile';
import { EnvironmentMapEntity } from '../../models/environment-map-entity';

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
        if(tile instanceof SimpleTile) {
            return tile.environmentMapEntities.get()
                .filter(x=>x instanceof EnvironmentMapEntity)
                .map(x=>x. resourcesSources.sources.get()
                .map(x=>this.getText(x)))
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

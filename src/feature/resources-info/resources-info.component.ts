import { Component, computed, Input } from '@angular/core';
import { Tile } from '../../models/tile/tile';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { StyleVariablesService } from '../../services/style-variables.service';
import { getResourceSymbol, resourcesToString } from '../../models/resource';
import { getSkillSymbol, skillsToString } from '../../models/skill';
import { BaseTile } from '../../models/tile/base-tile';
import { SimpleTile } from '../../models/tile/simple-tile';
import { EnvironmentMapEntity } from '../../models/environment-map-entity';
import { multiplyNumericalValuesFunctional } from '../../util/map-functions';

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
                .map(x=>this.getText(x))
        }
        return [""]
    })

    getText(entity: EnvironmentMapEntity){
        let text =  "" +    
            getSkillSymbol(entity.actee.mainSkill) +
            "[" + entity.actee.difficulty + "]" +
            "->"
        if(entity.resourcesGain.size > 0) {
            text += resourcesToString(multiplyNumericalValuesFunctional(entity.resourcesGain, entity.actee.progressLeft()))
        } else {
            text += entity.actee.progressLeft() + "/" + entity.actee.maxProgress
        }
        return text
    }
}

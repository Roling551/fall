import { Component, computed, Input } from '@angular/core';
import { Tile } from '../../models/tile/tile';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { StyleVariablesService } from '../../services/style-variables.service';
import { SimpleTile } from '../../models/tile/simple-tile';
import { EnvironmentMapEntity } from '../../models/environment-map-entity';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';
import { TextPart } from '../../models/text-part';

@Component({
  selector: 'app-resources-info',
  imports: [TransformTextComponent],
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

    resourcesTexts = computed<TextPart[][]>(()=>{
        const tile = this.tile?.value
        if(tile instanceof SimpleTile) {
            return tile.environmentMapEntities.get()
                .filter(x=>x instanceof EnvironmentMapEntity)
                .map(x=>x.getDescription())
        }
        return [[""]]
    })
}

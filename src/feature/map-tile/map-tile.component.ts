import { Component, computed, Injector, input, Input, Signal } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile/tile';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { CommonModule } from '@angular/common';
import { ForceSignal } from '../../util/force-signal';
import { MapEntity } from '../../models/map-entity';
import { BaseTile } from '../../models/tile/base-tile';
import { StyleVariablesService } from '../../services/style-variables.service';
import { SimpleTile } from '../../models/tile/simple-tile';

@Component({
    selector: 'app-map-tile',
    imports: [CommonModule],
    templateUrl: './map-tile.component.html',
    styleUrl: './map-tile.component.scss'
})
export class MapTileComponent {
    @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>
    @Input({required: true}) input!: any;
    sizeX:number;
    sizeY:number;

    public lightBorder = '/assets/pictures/light-border.png'

    constructor(public uiStateService: UIStateService, private styleVariablesService: StyleVariablesService){
        this.sizeX = styleVariablesService.sizeX
        this.sizeY = styleVariablesService.sizeY
    }

    getTexture(name: string): string {
        return `assets/pictures/${name}.png`
    }

    getMapEntity = computed<MapEntity | undefined> (() => {
        const tile = this.tile.value
        if(tile instanceof SimpleTile) {
            return tile.playersMapEntity.get()
        }
        return undefined
    })

    getUpgrade = computed<MapEntity | undefined> (() => {
        const tile = this.tile.value
        if(tile instanceof SimpleTile) {
            return tile.upgrade.get()
        }
        return undefined
    })

    getTerrainType = computed<string | undefined>(() =>  {
        const tile = this.tile.value
        if(tile instanceof BaseTile) {
            return tile.terrainType()
        }
        return undefined
    })

    getBuildingPositionX(index: number): number {
        switch(index) {
        case 0: return 0.1 * this.sizeX
        case 1: return 0.35 * this.sizeX
        case 2: return 0.6 * this.sizeX
        case 3: return 0.35 * this.sizeX
        default: return 0.35 * this.sizeX
        }
    }

    getBuildingPositionY(index: number): number {
        switch(index) {
        case 0: return 0.25 * this.sizeY
        case 1: return 0.1 * this.sizeY
        case 2: return 0.25 * this.sizeY
        case 3: return 0.4 * this.sizeY
        default: return 0.25 * this.sizeY
        }
    }

    getUnit = computed(()=>{
        const units = this.tile.value.units.get()
        if(units.size > 0) {
        for(let unit of units) {
            return unit
        }
        }
        return undefined
    })

    getImgTop() {
        return (this.sizeY - this.sizeX) / 2
}
}

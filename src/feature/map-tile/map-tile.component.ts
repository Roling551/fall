import { Component, computed, input, Input, Signal } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { CommonModule } from '@angular/common';
import { ForceSignal } from '../../util/force-signal';

@Component({
  selector: 'app-map-tile',
  imports: [CommonModule],
  templateUrl: './map-tile.component.html',
  styleUrl: './map-tile.component.scss'
})
export class MapTileComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>
  @Input({required: true}) sizeX!:number;
  @Input({required: true}) sizeY!:number;

  public tileInfo

  public lightBorder = '/assets/pictures/light-border.png'

  constructor(public uiStateService: UIStateService){
        this.tileInfo = this.uiStateService.tileInfo
  }

  getTexture(name: string): string {
    return `assets/pictures/${name}.png`
  }

  doRenderTileInfo = computed(()=> {
    const doRender = this.uiStateService.doRenderTileInfoFunction()(this.tile)
    return doRender
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
}

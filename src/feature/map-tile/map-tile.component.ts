import { Component, computed, input, Input, Signal } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { UIStateService } from '../../services/ui-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-tile',
  imports: [CommonModule],
  templateUrl: './map-tile.component.html',
  styleUrl: './map-tile.component.scss'
})
export class MapTileComponent {
  //@Input({required: true}) tile!: Signal<KeyValuePair<Coordiante, Tile>>
  tile = input.required<KeyValuePair<Coordiante, Tile>>()
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
    return this.uiStateService.doRenderTileInfoFunction()(this.tile())
  })
}

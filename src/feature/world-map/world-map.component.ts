import { Component, effect, Signal } from '@angular/core';
import { Tile } from '../../models/tile';
import { IsometricTilingComponent } from '../../shared/isometric-tiling/isometric-tiling.component';
import { WorldStateService } from '../../services/world-state.service';
import { CommonModule } from '@angular/common';
import { Coordiante } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { UIStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-world-map',
  imports: [IsometricTilingComponent, CommonModule],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.scss'
})
export class WorldMapComponent {
  public sizeX = 128
  public sizeY = 92

  public backgroundImage = "url('/assets/pictures/fog.png')"
  public lightBorder = '/assets/pictures/light-border.png'

  public tiles
  public mapAction

  constructor(public worldStateService: WorldStateService, public uiStateService: UIStateService){
    this.tiles = this.worldStateService.tiles
    this.mapAction = this.uiStateService.mapAction
  }

  getTexture(name: string): string {
    return `assets/pictures/${name}.png`
  }
}

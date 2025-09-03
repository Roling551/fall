import { ChangeDetectionStrategy, Component, computed, effect, Signal } from '@angular/core';
import { Tile } from '../../models/tile';
import { IsometricTilingComponent } from '../../shared/isometric-tiling/isometric-tiling.component';
import { WorldStateService } from '../../services/world-state/world-state.service';
import { CommonModule } from '@angular/common';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { MapTileComponent } from '../map-tile/map-tile.component';

@Component({
  selector: 'app-world-map',
  imports: [IsometricTilingComponent, CommonModule, MapTileComponent],
  templateUrl: './world-map.component.html',
  styleUrl: './world-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldMapComponent {
  public sizeX = 128 * 8
  public sizeY = 92 * 8

  public backgroundImage = "url('/assets/pictures/fog.png')"

  public tiles
  public mapAction

  constructor(public worldStateService: WorldStateService, public uiStateService: UIStateService){
    this.tiles = this.worldStateService.tiles
    this.mapAction = this.uiStateService.mapAction
  }

  getTexture(name: string): string {
    return `assets/pictures/${name}.png`
  }

  tileInfo = computed(() => {
    return this.uiStateService.tileInfos()
  })

  onHoverChange(tile: KeyValuePair<Coordinate, Tile>|undefined) {
    this.uiStateService.hoverTile.set(tile)
  }
}

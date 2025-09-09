import { ChangeDetectionStrategy, Component, computed, effect, Signal } from '@angular/core';
import { Tile } from '../../models/tile';
import { IsometricTilingComponent } from '../../shared/isometric-tiling/isometric-tiling.component';
import { CommonModule } from '@angular/common';
import { Coordinate } from '../../models/coordinate';
import { KeyValuePair } from '../../models/key-value-pair';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { MapTileComponent } from '../map-tile/map-tile.component';
import { CurrentLevelService } from '../../services/current-level.service';

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

  constructor(public levelService: CurrentLevelService, public uiStateService: UIStateService){
    this.mapAction = this.uiStateService.mapAction
    this.tiles = computed(()=>{
        return this.levelService.level.get()?.map.tiles
    })
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

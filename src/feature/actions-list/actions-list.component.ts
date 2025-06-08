import { Component } from '@angular/core';
import { WorldStateService } from '../../services/world-state.service';
import { MapEntity } from '../../models/map-entity';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state.service';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { SimpleTextComponent } from '../../shared/simple-text/simple-text.component';
import { MapMarkingComponent } from '../../shared/map-marking/map-marking.component';

@Component({
  selector: 'app-actions-list',
  imports: [],
  templateUrl: './actions-list.component.html',
  styleUrl: './actions-list.component.scss'
})
export class ActionsListComponent {
  constructor(public worldStateService: WorldStateService, public uiStateService: UIStateService) {}

  onClick(): void {
    const mapAction = (tile: KeyValuePair<Coordiante, Tile>)=>{
      this.worldStateService.tiles.get(tile.key.getKey())!.mapEntity = new MapEntity("city", new City())
    }
    this.uiStateService.setUI({
      component:SimpleTextComponent, 
      inputs:{text:"Create city"}, 
      mapAction,
      doRenderTileInfoFunction: (tile)=> {
        console.log("doRenderTileInfoFunction")
        return !tile.value?.mapEntity
      },
      tileInfo: MapMarkingComponent
    })
  }
}

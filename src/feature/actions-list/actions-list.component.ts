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
import { ForceSignal } from '../../util/force-signal';

@Component({
  selector: 'app-actions-list',
  imports: [],
  templateUrl: './actions-list.component.html',
  styleUrl: './actions-list.component.scss'
})
export class ActionsListComponent {
  constructor(public worldStateService: WorldStateService, public uiStateService: UIStateService) {}

  onClick(): void {
    const mapAction = (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
      tile.get().value.mapEntity = new MapEntity("city", new City());
      tile.forceUpdate()
    }
    this.uiStateService.setUI({
      component:SimpleTextComponent, 
      inputs:{text:"Create city"}, 
      mapAction,
      doRenderTileInfoFunction: (tile)=> {
        return !tile.value?.mapEntity
      },
      tileInfo: MapMarkingComponent
    })
  }
}

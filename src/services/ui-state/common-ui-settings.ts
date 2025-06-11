import { Coordiante } from "../../models/coordinate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { UISettings, UIStateService } from "./ui-state.service"
import { WorldStateService } from "../world-state.service"
import { MapMarkingComponent } from "../../shared/map-marking/map-marking.component"
import { SimpleTextComponent } from "../../shared/simple-text/simple-text.component"
import { ForceSignal } from "../../util/force-signal"
import { City } from "../../models/city"
import { MapEntity } from "../../models/map-entity"


export function getCityUI(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>,
    worldStateService: WorldStateService, 
):UISettings {
    return {
        component:SimpleTextComponent, 
        inputs:{text:"City info"}, 
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
           tile.get().value.belongsTo = cityTile.get().value.mapEntity
           tile.forceUpdate()
        },
        doRenderTileInfoFunction: (tile)=> {
            if(!tile.value.belongsTo) {
                return false
            }
            return tile.value.belongsTo === cityTile.get().value.mapEntity            
        },
        tileInfo: MapMarkingComponent
    }
}

export function getCreateCityUI():UISettings {
    return {
        component:SimpleTextComponent, 
        inputs:{text:"Create city"}, 
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
              tile.get().value.mapEntity = new MapEntity("city", new City());
              tile.forceUpdate()
            },
        doRenderTileInfoFunction: (tile)=> {
        return !tile.value?.mapEntity
        },
        tileInfo: MapMarkingComponent
    }
}
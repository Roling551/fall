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
import { CityPanelComponent } from "../../feature/city-panel/city-panel.component"


export function getCityUI(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>,
    worldStateService: WorldStateService, 
):UISettings {
    return {
        component:CityPanelComponent, 
        inputs:{city:cityTile.get().value.mapEntity?.entity as City}, 
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
            if(tile.get().value.mapEntity) {
                return
            }
            const city = (cityTile.get().value.mapEntity?.entity) as City
            if(!tile.get().value.belongsTo) {
                tile.get().value.belongsTo = cityTile.get().value.mapEntity
                city.addOwnedTile(tile)
                
            } else {
                tile.get().value.belongsTo = undefined
                city.removeOwnedTile(tile)
            }
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

export function getCreateCityUI(worldStateService: WorldStateService):UISettings {
    return {
        component:SimpleTextComponent, 
        inputs:{text:"Create city"}, 
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(!!tile.get().value.mapEntity || !!tile.get().value.belongsTo) {
                    return
                }
                tile.get().value.mapEntity = new MapEntity("city", new City());
                tile.forceUpdate()
                worldStateService.addCity(tile)
            },
        doRenderTileInfoFunction: (tile)=> {
        return !tile.value?.mapEntity
        },
        tileInfo: MapMarkingComponent
    }
}
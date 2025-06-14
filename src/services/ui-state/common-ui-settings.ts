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
import { GenericMapEntity } from "../../models/generic-map-entity"


export function getCityUI(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>,
    worldStateService: WorldStateService, 
):UISettings {
    return {
        component:CityPanelComponent, 
        inputs:{city:cityTile.get().value.mapEntity as City},
        additionalInfo: {cityTile},
        doRenderTileInfoFunction: (tile)=> {
            if(!tile.value.belongsTo) {
                return false
            }
            return tile.value.belongsTo === cityTile.get().value.mapEntity            
        },
        tileInfo: MapMarkingComponent
    }
}

export function getRemoveCityUI(worldStateService: WorldStateService):UISettings {
    const cityPrice = 10;
    return {
        component:SimpleTextComponent, 
        inputs:{text:"Remove city"},
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(tile.get().value.mapEntity?.type != "city") {
                    return
                }
                (tile.get().value.mapEntity as City).clearOwnedTiles()
                worldStateService.removeCity(tile)
                tile.get().value.mapEntity = undefined;
                tile.forceUpdate()
            },
        doRenderTileInfoFunction: (tile)=> {
        return !tile.value?.mapEntity
        },
        tileInfo: MapMarkingComponent
    }
}

export function getCreateCityUI(worldStateService: WorldStateService):UISettings {
    const cityPrice = 10;
    return {
        component:SimpleTextComponent, 
        inputs:{text:"Create city"},
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(worldStateService.gold() < cityPrice) {
                    return
                }
                if(!!tile.get().value.mapEntity || !!tile.get().value.belongsTo) {
                    return
                }
                worldStateService.gold.update(x=>x-10)
                tile.get().value.mapEntity = new City();
                tile.forceUpdate()
                worldStateService.addCity(tile)
            },
        doRenderTileInfoFunction: (tile)=> {
        return !tile.value?.mapEntity
        },
        tileInfo: MapMarkingComponent
    }
}

export function getAddTileToCityAction(
        cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>):UISettings {
    return {
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
            if(tile.get().value.mapEntity?.type === "city") {
                return
            }
            const mapEntity = cityTile.get().value.mapEntity!
            const city = mapEntity as City
            if(!tile.get().value.belongsTo) {
                tile.get().value.belongsTo = mapEntity
                city.addOwnedTile(tile)
                
            } else if(tile.get().value.belongsTo!==mapEntity) {
                const otherCity = tile.get().value.belongsTo as City
                otherCity.removeOwnedTile(tile)
                tile.get().value.belongsTo = mapEntity
                city.addOwnedTile(tile)
            }
            else {
                tile.get().value.belongsTo = undefined
                city.removeOwnedTile(tile)
            }
            tile.forceUpdate()
        },
        additionalInfo: {currentAction: "addTileToCity"},

    }
}
export function getCreateGenericMapEntityAction(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>,
    getGenericMapEntity: ()=>GenericMapEntity,
    entityName: string
):UISettings {
    return {
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(!!tile.get().value.mapEntity || tile.get().value.belongsTo != cityTile.get().value.mapEntity) {
                    return
                }
                tile.get().value.mapEntity = getGenericMapEntity();
                tile.forceUpdate()
        },
        additionalInfo: {currentAction: "createGenericMapEntityAction-" + entityName},

    }
}

export function getRemoveGenericMapEntityAction(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>
):UISettings {
    return {
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(
                    tile.get().value.mapEntity?.type != "genericMapEntity" ||
                    tile.get().value.belongsTo != cityTile.get().value.mapEntity) {
                    return
                }
                tile.get().value.mapEntity = undefined;
                tile.forceUpdate()
        },
        additionalInfo: {currentAction: "removeGenericMapEntityAction"},

    }
}
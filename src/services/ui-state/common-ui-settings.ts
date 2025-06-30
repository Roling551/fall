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
import { Estate } from "../../models/estate"
import { SignalsGroup } from "../../util/signals-group"
import { EstateProductionBonus } from "../../models/bonus"
import { BonusesService } from "../bonuses.service"


export function getCityUI(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>,
    worldStateService: WorldStateService, 
):UISettings {
    return {
        component:CityPanelComponent, 
        inputs:{city:cityTile.get().value.mapEntity as City, tile: cityTile},
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
    return {
        component:SimpleTextComponent, 
        inputs:{text:"Remove city"},
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(tile.get().value.mapEntity?.type != "city") {
                    return
                }
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
            const gold = worldStateService.resources.get().get("gold")!
            if(gold < cityPrice) {
                return
            }
            if(!!tile.get().value.mapEntity || !!tile.get().value.belongsTo) {
                return
            }
            worldStateService.resources.get().set("gold", gold-cityPrice)
            worldStateService.resources.forceUpdate()
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
export function getCreateEstateAction(
    bonusesService: BonusesService,
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>,
    getEstate: ()=>Estate,
    estateName: string
):UISettings {
    return {
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(!!tile.get().value.mapEntity || tile.get().value.belongsTo != cityTile.get().value.mapEntity) {
                    return
                }
                const estate = getEstate();
                estate.bonus = bonusesService.listenForEstateProductionBonuses(estate)
                tile.get().value.mapEntity = estate
                tile.forceUpdate()
        },
        additionalInfo: {currentAction: "createEstateAction-" + estateName},

    }
}

export function getRemoveEstateAction(
    cityTile: ForceSignal<KeyValuePair<Coordiante, Tile>>
):UISettings {
    return {
        mapAction: (tile: ForceSignal<KeyValuePair<Coordiante, Tile>>)=>{
                if(
                    tile.get().value.mapEntity?.type != "estate" ||
                    tile.get().value.belongsTo != cityTile.get().value.mapEntity) {
                    return
                }
                tile.get().value.mapEntity = undefined;
                tile.forceUpdate()
        },
        additionalInfo: {currentAction: "removeEstateAction"},

    }
}
import { Coordiante } from "../../models/coordinate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { UISettings, UIStateService } from "./ui-state.service"
import { WorldStateService } from "../world-state.service"
import { MapMarkingComponent } from "../../shared/map-marking/map-marking.component"
import { SimpleTextComponent } from "../../shared/simple-text/simple-text.component"
import { createForceSignal, ForceSignal } from "../../util/force-signal"
import { City } from "../../models/city"
import { MapEntity } from "../../models/map-entity"
import { CityPanelComponent } from "../../feature/city-panel/city-panel.component"
import { Estate } from "../../models/estate"
import { SignalsGroup } from "../../util/signals-group"
import { EstateProductionBonus } from "../../models/bonus"
import { BonusesService } from "../bonuses.service"
import { TilePanelComponent } from "../../feature/tile-panel/tile-panel.component"
import { Unit } from "../../models/unit"


export function getTileUI(
    tile: KeyValuePair<Coordiante, Tile>,
    worldStateService: WorldStateService,
    selectedUnits?: Set<Unit>
):UISettings {

    let doRenderTileInfoFunction
    if(tile.value.mapEntity.get()?.type === "city") {
        doRenderTileInfoFunction = (clickedTile: KeyValuePair<Coordiante, Tile>)=> {
            if(!clickedTile.value.belongsTo.get()) {
                return false
            }
            return clickedTile.value.belongsTo.get() === tile.value.mapEntity.get()  
        }      
    }

    return {
        sideComponent:TilePanelComponent, 
        sideComponentInputs:{tile, selectedUnits},
        additionalInfo: {tile},
        doRenderTileInfoFunction,
        tileInfo: MapMarkingComponent
    }
}

export function getRemoveCityUI(worldStateService: WorldStateService):UISettings {
    return {
        sideComponent:SimpleTextComponent, 
        sideComponentInputs:{text:"Remove city"},
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
                if(tile.value.mapEntity.get()?.type != "city") {
                    return
                }
                worldStateService.removeCity(tile)
                tile.value.mapEntity.set(undefined);
            },
        doRenderTileInfoFunction: (tile)=> {
            return !tile.value?.mapEntity.get()
        },
        tileInfo: MapMarkingComponent
    }
}

export function getCreateCityUI(worldStateService: WorldStateService):UISettings {
    const cityPrice = 10;
    return {
        sideComponent:SimpleTextComponent, 
        sideComponentInputs:{text:"Create city"},
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            const gold = worldStateService.resources.get().get("gold")!
            if(gold < cityPrice) {
                return
            }
            if(!!tile.value.mapEntity.get() || !!tile.value.belongsTo.get()) {
                return
            }
            worldStateService.resources.get().set("gold", gold-cityPrice)
            worldStateService.resources.forceUpdate()
            const city = new City()
            tile.value.mapEntity.set(city);
            const citySignal = tile.value.mapEntity as unknown as ForceSignal<City>
            worldStateService.addCity(tile.key.getKey(), citySignal)
        },
        doRenderTileInfoFunction: (tile)=> {
        return !tile.value?.mapEntity.get()
        },
        tileInfo: MapMarkingComponent
    }
}

export function getAddTileToCityAction(
        cityTile: KeyValuePair<Coordiante, Tile>):UISettings {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            if(tile.value.mapEntity.get()?.type === "city") {
                return
            }
            const mapEntity = cityTile.value.mapEntity.get()!
            const city = mapEntity as City
            if(!tile.value.belongsTo.get()) {
                tile.value.belongsTo.set(mapEntity)
                city.addOwnedTile(tile)
                
            } else if(tile.value.belongsTo.get()!==mapEntity) {
                const otherCity = tile.value.belongsTo.get() as City
                otherCity.removeOwnedTile(tile)
                tile.value.belongsTo.set(mapEntity)
                city.addOwnedTile(tile)
            }
            else {
                tile.value.belongsTo.set(undefined)
                city.removeOwnedTile(tile)
            }
        },
        additionalInfo: {currentAction: "addTileToCity"},

    }
}
export function getCreateEstateAction(
    bonusesService: BonusesService,
    cityTile: KeyValuePair<Coordiante, Tile>,
    getEstate: ()=>Estate,
    estateName: string
):UISettings {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
                if(!!tile.value.mapEntity.get() || tile.value.belongsTo.get() != cityTile.value.mapEntity.get()) {
                    return
                }
                const estate = getEstate();
                estate.bonus = bonusesService.listenForEstateProductionBonuses(estate)
                tile.value.mapEntity.set(estate)
        },
        additionalInfo: {currentAction: "createEstateAction-" + estateName},

    }
}

export function getRemoveEstateAction(
    cityTile: KeyValuePair<Coordiante, Tile>
):UISettings {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
                if(
                    tile.value.mapEntity.get()?.type != "estate" ||
                    tile.value.belongsTo.get() != cityTile.value.mapEntity.get()) {
                    return
                }
                tile.value.mapEntity.set(undefined);
        },
        additionalInfo: {currentAction: "removeEstateAction"},

    }
}

export function getMoveUnitsAction(
    uiStateService: UIStateService,
    previousTile: KeyValuePair<Coordiante, Tile>,
    selectedUnitsSignal: ForceSignal<Set<Unit>>
) {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            for(const unit of selectedUnitsSignal.get()) {
                previousTile.value.units.get().delete(unit)
                previousTile.value.units.forceUpdate()
                tile.value.units.get().add(unit)
                tile.value.units.forceUpdate()
            }
            uiStateService.setUI_.tile(tile)
            uiStateService.setMapAction_.moveUnits()
        },
        cancelButtonAction:() => {
            selectedUnitsSignal.get().clear()
            selectedUnitsSignal.forceUpdate()
        }
    }
}
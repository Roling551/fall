import { Coordiante } from "../../models/coordinate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile"
import { UIData, UIStateService } from "./ui-state.service"
import { WorldStateService } from "../world-state/world-state.service"
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
import { PlayerUnit, Unit } from "../../models/unit"
import { BattleService } from "../battle.service"
import { BorderComponent } from "../../shared/border/border.component"
import { computed } from "@angular/core"
import { ExtractionInfoComponent } from "../../feature/extraction-info/extraction-info.component"
import { Extraction } from "../../models/extraction"
import { BenefitsService } from "../benefits.service"
import { addOrRemoveTileToCity, createEstate } from "../world-state/functions"


export function getTileUI(
    tile: KeyValuePair<Coordiante, Tile>,
    worldStateService: WorldStateService,
    selectedUnits?: Set<Unit>
):UIData {

    let doRenderTileInfoFunction
    let tileInfoInput
    if(tile.value.mapEntity.get()?.type === "city") {
        doRenderTileInfoFunction = (clickedTile: KeyValuePair<Coordiante, Tile>)=> {
            if(clickedTile.key.getKey() === tile.key.getKey()) {
                return true
            }
            if(!clickedTile.value.belongsTo.get()) {
                return false
            }
            return clickedTile.value.belongsTo.get() === tile.value.mapEntity.get()  
        }
        tileInfoInput = {
            getDirections: (tileInfoIsAbout: KeyValuePair<Coordiante, Tile>)=> {
                return computed(()=>[...worldStateService.getNeighborTiles(tileInfoIsAbout.key).entries()].
                    filter(keyV=>keyV[1].value.belongsTo.get() !== tile.value.mapEntity.get() &&
                    keyV[1].key.getKey() !== tile.key.getKey()).
                    map(keyV=>keyV[0]))
            }
        }
    }

    return {
        sideComponent:TilePanelComponent, 
        sideComponentInputs:{tile, selectedUnits},
        additionalInfo: {tile},
        doRenderTileInfoFunction,
        tileInfo: BorderComponent,
        tileInfoInput
    }
}

export function getRemoveCityUI(worldStateService: WorldStateService):UIData {
    return {
        sideComponent:SimpleTextComponent, 
        sideComponentInputs:{text:"Remove city"},
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
                if(tile.value.mapEntity.get()?.type != "city") {
                    return
                }
                worldStateService.removeCity(tile)
            },
        doRenderTileInfoFunction: (tile)=> {
            return !tile.value?.mapEntity.get()
        },
        tileInfo: MapMarkingComponent
    }
}

export function getCreateCityUI(worldStateService: WorldStateService):UIData {
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
        cityTile: KeyValuePair<Coordiante, Tile>):UIData {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            addOrRemoveTileToCity(tile, cityTile)
        },
        additionalInfo: {currentAction: "addTileToCity"},
    }
}

export function getCreateEstateAction(
    benefitsService: BenefitsService,
    cityTile: KeyValuePair<Coordiante, Tile>,
    getEstate: ()=>Estate,
    estateName: string
):UIData {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            createEstate(tile, cityTile, getEstate, benefitsService)
        },
        additionalInfo: {currentAction: "createEstateAction-" + estateName},
    }
}

export function getRemoveEstateAction(
    cityTile: KeyValuePair<Coordiante, Tile>
):UIData {
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
    battleService: BattleService,
    previousTile: KeyValuePair<Coordiante, Tile>,
    selectedUnitsSignal: ForceSignal<Set<Unit>>
) {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            battleService.changeUnitsPosition(selectedUnitsSignal.get(), previousTile, tile)
            for(const unit of selectedUnitsSignal.get()) {
                if(unit instanceof PlayerUnit) {
                    unit.stationedTile = tile
                }
            }
            uiStateService.setUI_.tile(tile)
            uiStateService.setMapAction_.moveUnits(selectedUnitsSignal)
        },
        cancelButtonAction:() => {
            selectedUnitsSignal.get().clear()
            selectedUnitsSignal.forceUpdate()
        }
    }
}

export function getMoveUnitsBattleAction(
    uiStateService: UIStateService,
    worldStateService: WorldStateService,
    battleService: BattleService,
    previousTile: KeyValuePair<Coordiante, Tile>,
    selectedUnitsSignal: ForceSignal<Set<Unit>>
) {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{
            const pathing = worldStateService.findPath(previousTile, tile)
            if(pathing) {
                const lastTile = battleService.moveUnits(selectedUnitsSignal.get(), previousTile, pathing.path)
                uiStateService.setUI_.tile(lastTile)
                uiStateService.setMapAction_.moveUnitsBattle(selectedUnitsSignal)
            }
        },
        cancelButtonAction:() => {
            selectedUnitsSignal.get().clear()
            selectedUnitsSignal.forceUpdate()
        }
    }
}

export function getAddExtractionAction(
    cityTile: KeyValuePair<Coordiante, Tile>,
    extraction: Extraction
):UIData {
    return {
        mapAction: (tile: KeyValuePair<Coordiante, Tile>)=>{},
        additionalInfo: {currentAction: "addExtractionAction"},
        doRenderTileInfoFunction: (tile)=> {
            return tile.value.mapEntity.get()?.type === "extractionSite"
        },
        tileInfo: ExtractionInfoComponent,
        tileInfoInput: {extraction}
    }
}
import { Coordinate } from "../../models/coordinate"
import { KeyValuePair } from "../../models/key-value-pair"
import { Tile } from "../../models/tile/tile"
import { UIData, UIStateService } from "./ui-state.service"
import { MapMarkingComponent } from "../../shared/map-marking/map-marking.component"
import { SimpleTextComponent } from "../../shared/simple-text/simple-text.component"
import { createForceSignal, ForceSignal } from "../../util/force-signal"
import { MapEntity } from "../../models/map-entity"
import { Estate } from "../../models/estate"
import { SignalsGroup } from "../../util/signals-group"
import { EstateProductionBonus } from "../../models/bonus"
import { TilePanelComponent } from "../../feature/tile-panel/tile-panel.component"
import { PlayerUnit, Unit } from "../../models/unit"
import { BattleService } from "../battle.service"
import { BorderComponent } from "../../shared/border/border.component"
import { computed } from "@angular/core"
import { TurnActorsService } from "../turn-actors.service"
import { UnavaliableComponent } from "../../shared/unavaliable/unavaliable.component"
import { ResourcesService } from "../resources.service"
import { CurrentLevelService } from "../current-level.service"
import { createEstate } from "../../models/level/level.functions"
import { Resource } from "../../models/resource"
import { Station } from "../../models/station"


export function getTileUI(
    tile: KeyValuePair<Coordinate, Tile>,
    selectedUnits?: Set<Unit>
):UIData {
    return {
        sideComponent:TilePanelComponent, 
        sideComponentInputs:{tile, selectedUnits},
        additionalInfo: {tile},
        tileInfos: new Map([])
    }
}


export function getCreateStationUI(levelService: CurrentLevelService):UIData {
    return {
        sideComponent:SimpleTextComponent, 
        sideComponentInputs:{text:"Create station"},
        mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
            if(!tile.value.canAddEntity()) {
                return
            }
            const level = levelService.level.get()
            if(!level || level.station.get()) {
                return
            }
            const station = new Station()
            tile.value.addMapEntity(station)
            level.station.set({key:tile.key.getKey(), value:station});
        },
        tileInfos: new Map([["unavaliable", {
            template: UnavaliableComponent,
            doRender: (tile)=> {
                return !tile.value?.canAddEntity()
            }
        }]])
    }
}

export function getChangeResourceUI() {
    //const editMapParameters = new EditMapParameters()
    return {
        // sideComponent: EditMapComponent,
        // sideComponentInputs: {},
        // additionalInfo: {editMapParameters},
        // mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
        //     tile.value.resourcesSources.changeFirstOfType(editMapParameters)
        // }
    }
}

export function getCreateEstateAction(
    turnActorsService: TurnActorsService,
    getEstate: ()=>Estate,
    estateName: string
):UIData {
    return {
        mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
            createEstate(tile, getEstate, turnActorsService)
        },
        additionalInfo: {currentAction: "createEstateAction-" + estateName},
    }
}

export function getRemoveEstateAction(
    cityTile: KeyValuePair<Coordinate, Tile>
):UIData {
    return {
        mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
                tile.value.removeMapEntity();
        },
        additionalInfo: {currentAction: "removeEstateAction"},

    }
}

export function getMoveUnitsAction(
    uiStateService: UIStateService,
    battleService: BattleService,
    previousTile: KeyValuePair<Coordinate, Tile>,
    selectedUnitsSignal: ForceSignal<Set<Unit>>
) {
    return {
        mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
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
    levelService: CurrentLevelService,
    battleService: BattleService,
    previousTile: KeyValuePair<Coordinate, Tile>,
    selectedUnitsSignal: ForceSignal<Set<Unit>>
) {
    return {
        mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
            const level = levelService.level.get()
            if(!level) {
                return
            }
            const pathing = level.map.findPath(previousTile, tile)
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
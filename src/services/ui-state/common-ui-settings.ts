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
import { SimpleTile } from "../../models/tile/simple-tile"
import { ActionsCardsService } from "../action-cards/actions-cards.service"


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
            if(!tile.value.canAddEntity("station")) {
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
                return !tile.value?.canAddEntity("station")
            }
        }]])
    }
}

export function getRemoveEstateUI(actionsCardsService: ActionsCardsService, turnActorsService: TurnActorsService):UIData {
    return {
        sideComponent:SimpleTextComponent, 
        sideComponentInputs:{text:"Remove estate"},
        mapAction: (tile: KeyValuePair<Coordinate, Tile>)=>{
            const t = tile.value
            if(t instanceof SimpleTile) {
                const entity = t.removePlayersMapEntity()
                if(!entity) {
                    return
                }
                if(entity.actionCardGetAfterDestroy) {
                    actionsCardsService.addNewCardToDiscard(entity.actionCardGetAfterDestroy)
                }
                turnActorsService.removeActor(entity)
            }
        },
        tileInfos: new Map([])
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
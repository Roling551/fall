import { computed } from "@angular/core"
import { Coordinate } from "../../models/coordinate"
import { Estate } from "../../models/estate"
import { KeyValuePair } from "../../models/key-value-pair"
import { createEstate } from "../../models/level/level.functions"
import { MapEntityType } from "../../models/map-entity"
import { Tile } from "../../models/tile/tile"
import { BorderComponent } from "../../shared/border/border.component"
import { CurrentLevelService } from "../current-level.service"
import { TurnActorsService } from "../turn-actors.service"
import { TileInfo, UIStateService } from "../ui-state/ui-state.service"

export function getCreateEstateActionAndTileInfo(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    turnActorsService: TurnActorsService,
    getEstate: (tile: Tile)=>Estate,
    type: MapEntityType,
    affectedCoordinates: Coordinate[]
) {
    return {
        action:
            (tile: KeyValuePair<Coordinate, Tile>)=>{
                const level = levelService.level.get()
                if(!level) {
                    return false
                }
                return createEstate(turnActorsService, tile, getEstate, type)
            },
        tileInfos: new Map([getBorderInfo(uiStateService, levelService, affectedCoordinates)])
    }
}

export function getCreateMultipleEstatesActionAndTileInfo(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    turnActorsService: TurnActorsService,
    getEstate: (tile: Tile)=>Estate,
    type: MapEntityType,
    affectedCoordinates: Coordinate[],
    instancesNumber: number,
) {
    let chosenCoordinates: Map<string, KeyValuePair<Coordinate, Tile>> = new Map()
    return {
        onStepStart: ()=>{chosenCoordinates = new Map()},
        action:
            (tile: KeyValuePair<Coordinate, Tile>)=>{
                const level = levelService.level.get()
                if(!level) {
                    return false
                }
                const coordinate = tile.key.getKey()
                if(tile.value.canAddEntity(type) && !chosenCoordinates.has(coordinate)) {
                    chosenCoordinates.set(coordinate, tile)
                }
                if(chosenCoordinates.size >= instancesNumber) {
                    for(const chosenCoordinate of chosenCoordinates) {
                        createEstate(turnActorsService, chosenCoordinate[1], getEstate, type)
                    }
                    return true
                } else {
                    return false
                }
            },
        tileInfos: new Map([getBorderInfo(uiStateService, levelService, affectedCoordinates)])
    }
}

export function getBorderInfo(uiStateService: UIStateService, levelService: CurrentLevelService, affectedCoordinates: Coordinate[]): [string, TileInfo] {
    const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>{
        if(uiStateService.hoverTile()) {
            const doRender = affectedCoordinates.map(x=>x.addCoordinates(uiStateService.hoverTile()!.key)).map(x=>x.getKey()).includes(tile.key.getKey())
            return doRender
        }
        return false
    }
    return [
        "border", 
        {
            template: BorderComponent,
            doRender: doRenderBorder,
            input: {
                getDirections: (tileInfoIsAbout: KeyValuePair<Coordinate, Tile>)=>{
                        return computed(() => {
                            const level = levelService.level.get()
                            if(!level) {
                                return []
                            }
                            return level.map.getDirectionsFunction(doRenderBorder)(tileInfoIsAbout)()
                        })
                    }
                }
        }
    ]
}
import { computed } from "@angular/core";
import { PlayerActionComponent } from "../../feature/player-action/player-action.component";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { TileInfo, UIStateService } from "./ui-state.service"
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { BorderComponent } from "../../shared/border/border.component";
import { CurrentLevelService } from "../current-level.service";
import { CardInfo } from "../../models/card-info";
import { UnavaliableComponent } from "../../shared/unavaliable/unavaliable.component";
import { BenefitsService } from "../benefits.service";

export function createSelectAnyActionCards(
    uiStateService: UIStateService,
    canSelectCard?: (card: CardInfo)=>boolean,
    selectedCards?: ForceSignal<Map<number, CardInfo>>
) {
    selectedCards = selectedCards || createForceSignal(new Map<number, CardInfo>())
    uiStateService.setUI(
        {
            cardAction: (card: CardInfo) => {
                if(selectedCards.get().has(card.id)) {
                    selectedCards.get().delete(card.id)
                    selectedCards.forceUpdate()
                } else {
                    if(!canSelectCard || canSelectCard(card)) {
                        selectedCards.get().set(card.id, card)
                        selectedCards.forceUpdate()
                    }
                }
            },
            additionalInfo: {
                selectedOverrideCards: selectedCards,
                playersAction: true,
            }
        }
    )
}

export function createRepeatCardAction(
    uiStateService: UIStateService,
    canSelectCard: (card: CardInfo)=>boolean,
    afterFinishAction: (selectedCards: Map<number, CardInfo>)=> void,
    cancelButtonAction: ()=>void,
    repeatsNumber: number,
) {
    const selectedCards = createForceSignal(new Map<number, CardInfo>())
    uiStateService.setUI(
        {
            sideComponent: PlayerActionComponent,
            sideComponentInputs: {
                acceptAction: ()=>{
                    afterFinishAction(selectedCards.get())
                    uiStateService.cancel()
                },
                repeatInfo: {
                    repeatsNumber,
                    selectedItems: selectedCards
                }
            },
            cancelButtonAction,
            cardAction: (card: CardInfo) => {
                if(selectedCards.get().has(card.id)) {
                    selectedCards.get().delete(card.id)
                    selectedCards.forceUpdate()
                } else {
                    if(canSelectCard(card)) {
                        selectedCards.get().set(card.id, card)
                        selectedCards.forceUpdate()
                    }
                }
            },
            additionalInfo: {
                selectedOverrideCards: selectedCards,
                playersAction: true,
            }
        }
    )
}

export function createInstantAction(
    uiStateService: UIStateService,
    afterFinishAction: ()=>void,
    cancelButtonAction: ()=>void,
    isAllowed?:()=>boolean,
) {
    uiStateService.setUI({
        sideComponent: PlayerActionComponent,
        sideComponentInputs: {
            acceptAction: ()=>{
                if(isAllowed && !isAllowed()) {
                    return
                }
                afterFinishAction()
                
                uiStateService.cancel()
            }
        },
        cardAction: undefined,
        cancelButtonAction,
        additionalInfo: {
            playersAction: true,
        },
    })
}

export function createMapAction(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => void,
    ifAllowed: (selectedTile: KeyValuePair<Coordinate, Tile>) => boolean,
    cancelButtonAction: () => void,
    maxDistanceFromHeadquarters?: number,
    additionalTileInfos: [string, TileInfo][] = [],
    repeatsNumber?: number
) {
    if(repeatsNumber != undefined) {
        createRepeatMapAction(
            uiStateService, levelService, finishAction, ifAllowed, cancelButtonAction,
            repeatsNumber, maxDistanceFromHeadquarters, additionalTileInfos
        )
        return
    }
    const level = levelService.level.get()
    if(!level) {
        return
    }
    const isTileReacheable = maxDistanceFromHeadquarters != undefined ? (tile: KeyValuePair<Coordinate, Tile>)=> {
                return (level.distanceFromStation().get(tile.key.getKey()) ?? Infinity) > (maxDistanceFromHeadquarters)
            } : undefined
    const unavaliableTileInfo = [...((maxDistanceFromHeadquarters!=undefined) ? [[
        "unavaliable", {
            template: UnavaliableComponent,
            doRender: isTileReacheable
        }
    ]] as [string, TileInfo][] : [])]

    uiStateService.setUI({
        tileInfos: new Map([
            ...unavaliableTileInfo,
            ...additionalTileInfos
        ]),
        mapAction: (selectedTile: KeyValuePair<Coordinate, Tile>) => {
            if(maxDistanceFromHeadquarters != undefined) {
                const station = level.station.get()
                if(!station) {
                    return
                }
                if(isTileReacheable!(selectedTile)) {
                    return
                }
            }
            if(!ifAllowed(selectedTile)) {
                return
            }
            finishAction(new Map([[selectedTile.key.getKey(), selectedTile]])),
            uiStateService.cancel()
        },
        additionalInfo: {
            playersAction: true,
        },
        cancelButtonAction
    })
}

export function createRepeatMapAction(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => void,
    isTileAllowed: (selectedTile: KeyValuePair<Coordinate, Tile>) => boolean,
    cancelButtonAction: () => void,
    repeatsNumber: number,
    maxDistanceFromHeadquarters?: number,
    additionalTileInfos: [string, TileInfo][] = [],
) {
    const level = levelService.level.get()
    if(!level) {
        return
    }
    const isTileReacheable = maxDistanceFromHeadquarters != undefined ? (tile: KeyValuePair<Coordinate, Tile>)=> {
                return (level.distanceFromStation().get(tile.key.getKey()) ?? Infinity) > (maxDistanceFromHeadquarters)
            } : undefined
    let selectedTiles = createForceSignal(new Map<string, KeyValuePair<Coordinate, Tile>>())

    const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>selectedTiles.get().has(tile.key.getKey())
    const selectedTilesTileInfo = [...((repeatsNumber!=undefined) ? [[
        "Selected tiles", {
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
    ]] as [string, TileInfo][] : [])]
    const unavaliableTileInfo = [...((maxDistanceFromHeadquarters!=undefined) ? [[
        "unavaliable", {
            template: UnavaliableComponent,
            doRender: isTileReacheable
        }
    ]] as [string, TileInfo][] : [])]

    uiStateService.setUI({
        sideComponent: PlayerActionComponent,
        sideComponentInputs: {
            acceptAction: ()=>{
                finishAction(selectedTiles.get())
                uiStateService.cancel()
            },
            repeatInfo: {
                repeatsNumber,
                selectedItems: selectedTiles
            },
        },
        tileInfos: new Map([
            ...selectedTilesTileInfo,
            ...unavaliableTileInfo,
            ...additionalTileInfos
        ]),
        mapAction: (selectedTile: KeyValuePair<Coordinate, Tile>) => {
            if(maxDistanceFromHeadquarters != undefined) {
                const station = level.station.get()
                if(!station) {
                    return
                }
                if(isTileReacheable!(selectedTile)) {
                    return
                }
            }
            const tileKey = selectedTile.key.getKey()
            if(selectedTiles.get().has(tileKey)) {
                selectedTiles.get().delete(tileKey)
                selectedTiles.forceUpdate()
            } else if(isTileAllowed(selectedTile)) {
                selectedTiles.get().set(tileKey, selectedTile)
                selectedTiles.forceUpdate()
            }            
        },
        additionalInfo: {
            playersAction: true,
        },
        cancelButtonAction
    })
}
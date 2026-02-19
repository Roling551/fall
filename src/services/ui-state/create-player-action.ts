import { computed } from "@angular/core";
import { PlayerActionComponent } from "../../feature/player-action/player-action.component";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { TileInfo, UIData, UIStateService } from "./ui-state.service"
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { BorderComponent } from "../../shared/border/border.component";
import { CurrentLevelService } from "../current-level.service";
import { CardInfo } from "../../models/card-info";
import { AcceptActionComponent } from "../../feature/accept-action/accept-action.component";
import { CharacterCardInfo } from "../../models/character-card-info";
import { Skill } from "../../models/skill";
import { addNumericalValues, mapContainsMap } from "../../util/map-functions";
import { LevelsService } from "../levels.service";
import { UnavaliableComponent } from "../../shared/unavaliable/unavaliable.component";
import { BenefitsService } from "../benefits.service";

export function createRepeatMapAction(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>boolean,
    afterFinishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>)=> void,
    cancelButtonAction: ()=>void,
    repeatsNumber: number,
) {
    const selectedTiles = createForceSignal(new Map<string, KeyValuePair<Coordinate, Tile>>())
    const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>selectedTiles.get().has(tile.key.getKey())
    uiStateService.setUI(
        {
            sideComponent: PlayerActionComponent,
            sideComponentInputs: {
                acceptAction: ()=>{
                    afterFinishAction(selectedTiles.get())
                    uiStateService.cancel()
                },
                repeatInfo: {
                    repeatsNumber,
                    selectedItems: selectedTiles
                }
            },
            tileInfos: new Map([
                [
                    "Selected tiles",
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
            ]),
            mapAction: (tile: KeyValuePair<Coordinate, Tile>) => {
                const tileKey = tile.key.getKey()
                if(selectedTiles.get().has(tileKey)) {
                    selectedTiles.get().delete(tileKey)
                    selectedTiles.forceUpdate()
                }
                else if(canSelectTile(tile)) {
                    selectedTiles.get().set(tileKey, tile)
                    selectedTiles.forceUpdate()
                }
            },
            cancelButtonAction,
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
    afterFinishAction: (selectedCards: Map<number, CharacterCardInfo>)=>void,
    cancelButtonAction: ()=>void,
    isAllowed?:()=>boolean,
    requiredSkills?: Map<Skill, number>,
) {
    const selectedCards = createForceSignal(new Map<number, CharacterCardInfo>())
    const sumOfSkills = computed(() => {
        const sum = new Map()
        if(selectedCards) {
            for(const card of selectedCards.get()) {
                addNumericalValues(sum, card[1].skills)
            }
        }
        return sum
    })
    uiStateService.setUI({
        sideComponent: PlayerActionComponent,
        sideComponentInputs: {
            acceptAction: ()=>{
                if(requiredSkills && !(mapContainsMap(sumOfSkills(), requiredSkills))) {
                    return
                }
                if(isAllowed && !isAllowed()) {
                    return
                }
                afterFinishAction(selectedCards.get())
                uiStateService.cancel()
            },
            skillInfo: requiredSkills ? {
                requiredSkills,
                sumOfSkills
            } : undefined,
        },
        cardAction: requiredSkills ? (card: CardInfo) => {
            if(selectedCards.get().has(card.id)) {
                selectedCards.get().delete(card.id)
                selectedCards.forceUpdate()
            } else {
                if(card.type === "CharacterCard" && (card instanceof CharacterCardInfo)) {
                    selectedCards.get().set(card.id, card)
                    selectedCards.forceUpdate()
                }
            }
        } : undefined,
        cancelButtonAction,
        additionalInfo: {
            playersAction: true,
            selectedOverrideCards: selectedCards,
        },
    })
}

export function createSkillsAndMapAction(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    benefitsService: BenefitsService,
    forTileAction: (selectedTile: KeyValuePair<Coordinate, Tile>, selectedCards: Map<number, CharacterCardInfo>) => void,
    afterFinishAction: (selectedCards: Map<number, CharacterCardInfo>) => void,
    ifAllowed: (selectedTile: KeyValuePair<Coordinate, Tile>, selectedCards: Map<number, CharacterCardInfo>) => boolean,
    requiredSkills: Map<Skill, number>,
    cancelButtonAction: () => void,
    maxDistanceFromHeadquarters?: number,
    additionalTileInfos: [string, TileInfo][] = [],
    repeatsNumber?: number
) {
    if(repeatsNumber != undefined) {
        createSkillsAndRepeatMapAction(
            uiStateService, levelService, forTileAction, afterFinishAction, ifAllowed, requiredSkills, cancelButtonAction,
            repeatsNumber, maxDistanceFromHeadquarters, additionalTileInfos
        )
        return
    }
    const level = levelService.level.get()
    if(!level) {
        return
    }
    const selectedCards = createForceSignal(new Map<number, CharacterCardInfo>())
    const skillBonus = benefitsService.listenForTileBonuses(computed(()=>uiStateService.hoverTile()?.value)).output
    const sumOfSkills = computed(() => {
        const sum = new Map<Skill, number>()
        if(selectedCards) {
            for(const card of selectedCards.get()) {
                addNumericalValues(sum, card[1].skills)
            }
        }
        addNumericalValues(sum, skillBonus().skillsBonus)
        return sum
    })

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
        sideComponent: PlayerActionComponent,
        sideComponentInputs: {
            skillInfo: {
                requiredSkills,
                sumOfSkills
            }
        },
        cardAction: (card: CardInfo) => {
            if(selectedCards.get().has(card.id)) {
                selectedCards.get().delete(card.id)
                selectedCards.forceUpdate()
            } else {
                if(card.type === "CharacterCard" && (card instanceof CharacterCardInfo)) {
                    selectedCards.get().set(card.id, card)
                    selectedCards.forceUpdate()
                }
            }
        },
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
            if(!(mapContainsMap(sumOfSkills(), requiredSkills))) {
                return
            }
            if(!ifAllowed(selectedTile, selectedCards.get())) {
                return
            }
            forTileAction(selectedTile, selectedCards.get())
            afterFinishAction(selectedCards.get())
            uiStateService.cancel()
        },
        additionalInfo: {
            selectedOverrideCards: selectedCards,
            playersAction: true,
        },
        cancelButtonAction
    })
}

export function createSkillsAndRepeatMapAction(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    forTileAction: (selectedTile: KeyValuePair<Coordinate, Tile>, selectedCards: Map<number, CharacterCardInfo>) => void,
    afterFinishAction: (selectedCards: Map<number, CharacterCardInfo>) => void,
    ifAllowed: (selectedTile: KeyValuePair<Coordinate, Tile>, selectedCards: Map<number, CharacterCardInfo>) => boolean,
    requiredSkills: Map<Skill, number>,
    cancelButtonAction: () => void,
    repeatsNumber: number,
    maxDistanceFromHeadquarters?: number,
    additionalTileInfos: [string, TileInfo][] = [],
) {
    const level = levelService.level.get()
    if(!level) {
        return
    }
    const selectedCards = createForceSignal(new Map<number, CharacterCardInfo>())
    const sumOfSkills = computed(() => {
        const sum = new Map()
        if(selectedCards) {
            for(const card of selectedCards.get()) {
                addNumericalValues(sum, card[1].skills)
            }
        }
        return sum
    })

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
                if(!(mapContainsMap(sumOfSkills(), requiredSkills))) {
                    return
                }
                for(const tile of selectedTiles.get()) {
                    if(!ifAllowed(tile[1], selectedCards.get())) {
                        return
                    }
                }
                for(const tile of selectedTiles.get()) {
                    forTileAction(tile[1], selectedCards.get())
                }
                afterFinishAction(selectedCards.get())
                uiStateService.cancel()
            },
            repeatInfo: {
                repeatsNumber,
                selectedItems: selectedTiles
            },
            skillInfo: {
                requiredSkills,
                sumOfSkills
            }
        },
        tileInfos: new Map([
            ...selectedTilesTileInfo,
            ...unavaliableTileInfo,
            ...additionalTileInfos
        ]),
        cardAction: (card: CardInfo) => {
            if(selectedCards.get().has(card.id)) {
                selectedCards.get().delete(card.id)
                selectedCards.forceUpdate()
            } else {
                if(card.type === "CharacterCard" && (card instanceof CharacterCardInfo)) {
                    selectedCards.get().set(card.id, card)
                    selectedCards.forceUpdate()
                }
            }
        },
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
            } else {
                selectedTiles.get().set(tileKey, selectedTile)
                selectedTiles.forceUpdate()
            }            
        },
        additionalInfo: {
            selectedOverrideCards: selectedCards,
            playersAction: true,
        },
        cancelButtonAction
    })
}
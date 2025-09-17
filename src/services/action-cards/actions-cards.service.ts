import { computed, effect, Injectable, signal } from "@angular/core";
import { CardInfo } from "../../models/card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { shuffleArray } from "../../util/array-functions";
import { TileInfo, UIData, UIStateService } from "../ui-state/ui-state.service";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordinate } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { CardsHand } from "../../models/cards-hand";
import { CharactersCardsService } from "../characters-cards.service";
import { createMultiStageAction } from "../ui-state/create-multi-stage-action";
import { mapContainsMap } from "../../util/map-functions";
import { CharacterCardInfo } from "../../models/character-card-info";
import { ActionCardInfo } from "../../models/action-card-info";
import { BenefitsService } from "../benefits.service";
import { Estate } from "../../models/estate";
import { getCreateEstateAction } from "./actions-cards-functions";
import { City } from "../../models/city";
import { MapMarkingComponent } from "../../shared/map-marking/map-marking.component";
import { TurnActorsService } from "../turn-actors.service";
import { EstateFactoryService } from "../estate-factory.service";
import { UnavaliableComponent } from "../../shared/unavaliable/unavaliable.component";
import { Resource } from "../../models/resource";
import { BorderComponent } from "../../shared/border/border.component";
import { ResourcesService } from "../resources.service";
import { CurrentLevelService } from "../current-level.service";

interface CardCreationInfo {
    action: ((tile: KeyValuePair<Coordinate, Tile>)=>boolean);
    tileInfos?: Map<string,TileInfo>
}

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand
    private isActionHappening = signal(false)

    constructor(
        private uiStateService: UIStateService,
        private charactersCardService: CharactersCardsService,
        private levelService: CurrentLevelService,
        private resourcesService: ResourcesService,
        private turnActorsService: TurnActorsService,
        private estateFactoryService: EstateFactoryService
    ) {
        const cards = []
        let card = this.exampleCard()
        if(card) {
            cards.push(card)
        }
        card = this.createEstateCard()
        if(card) {
            cards.push(card)
        }
        card = this.createInstantExtractionCard()
        if(card) {
            cards.push(card)
        }
        this.cardsHand = new CardsHand(cards, ()=>{this.uiStateService.cancel()}, false)
        effect(()=>{
            charactersCardService.isHandFrozen.set(this.isActionHappening())
        })
    }

    nextTurn() {
        this.cardsHand.nextTurn()
    }

    exampleCard() {
       return this.createMultiStageActionCard(
            "c", 
            [
                {action:(tile: KeyValuePair<Coordinate, Tile>)=>{console.log("t1"); return tile.key.getKey()=="0_0"}},
                {action:(tile: KeyValuePair<Coordinate, Tile>)=>{console.log("t2"); return tile.key.getKey()=="0_0"}},
                {action:(tile: KeyValuePair<Coordinate, Tile>)=>{console.log("t3"); return tile.key.getKey()=="0_0"}},
            ]
            )
    }

    createInstantExtractionCard() {
        return this.createMultiStageActionCard(
        "Extact",
            [
                {
                    action:(tile: KeyValuePair<Coordinate, Tile>)=> {
                        this.estateFactoryService.getSimpleExtractionAction(new Map([["mining",1]]))(tile.value)
                        return true
                    },
                }
            ]
        )
    }

    createEstateCard() {
        const createEstateInfo = this.estateFactoryService.getCreateEstateInfo()
        const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>{
            if(this.uiStateService.hoverTile()) {
                const doRender = createEstateInfo.affectedCoordinate.map(x=>x.addCoordinates(this.uiStateService.hoverTile()!.key)).map(x=>x.getKey()).includes(tile.key.getKey())
                return doRender
            }
            return false
        }
        return this.createMultiStageActionCard(
            "Create estate",
            [
                {
                    action:(tile: KeyValuePair<Coordinate, Tile>)=> {
                        return getCreateEstateAction(this.levelService, this.turnActorsService, createEstateInfo.getEstate)(tile)
                    }, 
                    tileInfos: new Map([[
                        "border", 
                        {
                            template: BorderComponent,
                            doRender: doRenderBorder,
                            input: {
                                getDirections: (tileInfoIsAbout: KeyValuePair<Coordinate, Tile>)=>{
                                        return computed(() => {
                                            const level = this.levelService.level.get()
                                            if(!level) {
                                                return []
                                            }
                                            return level.map.getDirectionsFunction(doRenderBorder)(tileInfoIsAbout)()
                                        })
                                    }
                                }
                        }
                    ]])
                }
            ],
            new Map([["oil", 1]])
        )
    }

    createMultiStageActionCard(
        name: string, 
        cardCreationInfo: CardCreationInfo[],
        price?: Map<Resource, number>,
    ) {
        const card = new ActionCardInfo(name, new Map([["construction", 2]]), price)
        const oldCardActions0 = cardCreationInfo[0].action
        const uis: UIData[] = cardCreationInfo.map(x=>{return {} as UIData})
        uis[0]={
            tileInfos: new Map([...(cardCreationInfo[0].tileInfos||[]),["unavaliable", {
                template: UnavaliableComponent,
                doRender: (tile: KeyValuePair<Coordinate, Tile>)=> {
                    return !this.reachableTiles().includes(tile.key.getKey())
                }
            }]])
        }
        cardCreationInfo[0].action = (tile: KeyValuePair<Coordinate, Tile>)=>{
            const level = this.levelService.level.get()
            if(!level) {
                return false
            }
            if(level.cities.get().size<1) {
                return false
            }
            let city: [string, ForceSignal<City>]
            for(const city_ of level.cities.get()) {
                city = city_
            }
            if(!(mapContainsMap(this.charactersCardService.sumOfSkills(), card.requiredSkills))) {
                return false
            }
            if(price && !this.resourcesService.canAffordResources(price)) {
                return false
            }
            for(const characterCard of this.charactersCardService.cardsHand.selectedCards.get()) {
                const path = level.map.findPathByKey(city![0], tile.key.getKey())
                if(!path || path.distance > characterCard.movement) {
                    return false
                }
            }
            const isSuccesfull = oldCardActions0(tile)
            this.isActionHappening.set(true)
            return isSuccesfull
        }
        card.onSelect = ()=>{
            return createMultiStageAction(
                this.uiStateService,
                cardCreationInfo.map(x=>x.action),
                ()=>{
                    this.isActionHappening.set(false)
                    this.cardsHand.deselectCard(card)
                },
                ()=>{
                    this.isActionHappening.set(false)
                    this.charactersCardService.cardsHand.discardSelectedCards()
                    if(price) {
                        this.resourcesService.spendResources(price)
                    }
                    this.cardsHand.discardCard(card)
                },
                uis
            )
        }
        return card
    }

    reachableTiles = computed(()=>{
        const level = this.levelService.level.get()
        if(!level) {
            return []
        }
        let city: [string, ForceSignal<City>]
        if(level.cities.get().size<1) {
            return [] as string[]
        }
        for(const city_ of level.cities.get()) {
            city = city_
        }
        let firstTile = true
        let tiles:string[] = []
        for(const characterCard of this.charactersCardService.cardsHand.selectedCards.get()) {
            const cardsTiles = level.map.getReacheableTiles(city![0], characterCard.movement, this.getEdgeWidghtFunction(characterCard)).map(x=>x.node)
            if(firstTile) {
                tiles = cardsTiles
                firstTile = false
            } else {
                tiles = tiles.filter(x => cardsTiles.includes(x));
            }
        }
        return tiles
    })

    getEdgeWidghtFunction(characterCard: CharacterCardInfo) {
        return (from: string, to: string)=>{
            const level = this.levelService.level.get()
            if(!level) {
                return Infinity
            }
            return level.map.tiles.get(to)!.value.obstacles.get().getDistance(characterCard.movementAdvantege)
        }
    }
}
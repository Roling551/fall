import { computed, effect, Injectable, signal } from "@angular/core";
import { CardInfo } from "../../models/card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { shuffleArray } from "../../util/array-functions";
import { TileInfo, UIData, UIStateService } from "../ui-state/ui-state.service";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordinate } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { CardsHand } from "../../models/card-hands/cards-hand";
import { CharactersCardsService } from "../characters-cards.service";
import { createMultiStageAction } from "../ui-state/create-multi-stage-action";
import { mapContainsMap } from "../../util/map-functions";
import { CharacterCardInfo } from "../../models/character-card-info";
import { ActionCardInfo } from "../../models/action-card-info";
import { Estate } from "../../models/estate";
import { getCreateEstateAction } from "./actions-cards-functions";
import { MapMarkingComponent } from "../../shared/map-marking/map-marking.component";
import { TurnActorsService } from "../turn-actors.service";
import { EstateFactoryService } from "../estate-factory.service";
import { UnavaliableComponent } from "../../shared/unavaliable/unavaliable.component";
import { Resource } from "../../models/resource";
import { BorderComponent } from "../../shared/border/border.component";
import { ResourcesService } from "../resources.service";
import { CurrentLevelService } from "../current-level.service";
import { Skill } from "../../models/skill";
import { ActionCardCreationInfoFactoryService } from "./action-card-creation-info-factory.service";
import { ActionCardInfoList } from "./action-card-info.list";
import { CardOnHandBenefits } from "../../models/card-on-hand-benefit";
import { TraditionalCardsHand } from "../../models/card-hands/traditional-cards-hand";
import { InitialCardsHand } from "../../models/card-hands/initial.cards-hand";

export interface CardCreationActionInfo {
    action: ((tile: KeyValuePair<Coordinate, Tile>)=>boolean);
    tileInfos?: Map<string,TileInfo>
}

export interface CardCreationInfo {
    name: string, 
    cardCreationInfo: CardCreationActionInfo[],
    skillRequired: Map<Skill, number>,
    price?: Map<Resource, number>,
    cardOnHandBenefits?: CardOnHandBenefits,
}

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand?: CardsHand<ActionCardInfo>
    private isActionHappening = signal(false)

    constructor(
        private uiStateService: UIStateService,
        private charactersCardService: CharactersCardsService,
        private levelService: CurrentLevelService,
        private resourcesService: ResourcesService,
    ) {
        effect(()=>{
            charactersCardService.isHandFrozen.set(this.isActionHappening())
        })
    }

    setCards(cardCreationInfos: CardCreationInfo[]) {
        const cards = cardCreationInfos.map(x=>this.createMultiStageActionCard(x))
        this.cardsHand = new InitialCardsHand(cards, ()=>{this.uiStateService.cancel()}, false, undefined, 2)
    }

    getBorderInfo(affectedCoordinates: Coordinate[]): [string, TileInfo] {
        const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>{
            if(this.uiStateService.hoverTile()) {
                const doRender = affectedCoordinates.map(x=>x.addCoordinates(this.uiStateService.hoverTile()!.key)).map(x=>x.getKey()).includes(tile.key.getKey())
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
                                const level = this.levelService.level.get()
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

    nextTurn() {
        this.cardsHand?.nextTurn()
    }

    createMultiStageActionCard(info: CardCreationInfo) {
        const {
            name,
            cardCreationInfo,
            skillRequired,
            price,
            cardOnHandBenefits
        } = info
        const card = new ActionCardInfo(name, new Map(skillRequired), price, cardOnHandBenefits)
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
            const station = level.station.get()
            if(!station) {
                return false
            }
            if(!(mapContainsMap(this.charactersCardService.sumOfSkills(), card.requiredSkills))) {
                return false
            }
            if(price && !this.resourcesService.canAffordResources(price)) {
                return false
            }
            for(const characterCard of this.charactersCardService.cardsHand.selectedCards.get()) {
                const path = level.map.findPathByKey(station.key, tile.key.getKey())
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
                    this.cardsHand!.deselectCard(card)
                },
                ()=>{
                    this.isActionHappening.set(false)
                    this.charactersCardService.cardsHand.discardSelectedCards()
                    if(price) {
                        this.resourcesService.spendResources(price)
                    }
                    this.cardsHand!.discardCard(card)
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

        const station = level.station.get()
        if(!station) {
            return [] as string[]
        }
        let firstTile = true
        let tiles:string[] = []
        for(const characterCard of this.charactersCardService.cardsHand.selectedCards.get()) {
            const cardsTiles = level.map.getReacheableTiles(station.key, characterCard.movement, this.getEdgeWidghtFunction(characterCard)).map(x=>x.node)
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
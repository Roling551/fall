import { computed, effect, Injectable, signal } from "@angular/core";
import { UIData, UIStateService } from "../ui-state/ui-state.service";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordinate } from "../../models/coordinate";
import { Tile } from "../../models/tile/tile";
import { CardsHand } from "../../models/card-hands/cards-hand";
import { CharactersCardsService } from "../character-cards/characters-cards.service";
import { createMultiStageAction } from "../ui-state/create-multi-stage-action";
import { mapContainsMap } from "../../util/map-functions";
import { ActionCardInfo } from "../../models/action-card-info";
import { UnavaliableComponent } from "../../shared/unavaliable/unavaliable.component";
import { ResourcesService } from "../resources.service";
import { CurrentLevelService } from "../current-level.service";
import { InitialCardsHand } from "../../models/card-hands/initial-cards-hand";
import { shuffleArray } from "../../util/array-functions";
import { TraditionalCardsHand } from "../../models/card-hands/traditional-cards-hand";
import { createForceSignal } from "../../util/force-signal";
import { CharacterCardInfo } from "../../models/character-card-info";
import { CardInfo } from "../../models/card-info";
import { CardSource, GroupByCardsHand } from "../../models/card-hands/group-by-cards-hand";
import { ActionCardInfoFactoryService } from "./action-card-info-factory.service";
import { InjectorService } from "../injector.service";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand?: GroupByCardsHand<ActionCardInfo>
    private isActionHappening = signal(false)

    constructor(
        private uiStateService: UIStateService,
        private charactersCardService: CharactersCardsService,
        private levelService: CurrentLevelService,
        private resourcesService: ResourcesService,
        private turnActorsService: TurnActorsService
    ) {
        effect(()=>{
            charactersCardService.isHandFrozen.set(this.isActionHappening())
        })
    }

    isActionChosen = computed(()=>{
        return (this.cardsHand?.selectedCardsNumber() || 0) > 0
    })

    setCards(actionCardInfos: ActionCardInfo[]) {
        actionCardInfos = shuffleArray(actionCardInfos)
        const cards = actionCardInfos.map(x=>this.setMultiStageAction(x))
        this.cardsHand = new GroupByCardsHand<ActionCardInfo>(
            cards, 
            Infinity, 
            ()=>{this.uiStateService.cancel()}, 
            false, 
            undefined,
            computed(()=>{return !this.charactersCardService.isActionChosen()}),
            this.uiStateService.cardAction,
            computed(()=>{
                return this.uiStateService.additionalInfo()?.["selectedOverrideCards"]?.get()
            }),
            (cardInfo: CardInfo, source: CardSource, additionalDeck?: string) => {
                if(cardInfo instanceof ActionCardInfo && source === "hand") {
                    if(cardInfo.additionalInfo.type === "EstateCardInputs") {
                        return {group:"estates", avaliable: true}
                    } else if(cardInfo.additionalInfo.type === "InstantExtractionCardInputs") {
                        return {group:"instant", avaliable: true}
                    }
                }
                if(cardInfo instanceof ActionCardInfo) {
                    if(additionalDeck && additionalDeck === "estatesOnMap") {
                        return {group:"estatesOnMap", avaliable: false}
                    }
                }
                return undefined
            },
            ["instant", "estates", "estatesOnMap"],
            computed(()=>{
                return new Map([["estatesOnMap", this.turnActorsService.actors.get()
                    .filter(x=>x instanceof Estate)
                    .map(x=>(x as Estate)["actionCardGetAfterDestroy"] as ActionCardInfo)
                ]])
            }),
        )
    }

    addNewCardToDiscard(actionCardInfo: ActionCardInfo) {
        const card = this.setMultiStageAction(actionCardInfo)
        this.cardsHand?.discardDeck.get().push(card)
        this.cardsHand?.discardDeck.forceUpdate()
    }

    nextTurn() {
        this.cardsHand?.nextTurn()
    }

    setMultiStageAction(actionCardInfo: ActionCardInfo) {
        const oldCardActions0 = actionCardInfo.cardCreationSteps[0].action
        const uis: UIData[] = actionCardInfo.cardCreationSteps.map(x=>{return {} as UIData})
        uis[0]={
            tileInfos: new Map([...(actionCardInfo.cardCreationSteps[0].tileInfos||[]),["unavaliable", {
                template: UnavaliableComponent,
                doRender: (tile: KeyValuePair<Coordinate, Tile>)=> {
                    return !this.reachableTiles().includes(tile.key.getKey())
                }
            }]])
        }
        actionCardInfo.cardCreationSteps[0].action = (tile: KeyValuePair<Coordinate, Tile>)=>{
            const level = this.levelService.level.get()
            if(!level) {
                return false
            }
            const station = level.station.get()
            if(!station) {
                return false
            }
            if(!(mapContainsMap(this.charactersCardService.sumOfSkills(), actionCardInfo.requiredSkills))) {
                return false
            }
            if(actionCardInfo.price && !this.resourcesService.canAffordResources(actionCardInfo.price)) {
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
        actionCardInfo.onSelect = ()=>{
            return createMultiStageAction(
                this.uiStateService,
                actionCardInfo.cardCreationSteps.map(x=>x.action),
                ()=>{
                    this.isActionHappening.set(false)
                    this.cardsHand!.deselectCard(actionCardInfo)
                },
                ()=>{
                    this.isActionHappening.set(false)
                    this.charactersCardService.cardsHand.discardSelectedCards()
                    if(actionCardInfo.price) {
                        this.resourcesService.spendResources(actionCardInfo.price)
                    }
                    if(actionCardInfo.removeOnUse) {
                        this.removeCardFromHand(actionCardInfo)
                    } else {
                        this.cardsHand!.discardCard(actionCardInfo)
                    }
                    
                },
                uis,
                actionCardInfo.cardCreationSteps.map(x=>x.onStepStart),
            )
        }
        return actionCardInfo
    }

    removeCardFromHand(actionCardInfo: CardInfo) {
        if(!this.cardsHand) {
            return
        }
        this.cardsHand.hand.set(this.cardsHand.hand.get().filter(c=>c!=actionCardInfo))
    }

    removeCardsFromHandAndCount(cards: CardInfo[]) {
        if(!this.cardsHand) {
            return 0
        }
        let i = 0
        this.cardsHand.hand.set(this.cardsHand.hand.get().filter(c=>{
            if(!cards.includes(c)) {
                return true
            }
            i += 1
            return false
        }))
        return i
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
            const cardsTiles = level.map.getReacheableTiles(station.key, characterCard.movement/*, this.getEdgeWidghtFunction(characterCard)*/).map(x=>x.node)
            if(firstTile) {
                tiles = cardsTiles
                firstTile = false
            } else {
                tiles = tiles.filter(x => cardsTiles.includes(x));
            }
        }
        return tiles
    })

    // getEdgeWidghtFunction(characterCard: CharacterCardInfo) {
    //     return (from: string, to: string)=>{
    //         const level = this.levelService.level.get()
    //         if(!level) {
    //             return Infinity
    //         }
    //         return level.map.tiles.get(to)!.value.obstacles.get().getDistance(characterCard.movementAdvantege)
    //     }
    // }
}
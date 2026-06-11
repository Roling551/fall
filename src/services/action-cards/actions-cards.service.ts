import { computed, Injectable, Signal, signal } from "@angular/core";
import { UIStateService } from "../ui-state/ui-state.service";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordinate } from "../../models/coordinate";
import { Tile } from "../../models/tile/tile";
import { ActionCardInfo } from "../../models/action-card-info";
import { ResourcesService } from "../resources.service";
import { CurrentLevelService } from "../current-level.service";
import { shuffleArray } from "../../util/array-functions";
import { CharacterCardInfo } from "../../models/character-card-info";
import { CardInfo } from "../../models/card-info";
import { CardSource, GroupByCardsHand } from "../../models/card-hands/group-by-cards-hand";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";
import { createInstantAction, createMapAction } from "../ui-state/create-player-action";
import { CardOverlayCardInfo } from "../../models/card-overlay-card-info";
import { BenefitsService } from "../benefits.service";
import { CardsActionsService } from "../cards-actions.service";

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand?: GroupByCardsHand<CardInfo>

    constructor(
        private uiStateService: UIStateService,
        private levelService: CurrentLevelService,
        private resourcesService: ResourcesService,
        private turnActorsService: TurnActorsService,
        private benefitsService: BenefitsService,
        private cardsActionsService: CardsActionsService,
    ) {
    }

    isActionChosen = computed(()=>{
        return (this.cardsHand?.selectedCardsNumber() || 0) > 0
    })

    setCards(actionCardInfos: CardInfo[]) {
        actionCardInfos = shuffleArray(actionCardInfos)
        const cards = actionCardInfos.map(x=>this.setOnClickAction(x))
        this.cardsHand = new GroupByCardsHand<CardInfo>(
            cards, 
            signal(Infinity),
            ()=>{this.uiStateService.cancel()}, 
            false,
            computed(()=>{return !this.isPlayersActionChosen()}),
            this.uiStateService.cardAction,
            computed(()=>{
                return this.uiStateService.additionalInfo()?.["selectedOverrideCards"]?.get()
            }),
            (cardInfo: CardInfo, source: CardSource, additionalDeck?: string) => {
                if(cardInfo instanceof ActionCardInfo && source === "hand") {
                    if(true/*cardInfo.additionalInfo.type === "EstateCardInputs" || cardInfo.additionalInfo.type === ""*/) {
                        return {group:"estates", avaliable: true}
                    } else if(false/*cardInfo.additionalInfo.type === "InstantExtractionCardInputs"*/) {
                        return {group:"instant", avaliable: true}
                    }
                } else if(cardInfo instanceof CardOverlayCardInfo && source === "hand") {
                    return {group:"cardsToRecover", avaliable: true}
                }
                if(cardInfo instanceof ActionCardInfo) {
                    if(additionalDeck && additionalDeck === "estatesOnMap") {
                        return {group:"estatesOnMap", avaliable: false}
                    }
                }
                return undefined
            },
            ["instant", "estates", "cardsToRecover", "estatesOnMap"],
            computed(()=>{
                return new Map([["estatesOnMap", this.turnActorsService.actors.get()
                    .filter(x=>x instanceof Estate && (x as Estate)["actionCardGetAfterDestroy"])
                    .map(x=>(x as Estate)["actionCardGetAfterDestroy"] as ActionCardInfo)
                ]])
            }),
        )
    }

    addNewCardToDiscard(actionCardInfo: CardInfo) {
        const card = this.setOnClickAction(actionCardInfo)
        this.cardsHand?.discardDeck.get().push(card)
        this.cardsHand?.discardDeck.forceUpdate()
    }

    nextTurn() {
        this.cardsHand?.nextTurn()
    }

    isPlayersActionChosen:Signal<boolean> = computed(()=>{
        return this.uiStateService.additionalInfo()?.["playersAction"] === true
    })

    setOnClickAction(cardInfo: CardInfo) {
        if(cardInfo instanceof ActionCardInfo) {
            return this.setOnClickActionForActionCard(cardInfo)
        } else if(cardInfo instanceof CardOverlayCardInfo) {
            return this.setOnClickActionForCardOverlayCard(cardInfo)
        }
        return cardInfo
    }

    private setOnClickActionForCardOverlayCard(cardInfo: CardOverlayCardInfo) {
        cardInfo.onSelect = ()=>{
            createInstantAction(
                this.uiStateService,
                (selectedCards: Map<number, CharacterCardInfo>)=>{
                    if(cardInfo.price) {
                        this.resourcesService.spendResources(cardInfo.price)
                    }
                    
                    this.addNewCardToDiscard(cardInfo.overlayedCard)
                    this.removeCardFromHand(cardInfo)
                },
                ()=>{ 
                    this.cardsHand!.deselectCard(cardInfo)
                },
                cardInfo.price ? ()=>{
                    return !(cardInfo.price && !this.resourcesService.canAffordResources(cardInfo.price))
                }: undefined,
            )
            return true
        }
        return cardInfo
    }

    private setOnClickActionForActionCard(actionCardInfo: ActionCardInfo) {
        this.cardsActionsService.setCardsAction(actionCardInfo, actionCardInfo.action, ()=>this.cardsHand!.discardCard(actionCardInfo), ()=>this.cardsHand!.deselectAllCards())
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
}
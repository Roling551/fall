import { computed, Injectable, Signal, signal } from "@angular/core";
import { UIStateService } from "../ui-state/ui-state.service";
import { ActionCardInfo } from "../../models/action-card-info";
import { ResourcesService } from "../resources.service";
import { CurrentLevelService } from "../current-level.service";
import { shuffleArray } from "../../util/array-functions";
import { CardInfo } from "../../models/card-info";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";
import { createInstantAction } from "../ui-state/create-player-action";
import { CardOverlayCardInfo } from "../../models/card-overlay-card-info";
import { BenefitsService } from "../benefits.service";
import { CardsActionsService } from "../cards-actions.service";
import { CardSource, GroupByCardsSet } from "../../models/cards-set/group-by-cards-set";

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsSet?: GroupByCardsSet<CardInfo>

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
        return (this.cardsSet?.selectedCardsNumber() || 0) > 0
    })

    setCards(actionCardInfos: CardInfo[]) {
        this.cardsSet = new GroupByCardsSet<CardInfo>(
            actionCardInfos, 
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
                        if(cardInfo.avaliable()) {
                            return {group:"estates", avaliable: true}
                        }
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
            (card: CardInfo)=>this.onCardSelect(card),
            computed(()=>{
                return this.turnActorsService.actors.get()
                    .filter(x=>x instanceof Estate && (x as Estate)["cardsGenerated"])
                    .flatMap(x=>(x as Estate).cardsGenerated.get()||[])
            }),
        )
    }

    onCardSelect(cardInfo: CardInfo) : boolean {
        console.log("on card select")
        if(cardInfo instanceof ActionCardInfo) {
            console.log(this.cardsActionsService)
            return this.cardsActionsService.getCardsAction(cardInfo, cardInfo.action, ()=>cardInfo.onUse(), ()=>this.cardsSet!.deselectAllCards())()
        } else if(cardInfo instanceof CardOverlayCardInfo) {
            return this.getOnClickActionForCardOverlayCard(cardInfo)()
        }
        return false
    }

    //this.cardsActionsService.getCardsAction(actionCardInfo, actionCardInfo.action, ()=>actionCardInfo.onUse(), ()=>this.cardsSet!.deselectAllCards())

    addNewCardToDiscard(actionCardInfo: CardInfo) {
        this.cardsSet?.addCards([actionCardInfo])
    }

    nextTurn() {
        this.cardsSet?.nextTurn()
    }

    isPlayersActionChosen:Signal<boolean> = computed(()=>{
        return this.uiStateService.additionalInfo()?.["playersAction"] === true
    })

    private getOnClickActionForCardOverlayCard(cardInfo: CardOverlayCardInfo) {
        return ()=>{
            createInstantAction(
                this.uiStateService,
                ()=>{
                    if(cardInfo.price) {
                        this.resourcesService.spendResources(cardInfo.price)
                    }
                    
                    this.addNewCardToDiscard(cardInfo.overlayedCard)
                    this.removeCardFromHand(cardInfo)
                },
                ()=>{ 
                    this.cardsSet!.deselectCard(cardInfo)
                },
                cardInfo.price ? ()=>{
                    return !(cardInfo.price && !this.resourcesService.canAffordResources(cardInfo.price))
                }: undefined,
            )
            return true
        }
    }

    removeCardFromHand(actionCardInfo: CardInfo) {
        if(!this.cardsSet) {
            return
        }
        this.cardsSet.hand.set(this.cardsSet.hand.get().filter(c=>c!=actionCardInfo))
    }

    removeCardsFromHandAndCount(cards: CardInfo[]) {
        if(!this.cardsSet) {
            return 0
        }
        let i = 0
        this.cardsSet.hand.set(this.cardsSet.hand.get().filter(c=>{
            if(!cards.includes(c)) {
                return true
            }
            i += 1
            return false
        }))
        return i
    }
}
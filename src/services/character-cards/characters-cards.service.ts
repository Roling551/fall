import { computed, effect, Injectable, Signal, signal } from "@angular/core";
import { CardsHand } from "../../models/card-hands/cards-hand";
import { CardInfo } from "../../models/card-info";
import { CharacterCardInfo } from "../../models/character-card-info";
import { baseZeroSkills } from "../../models/skill";
import { addExistingNumericalValues } from "../../util/map-functions";
import { TraditionalCardsHand } from "../../models/card-hands/traditional-cards-hand";
import { InjectorService } from "../injector.service";
import { UIStateService } from "../ui-state/ui-state.service";
import { CurrentLevelService } from "../current-level.service";
import { createForceSignal } from "../../util/force-signal";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordinate } from "../../models/coordinate";
import { Tile } from "../../models/tile/tile";
import { CharacterCardInfoList } from "./character-card.list";
import { shuffleArray } from "../../util/array-functions";
import { PlayerStatsService } from "../player-stats.service";
import { CardsActionsService } from "../cards-actions.service";

export type CharactersCardsServiceMode = 'action' | 'skill' | 'none'

@Injectable({
  providedIn: 'root'
})
export class CharactersCardsService {
    public cardsHand

    nextTurn() {
        this.cardsHand?.nextTurn()
    }

    isPlayersActionChosen:Signal<boolean> = computed(()=>{
        return this.uiStateService.additionalInfo()?.["playersAction"] === true
    })

    constructor(
        private injectorService: InjectorService,
        private uiStateService: UIStateService,
        private currentLevelService: CurrentLevelService,
        private playerStatsService: PlayerStatsService,
        private cardsActionsService: CardsActionsService,
    ) {
        const cards: CharacterCardInfo[] = []
        this.cardsHand = this.createCardsHand(cards)
    }

    public setCards(cards: CharacterCardInfo[]) {
        cards = shuffleArray(cards)
        cards.map(
            x=>this.cardsActionsService.setCardsAction(x, x.actionInfo, ()=>this.cardsHand.discardCard(x), ()=>this.cardsHand.deselectAllCards())
        )
        this.cardsHand = this.createCardsHand(cards)
    }

    private createCardsHand(cards: CharacterCardInfo[]) {
        return new TraditionalCardsHand<CharacterCardInfo>(
            cards, 
            this.playerStatsService.characterCardsDrawnPerTurn,
            ()=>{
                if(!this.injectorService.actionsCardsService?.isActionChosen()) {
                    this.uiStateService.cancel()   
                }
            }, 
            false,
            computed(()=>{return !this.isPlayersActionChosen()}),
            this.uiStateService.cardAction,
            computed(()=>{
                return this.uiStateService.additionalInfo()?.["selectedOverrideCards"]?.get()
            }),
            {canSetAction: ()=>{return !this.injectorService.getActionsCardsService().isActionChosen()}}
        )
    }

    sumOfSkills = computed(() => {
        const sum = new Map(baseZeroSkills)
        if(this.cardsHand) {
            for(const card of this.cardsHand.selectedCards.get()) {
                addExistingNumericalValues(sum, card.skills)
            }
        }
        return sum
    })

    onRightClick() {
       this.cardsHand?.deselectAllCards() 
    }
}
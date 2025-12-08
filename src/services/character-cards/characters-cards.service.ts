import { computed, effect, Injectable, Signal, signal } from "@angular/core";
import { CardsHand } from "../../models/card-hands/cards-hand";
import { CardInfo } from "../../models/card-info";
import { CharacterCardInfo } from "../../models/character-card-info";
import { baseZeroSkills } from "../../models/skill";
import { addExistingNumericalValues } from "../../util/map-functions";
import { TraditionalCardsHand } from "../../models/card-hands/traditional-cards-hand";
import { InjectorService } from "../injector.service";
import { UIStateService } from "../ui-state/ui-state.service";
import { createRepeatCardAction, createRepeatMapAction } from "../ui-state/create-repeat-action";
import { CurrentLevelService } from "../current-level.service";
import { createForceSignal } from "../../util/force-signal";

export type CharactersCardsServiceMode = 'action' | 'skill' | 'none'

@Injectable({
  providedIn: 'root'
})
export class CharactersCardsService {
    public cardsHand
    public isHandFrozen = signal(false)

    nextTurn() {
        this.cardsHand.nextTurn()
    }

    isActionChosen:Signal<boolean> = computed(()=>{
        return (this.cardsHand?.selectedCardsNumber() || 0) > 0 && !this.injectorService.actionsCardsService?.isActionChosen()
    })

    constructor(
        private injectorService: InjectorService,
        private uiStateService: UIStateService,
        private currentLevelService: CurrentLevelService
    ) {
        const cards: CharacterCardInfo[] = []
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        this.cardsHand = new TraditionalCardsHand<CharacterCardInfo>(
            cards, 
            Infinity, 
            ()=>{
                if(!this.injectorService.actionsCardsService?.isActionChosen()) {
                    this.uiStateService.cancel()   
                }
            }, 
            true, 
            this.isHandFrozen,
            computed(()=>{return !this.isActionChosen()||this.injectorService.getActionsCardsService().isActionChosen()}),
            this.uiStateService.cardAction,
            computed(()=>{
                return this.uiStateService.additionalInfo()?.["selectedOverrideCards"]?.get()
            }),
            {canSetAction: ()=>{return !this.injectorService.getActionsCardsService().isActionChosen()}}
        )
    }

    exampleCard() {
        const card = new CharacterCardInfo(
            "c",
            new Map([["construction", 1]],),
            3,
            new Map([["mountain",1]])
        )
        card.onSelect = (selectCardInfo?:any)=>{
            if(selectCardInfo && selectCardInfo["canSetAction"]?.()) {
                // createRepeatMapAction(
                //     this.uiStateService,
                //     this.currentLevelService,
                //     ()=>true,
                //     (selectedTiles)=>{
                //         console.log(selectedTiles.size)
                //         this.cardsHand.discardCard(card)
                //     },
                //     ()=>{
                //         this.cardsHand.deselectAllCards()
                //     },
                //     2
                // )
                createRepeatCardAction(
                    this.uiStateService,
                    (selectedCards:Map<number, CardInfo>)=>{
                        console.log(selectedCards.size)
                        this.cardsHand.discardCard(card)
                    },
                    ()=>{
                        this.cardsHand.deselectAllCards()
                    },
                    2
                )
            }
            return true
        }
        return card
    }

    sumOfSkills = computed(() => {
        const sum = new Map(baseZeroSkills)
        for(const card of this.cardsHand.selectedCards.get()) {
            addExistingNumericalValues(sum, card.skills)
        }
        return sum
    })

    onRightClick() {
       this.cardsHand.deselectAllCards(false) 
    }
}
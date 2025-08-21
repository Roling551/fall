import { effect, Injectable, signal } from "@angular/core";
import { CardInfo } from "../../models/card-info";
import { createForceSignal } from "../../util/force-signal";
import { shuffleArray } from "../../util/array-functions";
import { UIData, UIStateService } from "../ui-state/ui-state.service";
import { KeyValuePair } from "../../models/key-value-pair";
import { Coordiante } from "../../models/coordinate";
import { Tile } from "../../models/tile";
import { CardsHand } from "../../models/cards-hand";
import { CharactersCardsService } from "../characters-cards.service";
import { createMultiStageAction } from "../ui-state/create-multi-stage-action";
import { mapContainsMap } from "../../util/map-functions";
import { CharacterCardInfo } from "../../models/character-card-info";
import { ActionCardInfo } from "../../models/action-card-info";
import { WorldStateService } from "../world-state/world-state.service";
import { BenefitsService } from "../benefits.service";
import { Estate } from "../../models/estate";
import { getCreateEstateAction } from "./actions-cards-functions";
import { canAffordResources, spendResources } from "../world-state/functions";

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand
    private isActionHappening = signal(false)

    constructor(
        private uiStateService: UIStateService,
        private charactersCardService: CharactersCardsService,
        private worldStateService: WorldStateService,
        private benefitService: BenefitsService
    ) {
        const cards = [] 
        cards.push(this.exampleCard())
        cards.push(this.createEstateCard())
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
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t1"); return tile.key.getKey()=="0_0"},
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t2"); return tile.key.getKey()=="0_0"},
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t3"); return tile.key.getKey()=="0_0"},
            ]
            )
    }

    createEstateCard() {
        return this.createMultiStageActionCard(
            "Create estate",
            [
                (tile: KeyValuePair<Coordiante, Tile>)=> {
                    return getCreateEstateAction(this.worldStateService, this.benefitService, () => new Estate("farm", new Map([["food",2]])))(tile)
                }
            ],
            new Map([["gold", 10]])
        )
    }

    createMultiStageActionCard(
        name: string, 
        cardActions: ((tile: KeyValuePair<Coordiante, Tile>)=>boolean)[],
        price?: Map<string, number>,
    ) {
        const card = new ActionCardInfo(name, new Map([["construction", 2]]), price)
        const oldCardActions0 = cardActions[0]
        cardActions[0] = (tile: KeyValuePair<Coordiante, Tile>)=>{
            if(!(mapContainsMap(this.charactersCardService.sumOfSkills(), card.requiredSkills))) {
                return false
            }
            if(price && !canAffordResources(this.worldStateService, price)) {
                return false
            }
            const isSuccesfull = oldCardActions0(tile)
            this.isActionHappening.set(true)
            return isSuccesfull
        }
        card.onSelect = ()=>{
            return createMultiStageAction(
                this.uiStateService,
                cardActions,
                ()=>{
                    this.isActionHappening.set(false)
                    this.cardsHand.deselectCard(card)
                },
                ()=>{
                    this.isActionHappening.set(false)
                    this.charactersCardService.cardsHand.discardSelectedCards()
                    if(price) {
                        spendResources(this.worldStateService, price)
                    }
                    this.cardsHand.discardCard(card)
                }
            )
        }
        return card
    }
}
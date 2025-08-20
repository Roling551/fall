import { effect, Injectable, signal } from "@angular/core";
import { CardInfo } from "../models/card-info";
import { createForceSignal } from "../util/force-signal";
import { shuffleArray } from "../util/array-functions";
import { UIData, UIStateService } from "./ui-state/ui-state.service";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { Tile } from "../models/tile";
import { CardsHand } from "../models/cards-hand";
import { CharactersCardsService } from "./characters-cards.service";
import { createMultiStageAction } from "./ui-state/create-multi-stage-action";

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand
    private isActionHappening = signal(false)

    constructor(private uiStateService: UIStateService, private charactersCardService: CharactersCardsService) {
        const cards = [] 
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        this.cardsHand = new CardsHand(cards, ()=>{this.uiStateService.cancel()}, false)
        effect(()=>{
            charactersCardService.isHandFrozen.set(this.isActionHappening())
        })
    }

    nextTurn() {
        this.cardsHand.nextTurn()
    }

    exampleCard() {
       return this.createCard(
            "c", 
            [
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t1"); return tile.key.getKey()=="0_0"},
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t2"); return tile.key.getKey()=="0_0"},
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t3"); return tile.key.getKey()=="0_0"},
            ]
            )
    }

    createCard(name: string, cardActions: ((tile: KeyValuePair<Coordiante, Tile>)=>boolean)[]) {
        const card = new CardInfo(name)
        const oldCardActions0 = cardActions[0]
        cardActions[0] = (tile: KeyValuePair<Coordiante, Tile>)=>{
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
                    this.cardsHand.discardCard(card)
                }
            )
        }
        return card
    }
}
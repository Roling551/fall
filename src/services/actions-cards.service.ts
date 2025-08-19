import { Injectable } from "@angular/core";
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

    constructor(private uiStateService: UIStateService, private charactersCardService: CharactersCardsService) {
        const cards = [] 
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        this.cardsHand = new CardsHand(cards, ()=>{this.uiStateService.cancel()}, false)
    }

    nextTurn() {
        this.cardsHand.nextTurn()
    }

    exampleCard() {
       return this.createCard(
            "c", 
            [
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t1")},
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t2")},
                (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t3")},
            ]
            )
    }

    createCard(name: string, cardActions: ((tile: KeyValuePair<Coordiante, Tile>)=>void)[]) {
        const card = new CardInfo(name)
        card.onSelect = ()=>{
            return createMultiStageAction(
                this.uiStateService,
                cardActions,
                ()=>this.cardsHand.deselectCard(card),
                ()=>this.cardsHand.discardCard(card)
            )
        }
        return card
    }
}
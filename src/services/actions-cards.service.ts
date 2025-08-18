import { Injectable } from "@angular/core";
import { CardInfo } from "../models/card-info";
import { createForceSignal } from "../util/force-signal";
import { shuffleArray } from "../util/array-functions";
import { UIData, UIStateService } from "./ui-state/ui-state.service";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { Tile } from "../models/tile";
import { CardsHand } from "../models/cards-hand";

@Injectable({
  providedIn: 'root'
})
export class ActionsCardsService {

    public cardsHand

    constructor(private uiStateService: UIStateService) {
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
        const card = new CardInfo("c")
        card.onSelect = ()=>{
            const actions: ((tile: KeyValuePair<Coordiante, Tile>) => void)[] = new Array(cardActions.length)
            const uis: UIData[] = new Array(cardActions.length)
            
            actions[cardActions.length-1] = (tile: KeyValuePair<Coordiante, Tile>) => {
                cardActions[cardActions.length-1](tile)
                this.cardsHand.discardCard(card)
                this.uiStateService.cancel()
            }
            for(let i = cardActions.length-2; i>=0; i--) {
                uis[i] = {
                mapAction: actions[i+1],
                cancelButtonAction: ()=>{this.cardsHand.deselectCard(card)}
                }
                actions[i] = (tile: KeyValuePair<Coordiante, Tile>) => {
                cardActions[i](tile);
                this.uiStateService.setUI(uis[i], {skipBack: true, cantIterrupt: true, cantInterruptException: [uis[i+1]]})
                }
            }
            const uiChanged = this.uiStateService.setUI(
                {mapAction:actions[0], cancelButtonAction: ()=>{this.cardsHand.deselectCard(card)}}, 
                {cantIterrupt: true, override:true, cantInterruptException: [uis[0]]}
            )
            return uiChanged
        }
        return card
    }
}
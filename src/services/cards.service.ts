import { Injectable } from "@angular/core";
import { CardInfo } from "../models/card-info";
import { createForceSignal } from "../util/force-signal";
import { shuffleArray } from "../util/array-functions";
import { UIData, UIStateService } from "./ui-state/ui-state.service";
import { KeyValuePair } from "../models/key-value-pair";
import { Coordiante } from "../models/coordinate";
import { Tile } from "../models/tile";

@Injectable({
  providedIn: 'root'
})
export class CardsService {
    drawDeck = createForceSignal([] as CardInfo[])
    hand = createForceSignal([] as CardInfo[])
    discardDeck = createForceSignal([] as CardInfo[])

    selectedCard = createForceSignal<CardInfo | undefined>(undefined)

    drawsPerTurn = 5

    constructor(private uiStateService: UIStateService) {
        this.createCard()
        this.createCard()
        this.discardDeck.forceUpdate()
        this.startTurn()
    }

    createCard() {
      this.discardDeck.get().push(
        new CardInfo(
          "c", 
          [
            (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t1")},
            (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t2")},
            (tile: KeyValuePair<Coordiante, Tile>)=>{console.log("t3")},
          ]
        )
      )
    }

    discardCard(card: CardInfo) {
      this.hand.set(this.hand.get().filter(c=>c!=card))
      this.hand.forceUpdate()
      this.discardDeck.get().push(card)
      this.discardDeck.forceUpdate()
    }

    selectCard(card: CardInfo) {
      if(card == this.selectedCard.get()) {
        this.deselectCard()
        this.uiStateService.cancel()
        return
      }
      
      const actions: ((tile: KeyValuePair<Coordiante, Tile>) => void)[] = new Array(card.actions.length)
      const uis: UIData[] = new Array(card.actions.length)
      
      actions[card.actions.length-1] = (tile: KeyValuePair<Coordiante, Tile>) => {
        card.actions[card.actions.length-1](tile)
        this.discardCard(this.selectedCard.get()!)
        this.uiStateService.cancel()
      }
      for(let i = card.actions.length-2; i>=0; i--) {
        uis[i] = {
          mapAction: actions[i+1],
          cancelButtonAction: ()=>{this.deselectCard()}
        }
        actions[i] = (tile: KeyValuePair<Coordiante, Tile>) => {
          card.actions[i](tile);
          this.uiStateService.setUI(uis[i], {skipBack: true, cantIterrupt: true, cantInterruptException: [uis[i+1]]})
        }
      }
      const uiChanged = this.uiStateService.setUI(
        {mapAction:actions[0], cancelButtonAction: ()=>{this.deselectCard()}}, 
        {cantIterrupt: true, cantInterruptException: [uis[0]]}
      )
      if(uiChanged) {
        this.selectedCard.set(card)
      }
  }

  deselectCard() {
    this.selectedCard.set(undefined)
  }

  nextTurn() {
    this.endTurn()
    this.startTurn()
  }

  startTurn() {
    let drawsLeft = this.drawsPerTurn
    while(drawsLeft > 0) {
      if(this.drawDeck.get().length == 0) {
        this.shuffleCards()
      }
      if(this.drawDeck.get().length > 0) {
        const card = this.drawDeck.get().pop()!
        this.hand.get().push(card)
      } else {
        break
      }
      drawsLeft -= 1
    }
    this.drawDeck.forceUpdate()
    this.hand.forceUpdate()
  }

  shuffleCards() {
    this.drawDeck.set(shuffleArray(this.discardDeck.get()))
    this.discardDeck.set([])
  }

  endTurn() {
    this.discardDeck.set([...this.discardDeck.get(), ...this.hand.get()])
    this.hand.set([])
  }
}
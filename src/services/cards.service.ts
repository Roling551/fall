import { Injectable } from "@angular/core";
import { CardInfo } from "../models/card-info";
import { createForceSignal } from "../util/force-signal";
import { shuffleArray } from "../util/array-functions";
import { UIStateService } from "./ui-state/ui-state.service";
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
        this.discardDeck.forceUpdate()
        this.startTurn()
    }

    createCard() {
      this.discardDeck.get().push(
        new CardInfo(
          "c", 
          (tile: KeyValuePair<Coordiante, Tile>)=>{
            console.log("test")
            this.discardCard(this.selectedCard.get()!)
            this.uiStateService.cancel()
          })
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
      this.selectedCard.set(card)
      this.uiStateService.setUI({
        mapAction: card.mapAction,
        cancelButtonAction: ()=>{this.deselectCard()}
      })
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
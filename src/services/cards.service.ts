import { Injectable } from "@angular/core";
import { CardInfo } from "../models/card-info";
import { createForceSignal } from "../util/force-signal";
import { shuffleArray } from "../util/array-functions";

@Injectable({
  providedIn: 'root'
})
export class CardsService {
    drawDeck = createForceSignal([] as CardInfo[])
    hand = createForceSignal([] as CardInfo[])
    discardDeck = createForceSignal([] as CardInfo[])

    drawsPerTurn = 5

    constructor() {
        this.discardDeck.get().push(new CardInfo("c1"))
        this.discardDeck.get().push(new CardInfo("c2"))
        this.discardDeck.get().push(new CardInfo("c3"))
        this.discardDeck.get().push(new CardInfo("c4"))
        this.discardDeck.get().push(new CardInfo("c5"))
        this.discardDeck.get().push(new CardInfo("c6"))
        this.discardDeck.get().push(new CardInfo("c7"))
        this.discardDeck.get().push(new CardInfo("c8"))
        this.discardDeck.get().push(new CardInfo("c9"))
        this.discardDeck.get().push(new CardInfo("c10"))
        this.discardDeck.get().push(new CardInfo("c11"))
        this.discardDeck.get().push(new CardInfo("c12"))
        this.discardDeck.get().push(new CardInfo("c13"))
        this.discardDeck.get().push(new CardInfo("c14"))
        this.discardDeck.get().push(new CardInfo("c15"))
        this.discardDeck.get().push(new CardInfo("c16"))
        this.discardDeck.get().push(new CardInfo("c17"))
        this.discardDeck.get().push(new CardInfo("c18"))
        this.discardDeck.forceUpdate()
        this.startTurn()
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
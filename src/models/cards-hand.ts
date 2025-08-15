import { Injectable } from "@angular/core";
import { CardInfo } from "./card-info";
import { createForceSignal } from "../util/force-signal";
import { shuffleArray } from "../util/array-functions";
import { KeyValuePair } from "./key-value-pair";
import { Coordiante } from "./coordinate";
import { Tile } from "./tile";

export class CardsHand {
    drawDeck = createForceSignal([] as CardInfo[])
    hand = createForceSignal([] as CardInfo[])
    discardDeck = createForceSignal([] as CardInfo[])

    selectedCard = createForceSignal<CardInfo | undefined>(undefined)

    drawsPerTurn = 5

    constructor(cards: CardInfo[]) {
        this.drawDeck.set([...cards])
        this.discardDeck.forceUpdate()
        this.startTurn()
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
            //this.uiStateService.cancel()
            return
        }
        const canSelect = card.onSelect()
        if(canSelect) {
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
import { signal } from "@angular/core";
import { CardInfo } from "../card-info";
import { createForceSignal } from "../../util/force-signal";
import { shuffleArray } from "../../util/array-functions";
import { CardsHand } from "./cards-hand";

export class InitialCardsHand<T extends CardInfo> implements CardsHand<T> {
    drawDeck = createForceSignal([] as T[])
    hand = createForceSignal([] as T[])
    discardDeck = createForceSignal([] as T[])

    selectedCards = createForceSignal([] as T[])

    constructor(cards: T[], private onManualDeselect:()=>void, private canSelectMultiple = true, private frozen = signal(false), private drawLimitAtTurnStart = 5) {
        this.drawDeck.set([...cards])
        this.discardDeck.forceUpdate()
        this.startTurn()
    }

    discardCard(card: T) {
        this.hand.set(this.hand.get().filter(c=>c!=card))
        this.hand.forceUpdate()
        this.discardDeck.get().push(card)
        this.discardDeck.forceUpdate()
        if(this.selectedCards.get().includes(card)) {
            this.selectedCards.set(this.selectedCards.get().filter(c=>c!=card))
        }
    }

    discardSelectedCards() {
        this.hand.set(this.hand.get().filter(c=>!this.selectedCards.get().includes(c)))
        this.discardDeck.get().push(...this.selectedCards.get())
        this.discardDeck.forceUpdate()
        this.selectedCards.set([]);
    }

    isCardSelected(card: T) {
        return this.selectedCards.get().includes(card)
    }

    selectCard(card: T) {
        if(this.frozen()) {
            return
        }
        if(this.isCardSelected(card)) {
            this.deselectCard(card)
            this.onManualDeselect()
            return
        }
        if(!this.canSelectMultiple && this.selectedCards.get().length > 0) {
            return
        }
        const canSelect = card.onSelect?.() || true
        if(canSelect) {
            this.selectedCards.get().push(card)
            this.selectedCards.forceUpdate()
        }
    }

    deselectCard(card: T) {
        if(this.frozen()) {
            return
        }
        this.selectedCards.set(this.selectedCards.get().filter(c=>c!=card))
    }

    nextTurn() {
        this.startTurn()
    }

    private startTurn() {
        let drawsLeft = this.drawLimitAtTurnStart - this.hand.get().length
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

    private shuffleCards() {
        this.drawDeck.set(shuffleArray(this.discardDeck.get()))
        this.discardDeck.set([])
    }
}
import { computed, Signal, signal } from "@angular/core";
import { CardInfo } from "../card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { shuffleArray } from "../../util/array-functions";
import { CardsHand } from "./cards-hand";

export class InitialCardsHand<T extends CardInfo> implements CardsHand<T> {
    drawDeck = createForceSignal([] as T[])
    hand = createForceSignal([] as T[])
    discardDeck = createForceSignal([] as T[])

    selectedCards = createForceSignal([] as T[])

    cardLimit
    manualDrawsPerTurn
    manualDrawsLeft
    overrideSelectedCards

    constructor(cards: T[], cardLimit: number, manualDrawsPerTurn: number, private onManualDeselect:()=>void, overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>, private canSelectMultiple = true,  private frozen = signal(false)) {
        this.cardLimit = signal(cardLimit)
        this.manualDrawsPerTurn = signal(manualDrawsPerTurn)
        this.manualDrawsLeft = signal(manualDrawsPerTurn)
        this.drawDeck.set([...cards])
        this.discardDeck.forceUpdate()
        this.startTurn()
        this.overrideSelectedCards = overrideSelectedCards
    }

    manualDraw() {
        if(this.manualDrawsLeft() > 0 && this.cardLimit() > this.hand.get().length) {
            const drawedCards = this.drawCards()
            this.manualDrawsLeft.update(x=>x-drawedCards)
        }
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

    isCardOverrideSelected(card: T) {
        const overrideSelectedCards = this.overrideSelectedCards()
        if(!overrideSelectedCards) {
            return false
        }
        return overrideSelectedCards.has(card.id)
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
        this.drawCards(this.cardLimit() - this.hand.get().length)
        this.manualDrawsLeft.set(this.manualDrawsPerTurn())
    }

    drawCards(cardsNumber = 1) {
        let drawsLeft = cardsNumber
        let drawsHappend = 0
        while(drawsLeft > 0) {
            if(this.drawDeck.get().length == 0) {
                this.shuffleCards()
            }
            if(this.drawDeck.get().length > 0) {
                const card = this.drawDeck.get().pop()!
                this.hand.get().push(card)
                drawsLeft -= 1
                drawsHappend += 1
            } else {
                break
            }
        }
        this.drawDeck.forceUpdate()
        this.hand.forceUpdate()
        return drawsHappend
    }

    private shuffleCards() {
        this.drawDeck.set(shuffleArray(this.discardDeck.get()))
        this.discardDeck.set([])
    }

    selectedCardsNumber = computed(()=>{
        return this.selectedCards.get().length
    })

    deselectAllCards(force?: boolean) {
        if(this.frozen() && !(force==true)) {
            return
        }
        this.selectedCards.set([])
    }

    removeAllCards(): void {
        this.selectedCards.set([])
        this.drawDeck.set([])
        this.hand.set([])
        this.discardDeck.set([])
    }

    addCards(cards: T[]) {
        this.drawDeck.set(cards)
    }
}
import { computed, Injectable, Signal, signal } from "@angular/core";
import { CardInfo } from "../card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { shuffleArray } from "../../util/array-functions";
import { KeyValuePair } from "../key-value-pair";
import { Coordinate } from "../coordinate";
import { Tile } from "../tile/tile";
import { CardsHand } from "./cards-hand";

export class TraditionalCardsHand<T extends CardInfo> implements CardsHand<T> {
    manualDrawsLeft = signal(0)

    drawDeck = createForceSignal([] as T[])
    hand = createForceSignal([] as T[])
    discardDeck = createForceSignal([] as T[])

    selectedCards = createForceSignal([] as T[])

    overrideSelectedCards

    constructor(
        cards: T[], 
        public drawsPerTurn: number, 
        private onManualDeselect:()=>void, 
        private canSelectMultiple = true,
        private canSelectCard:Signal<boolean> = signal(true),
        private overrideClick:() => ((card: CardInfo) => void) | undefined,
        overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>,
        private selectCardInfo?: object,
    ) {
        this.drawDeck.set([...cards])
        this.discardDeck.forceUpdate()
        this.startTurn()
        this.overrideSelectedCards = overrideSelectedCards
    }

    discardCards(cards: T[]) {
        this.hand.set(this.hand.get().filter(c=>!cards.includes(c)))
        this.hand.forceUpdate()
        this.discardDeck.get().push(...cards)
        this.discardDeck.forceUpdate()
        this.selectedCards.get().filter(c=>!cards.includes(c))
        this.selectedCards.forceUpdate()
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

    selectCard(card: T, isDisabled = false) {
        if(isDisabled) {
            return
        }
        const overrideClick = this.overrideClick()
        if(overrideClick) {
            overrideClick(card)
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
        if(this.canSelectCard()) {
            const canSelect = (card.onSelect==undefined) || card.onSelect?.(this.selectCardInfo)
            if(canSelect) {
                this.selectedCards.get().push(card)
                this.selectedCards.forceUpdate()
            }
        }
    }

    deselectCard(card: T) {
        this.selectedCards.set(this.selectedCards.get().filter(c=>c!=card))
    }

    nextTurn() {
        this.endTurn()
        this.startTurn()
    }

    private startTurn() {
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

    private endTurn() {
        this.discardDeck.set([...this.discardDeck.get(), ...this.hand.get()])
        this.hand.set([])
    }

    private shuffleCards() {
        this.drawDeck.set(shuffleArray(this.discardDeck.get()))
        this.discardDeck.set([])
    }

    manualDraw(): void {
    }

    selectedCardsNumber = computed(()=>{
        return this.selectedCards.get().length
    })

    deselectAllCards() {
        this.selectedCards.set([])
    }
}
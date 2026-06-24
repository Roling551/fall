import { signal, Signal, computed } from "@angular/core";
import { shuffleArray } from "../../util/array-functions";
import { createForceSignal } from "../../util/force-signal";
import { CardInfo } from "../card-info";
import { CardsSet } from "./cards-set";

export class TraditionalCardsSet<T extends CardInfo> implements CardsSet<T>{

    hand = createForceSignal([] as T[])

    selectedCards = createForceSignal([] as T[])

    overrideSelectedCards

    constructor(
        cards: T[], 
        public drawsPerTurn: Signal<number>, 
        private onManualDeselect:()=>void, 
        private canSelectMultiple = true,
        private canSelectCard:Signal<boolean> = signal(true),
        private overrideClick:() => ((card: CardInfo) => void) | undefined,
        overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>,
    ) {
        this.hand.set(cards)
        this.overrideSelectedCards = overrideSelectedCards
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
            const canSelect = (card.onSelect==undefined) || card.onSelect?.()
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
        for(const cardInfo of this.hand.get()) {
            cardInfo.onTurnEnd()
        }
    }

    selectedCardsNumber = computed(()=>{
        return this.selectedCards.get().length
    })

    deselectAllCards() {
        this.selectedCards.set([])
    }

    removeAllCards(): void {
        this.selectedCards.set([])
        this.hand.set([])
    }

    addCards(cards: T[]) {
        this.hand.set([...this.hand.get(), ...cards])
    }
}
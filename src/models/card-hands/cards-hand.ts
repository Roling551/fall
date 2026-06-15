
import { CardInfo } from "../card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { Signal } from "@angular/core";
import { CardsSet } from "../cards-set/cards-set";

export interface CardsHand<T extends CardInfo> extends CardsSet<T> {
    drawDeck: ForceSignal<T[]>
    hand: ForceSignal<T[]>
    discardDeck: ForceSignal<T[]>
    selectedCards: ForceSignal<T[]>
    manualDrawsLeft: Signal<number>
    selectedCardsNumber: Signal<number>
    overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>

    discardCard(card: T): void
    discardSelectedCards(): void
    isCardSelected(card: T): boolean
    isCardOverrideSelected(card: T): boolean
    selectCard(card: T, isDisabled?: boolean): void
    deselectCard(card: T): void
    deselectAllCards(force?:boolean): void
    nextTurn(): void
    manualDraw(): void
    removeAllCards(): void
    addCards(cards:T[]): void
}
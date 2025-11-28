
import { CardInfo } from "../card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";
import { Signal } from "@angular/core";

export interface CardsHand<T extends CardInfo> {
    drawDeck: ForceSignal<T[]>
    hand: ForceSignal<T[]>
    discardDeck: ForceSignal<T[]>
    selectedCards: ForceSignal<T[]>
    manualDrawsLeft: Signal<number>
    selectedCardsNumber: Signal<number>

    discardCard(card: T): void
    discardSelectedCards(): void
    isCardSelected(card: T): boolean
    selectCard(card: T): void
    deselectCard(card: T): void
    deselectAllCards(force?:boolean): void
    nextTurn(): void
    manualDraw(): void
}
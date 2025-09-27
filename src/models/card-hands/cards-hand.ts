
import { CardInfo } from "../card-info";
import { createForceSignal, ForceSignal } from "../../util/force-signal";

export interface CardsHand<T extends CardInfo> {
    drawDeck: ForceSignal<T[]>
    hand: ForceSignal<T[]>
    discardDeck: ForceSignal<T[]>
    selectedCards: ForceSignal<T[]>

    discardCard(card: T): void
    discardSelectedCards(): void
    isCardSelected(card: T): boolean
    selectCard(card: T): void
    deselectCard(card: T): void
    nextTurn(): void
}
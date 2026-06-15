import { Signal } from "@angular/core"
import { ForceSignal } from "../../util/force-signal"
import { CardInfo } from "../card-info"

export interface CardsSet<T extends CardInfo> {
    hand: ForceSignal<T[]>
    selectedCards: ForceSignal<T[]>
    selectedCardsNumber: Signal<number>
    overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>

    isCardSelected(card: T): boolean
    isCardOverrideSelected(card: T): boolean
    selectCard(card: T, isDisabled?: boolean): void
    deselectCard(card: T): void
    deselectAllCards(force?:boolean): void
    nextTurn(): void
    removeAllCards(): void
    addCards(cards:T[]): void
}
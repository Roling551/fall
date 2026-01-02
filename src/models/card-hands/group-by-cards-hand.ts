import { computed, Signal, signal } from "@angular/core";
import { CardInfo } from "../card-info";
import { TraditionalCardsHand } from "./traditional-cards-hand";

export type CardSource = "draw" | "hand" | "discard"

export class GroupByCardsHand<T extends CardInfo> extends TraditionalCardsHand<T> {
    constructor(
        cards: T[], 
        drawsPerTurn: number, 
        onManualDeselect:()=>void, 
        canSelectMultiple = true, 
        frozen = signal(false), 
        canSelectCard:Signal<boolean> = signal(true),
        overrideClick:() => ((card: CardInfo) => void) | undefined,
        overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>,
        private groupingMethod: (cardInfo: CardInfo, source: CardSource)=>string|undefined,
        private groups: string[],
        selectCardInfo?: object,
    ) {
        super(
            cards,
            drawsPerTurn,
            onManualDeselect,
            canSelectMultiple,
            frozen,
            canSelectCard,
            overrideClick,
            overrideSelectedCards,
            selectCardInfo
        )
    }

    groupedCards = computed<{group: string, cards: T[]}[]>(()=> {
        const groupedCards = new Map<string, T[]>(this.groups.map(x=>[x, []]))
        groupedCards.set("rest", [])
        groupedCards.set("unavaliable", [])
        for(const card of this.drawDeck.get()) {
            const chosenGroup = this.groupingMethod(card, "draw")
            if(chosenGroup && groupedCards.has(chosenGroup)) {
                groupedCards.get(chosenGroup)?.push(card)
            } else {
                groupedCards.get("unavaliable")?.push(card)
            }
        }
        for(const card of this.hand.get()) {
            const chosenGroup = this.groupingMethod(card, "hand")
            if(chosenGroup && groupedCards.has(chosenGroup)) {
                groupedCards.get(chosenGroup)?.push(card)
            } else {
                groupedCards.get("rest")?.push(card)
            }
        }
        for(const card of this.discardDeck.get()) {
            const chosenGroup = this.groupingMethod(card, "discard")
            if(chosenGroup && groupedCards.has(chosenGroup)) {
                groupedCards.get(chosenGroup)?.push(card)
            } else {
                groupedCards.get("unavaliable")?.push(card)
            }
        }
        return [...this.groups, "rest", "unavaliable"].map(x=>({group: x, cards:groupedCards.get(x)||[]}))
    })
}
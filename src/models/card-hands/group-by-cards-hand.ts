import { computed, Signal, signal, WritableSignal } from "@angular/core";
import { CardInfo } from "../card-info";
import { TraditionalCardsHand } from "./traditional-cards-hand";
import { createForceSignal } from "../../util/force-signal";

export type CardSource = "draw" | "hand" | "discard" | "additionalDecks"

export class GroupByCardsHand<T extends CardInfo> extends TraditionalCardsHand<T> {    
    constructor(
        cards: T[], 
        drawsPerTurn: Signal<number>, 
        onManualDeselect:()=>void, 
        canSelectMultiple = true,
        canSelectCard:Signal<boolean> = signal(true),
        overrideClick:() => ((card: CardInfo) => void) | undefined,
        overrideSelectedCards: Signal<Map<number, CardInfo>|undefined>,
        private groupingMethod: (cardInfo: CardInfo, source: CardSource, additionalDeck?: string)=>{group:string, avaliable:boolean}|undefined,
        private groups: string[],
        public additionalDecks?: Signal<Map<string, T[]>>,
        selectCardInfo?: object,
    ) {
        super(
            cards,
            drawsPerTurn,
            onManualDeselect,
            canSelectMultiple,
            canSelectCard,
            overrideClick,
            overrideSelectedCards,
            selectCardInfo
        )
    }

    groupedCards = computed<{group: string, cards: {card:T, avaliable:boolean}[]}[]>(()=> {
        const groupedCards = new Map<string, {card:T, avaliable:boolean}[]>(this.groups.map(x=>[x, []]))
        groupedCards.set("rest", [])
        groupedCards.set("unavaliable", [])
        for(const card of this.drawDeck.get()) {
            const groupedInfo = this.groupingMethod(card, "draw")
            if(groupedInfo && groupedCards.has(groupedInfo.group)) {
                groupedCards.get(groupedInfo.group)?.push({card, avaliable: groupedInfo.avaliable})
            } else {
                groupedCards.get("unavaliable")?.push({card, avaliable: false})
            }
        }
        for(const card of this.hand.get()) {
            const groupedInfo = this.groupingMethod(card, "hand")
            if(groupedInfo && groupedCards.has(groupedInfo.group)) {
                groupedCards.get(groupedInfo.group)?.push({card, avaliable: groupedInfo.avaliable})
            } else {
                groupedCards.get("rest")?.push({card, avaliable: false})
            }
        }
        for(const card of this.discardDeck.get()) {
            const groupedInfo = this.groupingMethod(card, "discard")
            if(groupedInfo && groupedCards.has(groupedInfo.group)) {
                groupedCards.get(groupedInfo.group)?.push({card, avaliable: groupedInfo.avaliable})
            } else {
                groupedCards.get("unavaliable")?.push({card, avaliable: false})
            }
        }
        if(this.additionalDecks) {
            for(const [additionalDeck, cards] of this.additionalDecks()) {
                for(const card of cards) {
                    const groupedInfo = this.groupingMethod(card, "additionalDecks", additionalDeck)
                    if(groupedInfo && groupedCards.has(groupedInfo.group)) {
                        groupedCards.get(groupedInfo.group)?.push({card, avaliable: false})
                    }
                }
            }
        }
        return [...this.groups, "rest", "unavaliable"].map(x=>({group: x, cards:groupedCards.get(x)||[]}))
    })
}
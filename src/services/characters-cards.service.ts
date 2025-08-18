import { Injectable } from "@angular/core";
import { CardsHand } from "../models/cards-hand";
import { CardInfo } from "../models/card-info";

@Injectable({
  providedIn: 'root'
})
export class CharactersCardsService {
    public cardsHand

    nextTurn() {
        this.cardsHand.nextTurn()
    }

    constructor() {
        const cards: CardInfo[] = []
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        this.cardsHand = new CardsHand(cards, ()=>{})
    }

    exampleCard() {
        return new CardInfo(
            "c",
            ()=>{console.log("select"); return true}
        )
    }

}
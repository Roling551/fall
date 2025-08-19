import { computed, effect, Injectable } from "@angular/core";
import { CardsHand } from "../models/cards-hand";
import { CardInfo } from "../models/card-info";
import { CharacterCardInfo } from "../models/character-card-info";
import { baseZeroSkills } from "../models/skill";
import { addExistingNumericalValues } from "../util/map-functions";

@Injectable({
  providedIn: 'root'
})
export class CharactersCardsService {
    public cardsHand

    nextTurn() {
        this.cardsHand.nextTurn()
    }

    constructor() {
        const cards: CharacterCardInfo[] = []
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        cards.push(this.exampleCard())
        this.cardsHand = new CardsHand<CharacterCardInfo>(cards, ()=>{})
    }

    exampleCard() {
        return new CharacterCardInfo(
            "c",
            new Map([["construction", 1]])
        )
    }

    sumOfSkills = computed(() => {
        const sum = new Map(baseZeroSkills)
        for(const card of this.cardsHand.selectedCards.get()) {
            addExistingNumericalValues(sum, card.skills)
        }
        return sum
    })

}
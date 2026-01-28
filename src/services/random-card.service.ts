import { Injectable } from "@angular/core";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { DistributionAndValues, randomValue } from "../util/random-functions";

export type PossibleRarity = 0 | 1 | 2

@Injectable({
  providedIn: 'root'
})
export class RandomCardService {
    constructor(private actionCardInfoList: ActionCardInfoList) {}

    getRandomByLevelAndRarity(level: number | DistributionAndValues<number>, rarity: PossibleRarity | DistributionAndValues<PossibleRarity>, randomNumber?: number) {
        if(randomNumber == undefined) {
            randomNumber = Math.random()
        } 
        let cards:string[] = []
        let level_
        if(typeof level != "number") {
            level_ = randomValue(level)
        } else {
            level_ = level
        }
        let rarity_
        if(typeof rarity != "number") {
            rarity_ = randomValue(rarity)
        } else {
            rarity_ = rarity
        }
        while(cards.length <= 0) {
            cards = this.actionCardInfoList.listByLevelAndRarity[level_][rarity_]
            if(rarity_ > 0) {
                rarity_ -= 1
            } else if(level_ >= 0) {
                rarity = 2
                level_ -= 1
            } else {
                throw new Error("Picking random card failed")
            }
        }
        return cards[Math.floor(randomNumber * cards.length)];
    }
}
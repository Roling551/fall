import { Injectable } from "@angular/core";
import { ActionCardInfoList, CardIdentifier, getCardIdentifierName } from "./action-cards/action-card-info.list";
import { DistributionAndValues, randomValue } from "../util/random-functions";
import { ActionCardInfo } from "../models/action-card-info";

export type PossibleRarity = 0 | 1 | 2

@Injectable({
  providedIn: 'root'
})
export class RandomCardService {
    constructor(private actionCardInfoList: ActionCardInfoList) {}

    listByLevelAndRarity: [CardIdentifier[], CardIdentifier[], CardIdentifier[]][] = [
        [
            ["handDrill"],
            ["pin", "road"],
            []
        ], [
            ["drillsMaintenance", "engineeringTools", {name:"needle", state: "broken"}],
            [],
            []
        ]
    ]

    getRandomByLevelAndRarity(level: number | DistributionAndValues<number>, rarity?: PossibleRarity | DistributionAndValues<PossibleRarity>, condition?:(a:ActionCardInfo)=>boolean, randomNumber?: number) {
        let listByLevelAndRarity
        if(condition) {
            listByLevelAndRarity = this.listByLevelAndRarity.map(x=>x.map(x=>
                x.map(x=>({identifier:x, card:this.actionCardInfoList.getCardByIdentifier(getCardIdentifierName(x))}))
                .filter(x=>x.card instanceof ActionCardInfo)
                .filter(x=>condition(x.card as ActionCardInfo))
                .map(x=>x.identifier)))
        } else {
            listByLevelAndRarity = this.listByLevelAndRarity
        }
        if(randomNumber == undefined) {
            randomNumber = Math.random()
        } 
        let cards:CardIdentifier[] = []
        let level_
        if(typeof level != "number") {
            level_ = randomValue(level)
        } else {
            level_ = level
        }
        let rarity_
        if(rarity) {
            if(typeof rarity != "number") {
                rarity_ = randomValue(rarity)
            } else {
                rarity_ = rarity
            }
            while(cards.length <= 0) {
                cards = listByLevelAndRarity[level_][rarity_]
                if(rarity_ > 0) {
                    rarity_ -= 1
                } else if(level_ > 0) {
                    rarity = 2
                    level_ -= 1
                } else {
                    throw new Error("Picking random card failed")
                }
            }
        } else {
            cards = listByLevelAndRarity[level_].flat()
        }
        return cards[Math.floor(randomNumber * cards.length)];
    }
}
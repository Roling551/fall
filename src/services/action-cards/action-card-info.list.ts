import { Injectable } from "@angular/core";
import { ActionCardInfoFactoryService } from "./action-card-info-factory.service";
import { Coordinate } from "../../models/coordinate";
import { ActionCardInfo } from "../../models/action-card-info";

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoList {
    constructor(private factory: ActionCardInfoFactoryService) {}

    getCardsByNames(names: string[]) {
        return names.map(x=>this.list.get(x)).filter(x=>!!x).map(x=>x())
    }

    getRandomByLevelAndRarity(level: number, rarity: 0 | 1 | 2, randomNumber?: number) {
        if(randomNumber == undefined) {
            randomNumber = Math.random()
        } 
        let cards:string[] = []
        while(cards.length <= 0) {
            cards = this.listByLevelAndRarity[level][rarity]
            if(rarity > 0) {
                rarity -= 1
            } else if(level >= 0) {
                rarity = 2
                level -= 1
            } else {
                throw new Error("Picking random card failed")
            }
        }
        return cards[Math.floor(randomNumber * cards.length)];
    }

    listByLevelAndRarity: [string[], string[], string[]][] = [
        [
            ["handDrill"],
            ["automaticDrill", "road"],
            []
        ], [
            ["miningTools"],
            [],
            []
        ]
    ]

    list = new Map<string, ()=>ActionCardInfo>([
        [
            "handDrill",
            ()=>this.factory.instantExtractionCard(
                {
                    type: "InstantExtractionCardInputs",
                    name: "handDrill",
                    skillRequired: new Map([["construction", 2]]),
                    skillApplied: new Map([["mining",1]]),
                    affectedCoordinates: [new Coordinate(0,0)]
                }
            )
        ],
        [
            "automaticDrill",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "automaticDrill",
                    cardPicture: "pin-drill",
                    skillRequired: new Map([["construction", 2]]),
                    skillApplied: new Map([["mining",3]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "drill",
                    price: new Map([["scrap", 5]]),
                    runCost: new Map([["oil", 1]]),
                }
            )
        ],
        [
            "road",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "road",
                    skillRequired: new Map([["construction", 1]]),
                    movementBonus: 1,
                    estateTexture: "road",
                    isUpgrade: true,
                    instancesNumber: 2
                }
            )
        ],
        [
            "miningTools",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "miningTools",
                    skillRequired: new Map([["construction", 2]]),
                    skillMapActionSkillBonus: new Map([["mining",1]]),
                    affectedCoordinates:  [new Coordinate(0,0), new Coordinate(0,1), new Coordinate(0,-1)],
                    estateTexture: "workshop",
                    price: new Map([["scrap", 5]]),
                    runCost: new Map([["oil", 1]])
                }
            )
        ],[
            "plasticFactory",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "plasticFactory",
                    skillRequired: new Map([["construction", 2]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "plastic-factory",
                    price: new Map([["scrap", 5]]),
                    runCost: new Map([["oil", 1], ["electricity", 1]]),
                    producedResources: new Map([["scrap", 1]]),
                }
            )
        ],[
            "powerplant",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "powerplant",
                    skillRequired: new Map([["construction", 2]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "plastic-factory",
                    price: new Map([["scrap", 5]]),
                    runCost: new Map([["oil", 1]]),
                    producedResources: new Map([["electricity", 5]]),
                }
            )
        ]
    ])
}
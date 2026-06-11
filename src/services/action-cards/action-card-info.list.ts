import { Injectable } from "@angular/core";
import { ActionCardInfoFactoryService } from "./action-card-info-factory.service";
import { Coordinate } from "../../models/coordinate";
import { ActionCardInfo } from "../../models/action-card-info";
import { Extraction } from "../../models/extraction";
import { generateRangeCoordiantes } from "../../util/generate-coordinates";
import { CardInfo } from "../../models/card-info";
import { Resource } from "../../models/resource";
import { Skill } from "../../models/skill";

export type CardState = "regular" | "broken"

export type CardIdentifier = string | {name:string, state:CardState}

export function getCardIdentifierName(cardIdentifier: CardIdentifier): string {
    return typeof cardIdentifier == "string" ? cardIdentifier : cardIdentifier.name
}

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoList {
    constructor(private factory: ActionCardInfoFactoryService) {}

    getCardByIdentifier(identifier: CardIdentifier) {
        let name
        let state
        if(typeof identifier == "string") {
            name = identifier
            state = "regular"
        } else {
            name = identifier.name
            state = identifier.state
        }
        if(state === "regular") {
            return this.list.get(name)!()
        } else// if(state === "broken") 
        {
            if(this.repairCostList.has(name)) {
                const cost = this.repairCostList.get(name)!()
                return this.factory.cardOverlayCard(
                    {
                        name: "broken " + name,
                        overlayedCardName: name,
                        actionType: "buyCard",
                        skillRequired: cost.skill,
                        price: cost.price
                    }
                )
            } else {
                return this.list.get(name)!()
            }
        }
    }

    getCardsByIdentifiers(identifiers: CardIdentifier[]): CardInfo[] {
        return identifiers.map(x=>this.getCardByIdentifier(x))
    }

    private repairCostList = new Map<string, ()=>{price:Map<Resource, number>, skill:Map<Skill, number>}>([[
        "needle", ()=>({price:new Map([["plastic", 2]]), skill:new Map([["mining", 2]])})
    ]])

    private list = new Map<string, ()=>CardInfo>([
        [
            "test",
            ()=>this.factory.createCard(
                {
                    type: "",
                    name: "test",
                    skillRequired: new Map(),
                    operation: {
                        name: "demolishEstate",
                        refundFraction: 1,
                        repeatNumber: 2
                    },
                }
            )
        ]
        // [
        //     "handDrill",
        //     ()=>this.factory.instantExtractionCard(
        //         {
        //             type: "InstantExtractionCardInputs",
        //             name: "handDrill",
        //             skillRequired: new Map([["mining", 2]]),
        //             extraction: new Extraction(12, new Map([["sharpness", 5]])),
        //             affectedCoordinates: [new Coordinate(0,0)]
        //         }
        //     )
        // ],
        // [
        //     "tick",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "Tick",
        //             skillRequired: new Map([["mining", 1]]),
        //             extraction: new Extraction(4),
        //             affectedCoordinates: [new Coordinate(0,0)],
        //             estateTexture: "tick-on-map",
        //             price: new Map([["scrap", 5]]),
        //             runCost: new Map([["oil", 2]]),                    
        //             attributes: [{
        //                 effect: {
        //                     type: "Extraction",
        //                     bonus: new Extraction(6)
        //                 },
        //                 multiplier: "Extractions"
        //             }]
        //         }
        //     )
        // ],
        // [
        //     "pin",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "Pin",
        //             cardPicture: "pin-drill",
        //             skillRequired: new Map([["engineering", 2]]),
        //             extraction: new Extraction(8),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "pin-on-map",
        //             price: new Map([["scrap", 10]]),
        //             runCost: new Map([["oil", 3]]),
        //         }
        //     )
        // ],
        // [
        //     "needle",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "Needle",
        //             cardPicture: "needle",
        //             skillRequired: new Map([["mining", 1],["engineering", 3]]),
        //             extraction: new Extraction(15, new Map([["sharpness", 5]])),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "needle-on-map",
        //             price: new Map([["scrap", 10],["plastic", 5]]),
        //             runCost: new Map([["electricity", 5]]),
        //         }
        //     )
        // ],
        // [
        //     "danceJack",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "Dance Jack",
        //             cardPicture: "dance-jack",
        //             skillRequired: new Map([["mining", 2],["engineering", 1]]),
        //             extraction: new Extraction(4),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "dance-jack-on-map",
        //             price: new Map([["scrap", 8],["plastic", 2]]),
        //             runCost: new Map([["oil", 2]]),
        //             attributes: [{
        //                 effect: {
        //                     type: "Extraction",
        //                     bonus: new Extraction(2)
        //                 },
        //                 multiplier: "Extractions"
        //             }]
        //         }
        //     )
        // ],
        // [
        //     "hammer",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "Hammer",
        //             skillRequired: new Map([["mining", 2]]),
        //             extraction: new Extraction(10, new Map([["sharpness", 3], ["waste", 3]])),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "hammer-on-map",
        //             price: new Map([["scrap", 8]]),
        //             runCost: new Map([["oil", 2]]),
        //         }
        //     )
        // ],
        // [
        //     "road",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "road",
        //             skillRequired: new Map([["construction", 1]]),
        //             movementBonus: 1,
        //             estateTexture: "road",
        //             isUpgrade: true,
        //             instancesNumber: 2
        //         }
        //     )
        // ],
        // [
        //     "drillsMaintenance",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "drillsMaintenance",
        //             skillRequired: new Map([["construction", 1], ["engineering", 1]]),
        //             tileBonus: {
        //                 extraction: new Extraction(2)
        //             },
        //             affectedCoordinates:  generateRangeCoordiantes(1),
        //             estateTexture: "workshop",
        //             price: new Map([["scrap", 5]])
        //         }
        //     )
        // ],
        // [
        //     "engineeringTools",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "engineeringTools",
        //             skillRequired: new Map([["construction", 2]]),
        //             tileBonus: {
        //                 skillsBonus: new Map([["engineering", 1]])
        //             },
        //             affectedCoordinates:  generateRangeCoordiantes(3),
        //             estateTexture: "workshop",
        //             price: new Map([["scrap", 5]])
        //         }
        //     )
        // ],
        // [
        //     "miningTools",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "miningTools",
        //             skillRequired: new Map([["construction", 2]]),
        //             tileBonus: {
        //                 skillsBonus: new Map([["mining", 1]])
        //             },
        //             affectedCoordinates:  generateRangeCoordiantes(3),
        //             estateTexture: "workshop",
        //             price: new Map([["scrap", 5]])
        //         }
        //     )
        // ],
        // [
        //     "constructionTools",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "constructionTools",
        //             skillRequired: new Map([["construction", 2]]),
        //             tileBonus: {
        //                 skillsBonus: new Map([["construction", 1]])
        //             },
        //             affectedCoordinates:  generateRangeCoordiantes(3),
        //             estateTexture: "workshop",
        //             price: new Map([["scrap", 5]])
        //         }
        //     )
        // ],
        // [
        //     "plasticFactory",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "plasticFactory",
        //             skillRequired: new Map([["construction", 3],["engineering", 3]]),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "plastic-factory-on-map",
        //             price: new Map([["scrap", 12]]),
        //             runCost: new Map([["oil", 6]]),
        //             producedResources: new Map([["plastic", 2]]),
        //         }
        //     )
        // ],[
        //     "powerplant",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "powerplant",
        //             skillRequired: new Map([["construction", 3],["engineering", 2]]),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "powerplant-on-map",
        //             price: new Map([["scrap", 10]]),
        //             runCost: new Map([["oil", 4]]),
        //             producedResources: new Map([["electricity", 10]]),
        //         }
        //     )
        // ],
        // [
        //     "shabby",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "shabby",
        //             skillRequired: new Map([["construction", 1],["engineering", 1]]),
        //             affectedCoordinates:  [new Coordinate(0,0)],
        //             estateTexture: "shabby-on-map",
        //             price: new Map([["scrap", 6]]),
        //             producedResources: new Map([["electricity", 3]]),
        //         }
        //     )
        // ],
        // [
        //     "mosquito",
        //     ()=>this.factory.estateCard(
        //         {
        //             type: "EstateCardInputs",
        //             name: "Mosquito",
        //             skillRequired: new Map([["mining", 1]]),
        //             extraction: new Extraction(4, new Map([["sharpness", 1]])),
        //             affectedCoordinates: [new Coordinate(0,0)],
        //             estateTexture: "mosquito-on-map",
        //             price: new Map([["scrap", 6]]),
        //             runCost: new Map([["electricity", 2]]),
        //         }
        //     )
        // ],
    ])
}
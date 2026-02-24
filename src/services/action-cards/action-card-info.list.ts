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
            "handDrill",
            ()=>this.factory.instantExtractionCard(
                {
                    type: "InstantExtractionCardInputs",
                    name: "handDrill",
                    skillRequired: new Map([["mining", 4], ["engineering", 1]]),
                    extraction: new Extraction(12, new Map([["sharpness", 5], ["precission", 5]])),
                    affectedCoordinates: [new Coordinate(0,0)]
                }
            )
        ],
        [
            "tick",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "Tick",
                    skillRequired: new Map([["mining", 2],["engineering", 2]]),
                    extraction: new Extraction(4),
                    affectedCoordinates: [new Coordinate(0,0)],
                    estateTexture: "tick-on-map",
                    price: new Map([["scrap", 5]]),
                    runCost: new Map([["oil", 2]]),
                }
            )
        ],
        [
            "pin",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "Pin",
                    cardPicture: "pin-drill",
                    skillRequired: new Map([["mining", 2],["engineering", 4]]),
                    extraction: new Extraction(8),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "pin-on-map",
                    price: new Map([["scrap", 10]]),
                    runCost: new Map([["oil", 3]]),
                }
            )
        ],
        [
            "needle",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "Needle",
                    cardPicture: "needle",
                    skillRequired: new Map([["mining", 4],["engineering", 8]]),
                    extraction: new Extraction(15, new Map([["sharpness", 5]])),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "needle-on-map",
                    price: new Map([["scrap", 10],["plastic", 5]]),
                    runCost: new Map([["electricity", 4]]),
                }
            )
        ],
        [
            "danceJack",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "Dance Jack",
                    cardPicture: "dance-jack",
                    skillRequired: new Map([["mining", 2],["engineering", 4]]),
                    extraction: new Extraction(4),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "dance-jack-on-map",
                    price: new Map([["scrap", 8],["plastic", 2]]),
                    runCost: new Map([["oil", 2]]),
                    attributes: new Map([["synchronized", 2]])
                }
            )
        ],
        [
            "hammer",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "Hammer",
                    skillRequired: new Map([["mining", 4],["engineering", 2]]),
                    extraction: new Extraction(10, new Map([["sharpness", 3], ["waste", 2]])),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "hammer-on-map",
                    price: new Map([["scrap", 8]]),
                    runCost: new Map([["oil", 2]]),
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
            "drillsMaintenance",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "drillsMaintenance",
                    skillRequired: new Map([["construction", 3], ["engineering", 1]]),
                    tileBonus: {
                        extraction: new Extraction(2)
                    },
                    affectedCoordinates:  generateRangeCoordiantes(1),
                    estateTexture: "workshop",
                    price: new Map([["scrap", 5]])
                }
            )
        ],
        [
            "engineeringTools",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "engineeringTools",
                    skillRequired: new Map([["construction", 3], ["engineering", 1]]),
                    tileBonus: {
                        skillsBonus: new Map([["engineering", 1]])
                    },
                    affectedCoordinates:  generateRangeCoordiantes(2),
                    estateTexture: "workshop",
                    price: new Map([["scrap", 5]])
                }
            )
        ],
        [
            "plasticFactory",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "plasticFactory",
                    skillRequired: new Map([["construction", 2],["engineering", 6]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "plastic-factory-on-map",
                    price: new Map([["scrap", 12]]),
                    runCost: new Map([["oil", 6]]),
                    producedResources: new Map([["plastic", 2]]),
                }
            )
        ],[
            "powerplant",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "powerplant",
                    skillRequired: new Map([["construction", 4],["engineering", 4]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "powerplant-on-map",
                    price: new Map([["scrap", 10]]),
                    runCost: new Map([["oil", 2]]),
                    producedResources: new Map([["electricity", 5]]),
                }
            )
        ]
    ])
}
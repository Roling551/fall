import { Injectable } from "@angular/core";
import { ActionCardInfoFactoryService } from "./action-card-info-factory.service";
import { Coordinate } from "../../models/coordinate";
import { ActionCardInfo } from "../../models/action-card-info";
import { Extraction } from "../../models/extraction";
import { generateRangeCoordiantes } from "../../util/generate-coordinates";

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoList {
    constructor(private factory: ActionCardInfoFactoryService) {}

    getCardsByNames(names: string[]) {
        return names.map(x=>this.list.get(x)).filter(x=>!!x).map(x=>x())
    }

    listByLevelAndRarity: [string[], string[], string[]][] = [
        [
            ["handDrill"],
            ["pin", "road"],
            []
        ], [
            ["miningTools", "needle"],
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
                    skillRequired: new Map([["mining", 4], ["engineering", 1]]),
                    extraction: new Extraction(12, new Map([["sharpness", 1]])),
                    affectedCoordinates: [new Coordinate(0,0)]
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
                    skillRequired: new Map([["construction", 3], ["engineering", 1]]),
                    extractionBonus: new Extraction(2),
                    affectedCoordinates:  generateRangeCoordiantes(1),
                    estateTexture: "workshop",
                    price: new Map([["scrap", 5]])
                }
            )
        ],[
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
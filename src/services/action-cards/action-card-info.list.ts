import { Injectable } from "@angular/core";
import { ActionCardCreationInfoFactoryService } from "./action-card-creation-info-factory.service";
import { Coordinate } from "../../models/coordinate";
import { simpleCardOnHandBenefits } from "../../models/card-on-hand-benefit";
import { ActionCardInfo } from "../../models/action-card-info";

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoList {
    constructor(private factory: ActionCardCreationInfoFactoryService) {}

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
                    skillRequired: new Map([["construction", 2]]),
                    skillApplied: new Map([["mining",3]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "farm",
                    price: new Map([["oil", 5]]),
                    runCost: new Map([["oil", 1]]),
                    cardOnHandBenefits: simpleCardOnHandBenefits("automaticDrill", new Map([["mining",1]]))
                }
            )
        ],
        [
            "road",
            ()=>this.factory.estateCard(
                {
                    type: "EstateCardInputs",
                    name: "road",
                    skillRequired: new Map([["construction", 2]]),
                    movementBonus: 1,
                    affectedCoordinates:  [new Coordinate(0,0), new Coordinate(1,0), new Coordinate(0,1), new Coordinate(-1,0), new Coordinate(0,-1)],
                    estateTexture: "road",
                    price: new Map([["oil", 5]]),
                    runCost: new Map([["oil", 1]]),
                    isUpgrade: true
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
                    estateTexture: "mine",
                    price: new Map([["oil", 5]]),
                    runCost: new Map([["oil", 1]])
                }
            )
        ]
    ])
}
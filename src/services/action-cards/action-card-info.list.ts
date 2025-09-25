import { Injectable } from "@angular/core";
import { ActionCardCreationInfoFactoryService } from "./action-card-creation-info-factory.service";
import { CardCreationInfo } from "./actions-cards.service";
import { Coordinate } from "../../models/coordinate";

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoList {
    constructor(private factory: ActionCardCreationInfoFactoryService) {}

    list = new Map<string, ()=>CardCreationInfo>([
        [
            "handDrill",
            ()=>this.factory.instantExtractionCard(
                {    
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
                    name: "automaticDrill",
                    skillRequired: new Map([["construction", 2]]),
                    skillApplied: new Map([["mining",3]]),
                    affectedCoordinates:  [new Coordinate(0,0)],
                    estateTexture: "farm",
                    price: new Map([["oil", 5]]),
                    runCost: new Map([["oil", 1]])
                }
            )
        ],
        [
            "miningTools",
            ()=>this.factory.estateCard(
                {
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
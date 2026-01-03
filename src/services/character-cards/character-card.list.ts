import { Injectable } from "@angular/core";
import { CharacterCardInfoFactoryService } from "./character-card-info-factory.service";
import { CharacterCardInfo } from "../../models/character-card-info";
import { ResourcesReward } from "../../models/reward";
import { RewardFactoryService } from "../reward-factory.service";

@Injectable({
  providedIn: 'root'
})
export class CharacterCardInfoList {
    constructor(private characterCardFactory: CharacterCardInfoFactoryService, private rewardFactoryService: RewardFactoryService) {}

    getCardsByNames(names: string[]) {
        return names.map(x=>this.list.get(x)).filter(x=>!!x).map(x=>x())
    }

    list = new Map<string, ()=>CharacterCardInfo>([
        [
            "recycler",
            ()=>this.characterCardFactory.createCharacterCard({
                name: "recycler",
                skills: new Map([["construction", 1]],),
                movement: 3,
                characterAction: {
                    name: "recycleActionCard",
                    repeatNumber: 2,
                    resourcesPerRecycled: 10,
                },
                cardPicture: "dwarf2",
            })
        ],
        [
            "demolisher",
            ()=>this.characterCardFactory.createCharacterCard({
                name: "demolisher",
                skills: new Map([["construction", 1]],),
                movement: 3,
                characterAction: {
                    name: "demolishEstate",
                    refundFraction: 0.5,
                    repeatNumber: 2,
                },
                cardPicture: "dwarf1",
            })
        ],
        [
            "accountant",
            ()=>this.characterCardFactory.createCharacterCard({
                name: "accountant",
                skills: new Map([["construction", 1]],),
                movement: 3,
                characterAction: {
                    name: "getReward",
                    reward: this.rewardFactoryService.createReward({type: "Resources", resources: new Map([["computation",5]])}),
                },
                cardPicture: "dwarf3",
            })
        ]
    ])
}
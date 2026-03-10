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
                name: "RECYCLER",
                skills: new Map([["engineering", 5], ["construction", 2], ["mining", 2]]),
                characterAction: {
                    name: "recycleActionCard",
                    repeatNumber: 3,
                    resourcesPerRecycled: 10,
                },
                cardPicture: "dwarf2",
            })
        ],
        [
            "demolisher",
            ()=>this.characterCardFactory.createCharacterCard({
                name: "DEMOLISHER",
                skills: new Map([["engineering", 2], ["construction", 5], ["mining", 2]]),
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
                name: "ACCOUNTANT",
                skills: new Map([["engineering", 2], ["construction", 2], ["mining", 2]],),
                characterAction: {
                    name: "getReward",
                    reward: this.rewardFactoryService.createReward({type: "Resources", resources: new Map([["computation",5]])}),
                },
                cardPicture: "dwarf3",
            })
        ],
        [
            "miner",
            ()=>this.characterCardFactory.createCharacterCard({
                name: "MINER",
                skills: new Map([["engineering", 2], ["construction", 2], ["mining", 5]],),
                characterAction: {
                    name: "getReward",
                    reward: this.rewardFactoryService.createReward({type: "Resources", resources: new Map([["oil",1]])}),
                },
                cardPicture: "dwarf4",
            })
        ]
    ])
}
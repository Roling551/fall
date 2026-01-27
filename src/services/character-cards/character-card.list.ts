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
                skills: new Map([["engineering", 5], ["construction", 2], ["mining", 2]]),
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
                name: "accountant",
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
                name: "miner",
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
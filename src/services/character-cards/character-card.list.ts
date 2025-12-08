import { Injectable } from "@angular/core";
import { CharacterCardInfoFactoryService } from "./character-card-info-factory.service";
import { CharacterCardInfo } from "../../models/character-card-info";

@Injectable({
  providedIn: 'root'
})
export class CharacterCardInfoList {
    constructor(private characterCardFactory: CharacterCardInfoFactoryService) {}

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
                }
            })
        ],
        [
            "remover",
            ()=>this.characterCardFactory.createCharacterCard({
                name: "remover",
                skills: new Map([["construction", 1]],),
                movement: 3,
                characterAction: {
                    name: "removeEstate",
                    repeatNumber: 2
                }
            })
        ]
    ])
}
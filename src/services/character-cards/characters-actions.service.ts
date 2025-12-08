import { Injectable } from "@angular/core";
import { InjectorService } from "../injector.service";
import { CardInfo } from "../../models/card-info";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { CharacterActionInfo } from "../../models/character-card-info";

export type CharacterActionInput = {
    name: "recycleActionCard",
    resourcesPerRecycled: number,
    repeatNumber?: number,
} | {
    name: "removeEstate",
    repeatNumber?: number,
}

@Injectable({
  providedIn: 'root'
})
export class CharactersActionsService {
    constructor(private injectorService: InjectorService) {}

    getCharacterActionInfo(input: CharacterActionInput): CharacterActionInfo {
        const repeatNumber = input.repeatNumber || 1
        switch(input.name) {
            case "recycleActionCard":
                return {
                    type: "Card",
                    canSelectCard: (card: CardInfo) => card.type == "ActionCard",
                    finishAction: (selectedCards:Map<number, CardInfo>) => {
                        this.recycleCards(selectedCards, input.resourcesPerRecycled)
                    },
                    repeatNumber
                }
            case "removeEstate":
                return {
                    type: "Tile",
                    canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>{
                        return true
                    },
                    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => {
                        console.log(selectedTiles.size)
                    },
                    repeatNumber
                }
        }
    }

    private recycleCards(selectedCards:Map<number, CardInfo>, resourcesPerRecycled: number) {
        let removedNumber = this.injectorService.getActionsCardsService()
            .removeCardsFromHandAndCount([...selectedCards.values()])
        this.injectorService.getResourcesService().addResources(new Map([["scrap", resourcesPerRecycled * removedNumber]]))
    }
}
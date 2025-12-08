import { Injectable } from "@angular/core";
import { InjectorService } from "../injector.service";
import { CardInfo } from "../../models/card-info";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { CharacterActionInfo } from "../../models/character-card-info";

export type CharacterActionInput = {
    name: "recycleActionCard",
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
                    finishAction: (selectedCards:Map<number, CardInfo>) => {},
                    repeatNumber
                }
            case "removeEstate":
                return {
                    type: "Tile",
                    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => {},
                    repeatNumber
                }
        }
    }
}
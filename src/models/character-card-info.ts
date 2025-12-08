import { CardInfo } from "./card-info";
import { Coordinate } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { ObstacleType } from "./obstacles";
import { Skill } from "./skill";
import { Tile } from "./tile/tile";

export type CharacterActionInfo = {
    type: "Card",
    finishAction: (selectedCards:Map<number, CardInfo>) => void,
    repeatNumber: number,
} | {
    type: "Tile",
    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => void,
    repeatNumber: number,
}


export class CharacterCardInfo extends CardInfo{
    constructor(
        name:string, 
        public skills: Map<Skill, number>, 
        public movement: number, 
        public actionInfo: CharacterActionInfo,
        public movementAdvantege?: Map<ObstacleType, number>,
    ) {
        super(name)
    }
}
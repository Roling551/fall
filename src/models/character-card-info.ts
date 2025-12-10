import { CardInfo } from "./card-info";
import { Coordinate } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { ObstacleType } from "./obstacles";
import { Skill } from "./skill";
import { Tile } from "./tile/tile";

export type CharacterActionInfo = {
    type: "Card",
    canSelectCard: (card: CardInfo)=>boolean,
    finishAction: (selectedCards:Map<number, CardInfo>) => void,
    repeatNumber: number,
} | {
    type: "Tile",
    canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>boolean,
    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => void,
    repeatNumber: number,
}


export class CharacterCardInfo extends CardInfo{
    constructor(
        name:string, 
        public skills: Map<Skill, number>, 
        public movement: number, 
        public actionInfo: CharacterActionInfo,
        public actionDescription: string,
        public movementAdvantege?: Map<ObstacleType, number>,
        public cardPicture?: string,
    ) {
        super(name, "CharacterCard")
    }
}
import { CardsActionInfo } from "../services/cards-actions.service";
import { CardInfo } from "./card-info";
import { ObstacleType } from "./obstacles";
import { Skill } from "./skill";
import { TextPart } from "./text-part";

export class CharacterCardInfo extends CardInfo{
    constructor(
        name: string, 
        public skills: Map<Skill, number>,
        public actionInfo: CardsActionInfo,
        public actionDescription: TextPart[],
        public movementAdvantege?: Map<ObstacleType, number>,
        public cardPicture?: string,
    ) {
        super(name, "CharacterCard")
    }
}
import { CardInfo } from "./card-info";
import { ObstacleType } from "./obstacles";
import { Skill } from "./skill";

export class CharacterCardInfo extends CardInfo{
    constructor(name:string, public skills: Map<Skill, number>, public movement: number, public movementAdvantege?: Map<ObstacleType, number>) {
        super(name)
    }
}
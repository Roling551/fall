import { CardInfo } from "./card-info";
import { Skill } from "./skill";

export class CharacterCardInfo extends CardInfo{
    constructor(name:string, public skills: Map<Skill, number>) {
        super(name)
    }
}
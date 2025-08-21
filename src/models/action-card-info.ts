import { CardInfo } from "./card-info";
import { Skill } from "./skill";

export class ActionCardInfo extends CardInfo {
    constructor(name: string, public requiredSkills: Map<Skill, number>, public price?: Map<string, number>) {
        super(name)
    }
}
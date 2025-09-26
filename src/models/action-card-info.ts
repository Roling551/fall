import { SkillMapActionSkillBonus } from "./bonus";
import { CardInfo } from "./card-info";
import { CardOnHandBenefits } from "./card-on-hand-benefit";
import { Skill } from "./skill";

export class ActionCardInfo extends CardInfo {
    constructor(
        name: string,
        public requiredSkills: Map<Skill, number>,
        public price?: Map<string, number>,
        public cardOnHandBenefits: CardOnHandBenefits = new Map([]),
    ) {
        super(name)
    }
}
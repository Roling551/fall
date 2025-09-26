import { SkillMapActionSkillBonus } from "./bonus"
import { Skill } from "./skill"
import { Tile } from "./tile"

export type CardOnHandBenefitType = "skill-map-action-skill-bonus"

export type CardOnHandBenefit = SkillMapActionSkillBonus

export type CardOnHandBenefits = Map<CardOnHandBenefitType, CardOnHandBenefit>

export function simpleCardOnHandBenefits(cardName: string, skillMapActionSkillBonus: Map<Skill, number>): CardOnHandBenefits {
    return new Map([["skill-map-action-skill-bonus", {
            name: "simpleCardOnHandBenefits-"+cardName,
            qualifier: (tile: Tile)=>true,
            bonus: skillMapActionSkillBonus
        }
    ]])
}


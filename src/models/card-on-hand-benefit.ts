import { SkillMapActionSkillBonus } from "./bonus"
import { Skill } from "./skill"
import { Tile } from "./tile/tile"

let idCounter = 0

export type CardOnHandBenefitType = "skill-map-action-skill-bonus"

export type CardOnHandBenefit = SkillMapActionSkillBonus

export type CardOnHandBenefits = Map<CardOnHandBenefitType, CardOnHandBenefit>

export function simpleCardOnHandBenefits(cardName: string, skillMapActionSkillBonus: Map<Skill, number>): CardOnHandBenefits {
    const benefits = new Map([["skill-map-action-skill-bonus", {
            name: "simpleCardOnHandBenefits-"+cardName+"-"+idCounter,
            qualifier: (tile: Tile)=>true,
            bonus: skillMapActionSkillBonus
        }
    ]])
    idCounter += 1
    return benefits as CardOnHandBenefits
}


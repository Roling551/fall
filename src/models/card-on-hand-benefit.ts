import { SkillMapActionSkillBonus } from "./bonus"
import { Skill, skillsToString } from "./skill"
import { Tile } from "./tile/tile"

let idCounter = 0

export type CardOnHandBenefitType = "skill-map-action-skill-bonus"

export type CardOnHandBenefit = {type:"skill-map-action-skill-bonus", benefit:SkillMapActionSkillBonus}

export function simpleCardOnHandBenefits(cardName: string, skillMapActionSkillBonus: Map<Skill, number>): CardOnHandBenefit[] {
    const benefits = [{type:"skill-map-action-skill-bonus", benefit:{
        name: "simpleCardOnHandBenefits-"+cardName+"-"+idCounter,
        qualifier: (tile: Tile)=>true,
        bonus: skillMapActionSkillBonus
    }}]
    idCounter += 1
    return benefits as CardOnHandBenefit[]
}

export function getCardOnHandBenefitTypeSymbol(type: CardOnHandBenefitType) {
    return ""
}

export function cardOnHandBenefitsToString(benefits: CardOnHandBenefit[]) {
    let str = ""
    for(const benefit of benefits) {
        console.log(benefit)
        console.log(skillsToString(benefit.benefit.bonus))
        console.log(benefit.benefit.bonus)
        if(benefit.type === "skill-map-action-skill-bonus") {
            str += getCardOnHandBenefitTypeSymbol(benefit.type) + ":" + skillsToString(benefit.benefit.bonus)
        }
    }
    return str
}


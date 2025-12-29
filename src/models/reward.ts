import { DecisionFactoryOption } from "../services/decision-factory.service"
import { SkillMapActionSkillBonus } from "./bonus"
import { CardInfo } from "./card-info"
import { Resource, resourcesToTextParts } from "./resource"
import { skillsToString } from "./skill"
import { TextPart } from "./text-part"

export type RewardOption = {
    type: "Card",
    cardName: string
} | {
    type: "Resources",
    resources: Map<Resource, number>
} | {
    type: "SkillMapActionSkillBonus",
    skillBonus: SkillMapActionSkillBonus
} | {
    type: "Decision",
    decisionFactoryOptions: DecisionFactoryOption[]
}

export type RewardType = "Card" | "Resources" | "SkillMapActionSkillBonus" | "Decision"

export interface Reward {
    rewardType: RewardType
    getTextParts(): TextPart[]
    claim(): void
}

export class CardReward implements Reward {
    rewardType: RewardType = "Card";
    constructor(public cardToAdd: CardInfo, private claimFunction: ()=>void) {}
    getTextParts() {
        return ["receive card: " + this.cardToAdd.name]
    }
    claim() {
        this.claimFunction()
    }
}

export class ResourcesReward implements Reward {
    rewardType: RewardType = "Resources";
    constructor(public resources: Map<Resource, number>, private claimFunction: ()=>void) {}
    getTextParts() {
        return ["receive resources: ", ...resourcesToTextParts(this.resources)]
    }
    claim() {
        this.claimFunction()
    }
}

export class SkillMapActionSkillBonusReward implements Reward {
    rewardType: RewardType = "SkillMapActionSkillBonus";
    constructor(public skillBonus: SkillMapActionSkillBonus, private claimFunction: ()=>void) {}
    getTextParts() {
        return ["skill bonus: " + skillsToString(this.skillBonus.bonus)]
    }
    claim() {
        this.claimFunction()
    }
}

export class DecisionReward implements Reward {
    rewardType: RewardType = "Decision"
    constructor(private claimFunction: ()=>void) {}
    getTextParts() {
        return ["decision"]
    }
    claim(): void {
        this.claimFunction()
    }
    
}
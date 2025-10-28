import { SkillMapActionSkillBonus } from "./bonus"
import { CardInfo } from "./card-info"
import { Resource, resourcesToString } from "./resource"
import { skillsToString } from "./skill"

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
    type: "Decision"
}

export type RewardType = "Card" | "Resources" | "SkillMapActionSkillBonus" | "Decision"

export interface Reward {
    rewardType: RewardType
    getText(): string
    claim(): void
}

export class CardReward implements Reward {
    rewardType: RewardType = "Card";
    constructor(public cardToAdd: CardInfo, private claimFunction: ()=>void) {}
    getText() {
        return "receive card: " + this.cardToAdd.name
    }
    claim() {
        this.claimFunction()
    }
}

export class ResourcesReward implements Reward {
    rewardType: RewardType = "Resources";
    constructor(public resources: Map<Resource, number>, private claimFunction: ()=>void) {}
    getText() {
        return "receive resources: " + resourcesToString(this.resources)
    }
    claim() {
        this.claimFunction()
    }
}

export class SkillMapActionSkillBonusReward implements Reward {
    rewardType: RewardType = "SkillMapActionSkillBonus";
    constructor(public skillBonus: SkillMapActionSkillBonus, private claimFunction: ()=>void) {}
    getText() {
        return "skill bonus: " + skillsToString(this.skillBonus.bonus)
    }
    claim() {
        this.claimFunction()
    }
}

export class DecisionReward implements Reward {
    rewardType: RewardType = "Decision"
    constructor(private claimFunction: ()=>void) {}
    getText(): string {
        return "decision"
    }
    claim(): void {
        this.claimFunction()
    }
    
}
import { SkillMapActionSkillBonus } from "./bonus"
import { CardInfo } from "./card-info"
import { Resource } from "./resource"

export type RewardOption = {
    type: "Card",
    cardName: string
} | {
    type: "Resources",
    resources: Map<Resource, number>
} | {
    type: "SkillMapActionSkillBonus",
    skillBonus: SkillMapActionSkillBonus
}

export type RewardType = "Card" | "Resources" | "SkillMapActionSkillBonus"

export interface Reward {
    rewardType: RewardType
    claim(): void
}

export class CardReward implements Reward {
    rewardType: RewardType = "Card";
    constructor(public cardToAdd: CardInfo, private claimFunction: ()=>void) {}
    claim() {
        this.claimFunction()
    }
}

export class ResourcesReward implements Reward {
    rewardType: RewardType = "Resources";
    constructor(public resources: Map<Resource, number>, private claimFunction: ()=>void) {}
    claim() {
        this.claimFunction()
    }
}

export class SkillMapActionSkillBonusReward implements Reward {
    rewardType: RewardType = "SkillMapActionSkillBonus";
    constructor(public skillBonus: SkillMapActionSkillBonus, private claimFunction: ()=>void) {}
    claim() {
        this.claimFunction()
    }
}
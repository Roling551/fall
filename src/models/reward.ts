import { DecisionFactoryOption } from "../services/decision-factory.service"
import { ExtractionBonusAndQualifier } from "./bonus"
import { CardInfo } from "./card-info"
import { Resource, resourcesToTextParts } from "./resource"
import { TextPart } from "./text-part"

export type RewardOption = {
    type: "Card",
    cardName: string
} | {
    type: "Resources",
    resources: Map<Resource, number>
} | {
    type: "ExtractionActionBonus",
    extractionBonus: ExtractionBonusAndQualifier
} | {
    type: "Decision",
    decisionFactoryOptions: DecisionFactoryOption[]
}

export type RewardType = "Card" | "Resources" | "ExtractionActionBonus" | "Decision"

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

export class ExtractionActionBonusReward implements Reward {
    rewardType: RewardType = "ExtractionActionBonus";
    constructor(public extractionBonus: ExtractionBonusAndQualifier, private claimFunction: ()=>void) {}
    getTextParts() {
        return ["skill bonus: " + this.extractionBonus.bonus.getTextParts()]
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
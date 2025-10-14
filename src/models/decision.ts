import { CardInfo } from "./card-info";
import { Resource } from "./resource";

export type DecisionOptionType = "Card" | "Resources"

export interface DecisionOption {
    decisionOptionType: DecisionOptionType
    choose(): void
}

export class CardDecisionOption implements DecisionOption {
    decisionOptionType: DecisionOptionType = "Card";
    constructor(public cardToAdd: CardInfo, private chooseMethod: ()=>void) {}
    choose() {
        this.chooseMethod()
    }
}

export class ResourcesDecisionOption implements DecisionOption {
    decisionOptionType: DecisionOptionType = "Resources";
    constructor(public resources: Map<Resource, number>, private chooseMethod: ()=>void) {}
    choose() {
        this.chooseMethod()
    }
}

export class Decision {
    constructor(public decisionOptions: DecisionOption[]) {}
}
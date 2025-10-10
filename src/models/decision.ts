import { CardInfo } from "./card-info";

export type DecisionOptionType = "Card"

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

export class Decision {
    constructor(public decisionOptions: DecisionOption[]) {}
}
import { Signal } from "@angular/core";
import { Resource } from "./resource";
import { TextPart } from "./text-part";

export type LevelGoalsInfo = {
    goalsRequired: number
}

export type LevelGoalCreationInfo = 
    { type: "resources", resources: Map<Resource, number>} |
    { type: "turnsPassed", turns: number}

export type LevelGoal = {
    isMet: Signal<boolean>,
    isChecked: Signal<boolean>,
    check: ()=>void,
    fulfill?: ()=>void,
    getStatus: Signal<TextPart[]>,
    getDescription: Signal<TextPart[]>,
}
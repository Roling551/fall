import { TextPart } from "./text-part";

export type Skill = "construction"

export const baseZeroSkills = new Map<Skill, number>([["construction", 0]])

export function getSkillSymbol(skill: Skill) {
    switch(skill) {
    case "construction":
        return "co";
    }
}

export function skillsToTextPart(skills: Map<Skill, number>): TextPart[] {
    if(skills.size == 0) {
        return ["-"]
    }
    return [...skills.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0]}," "])
}
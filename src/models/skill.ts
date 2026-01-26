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
    return [...skills.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0]}," "])
}
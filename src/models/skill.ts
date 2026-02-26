import { TextPart } from "./text-part";

export type Skill = "construction" | "engineering" | "mining"

export const baseZeroSkills = new Map<Skill, number>([["construction", 0]])

export function skillsToTextPart(skills: Map<Skill, number>): TextPart[] {
    if(skills.size == 0) {
        return ["-"]
    }
    return [...skills.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0], hoverInfo:[x[0]]}," "])
}
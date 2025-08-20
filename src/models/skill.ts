export type Skill = "construction" | "science" | "survival"

export const baseZeroSkills = new Map<Skill, number>([["construction", 0], ["science", 0], ["survival", 0]])

export function skillsToString(skills: Map<Skill, number>) {
    let result = ""    
    if(skills.get("construction") || skills.get("construction")==0) {
        result += "co" + skills.get("construction") + " "
    }
    if(skills.get("science") || skills.get("science")==0) {
        result += "sc" + skills.get("science") + " "
    }
    if(skills.get("survival") || skills.get("survival")==0) {
        result += "su" + skills.get("survival") + " "
    }
    return result
}
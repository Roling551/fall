export type Skill = "construction"

export const baseZeroSkills = new Map<Skill, number>([["construction", 0]])

export function getSkillSymbol(skill: Skill) {
    switch(skill) {
    case "construction":
        return "co";
    }
}

export function skillsToString(skills: Map<Skill, number>) {
    let result = ""    
    if(skills.get("construction") && skills.get("construction")!>0) {
        result += "co" + skills.get("construction") + " "
    }
    
    return result
}
import { Estate } from "./estate";
import { Skill } from "./skill";
import { Tile } from "./tile";

export interface EstateProductionBonus {
    type: "estate-production",
    name: string,
    qualifier: (estate: Estate)=>boolean,
    bonus: (estate: Estate)=>Map<string, number>
}

export interface SkillMapActionSkillBonus {
    name: string,
    qualifier: (tile: Tile)=>boolean,
    bonus: (tile: Tile)=>Map<Skill, number>
}
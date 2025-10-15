import { Estate } from "./estate";
import { Skill } from "./skill";
import { Tile } from "./tile/tile";

export interface EstateProductionBonus {
    type: "estate-production",
    name: string,
    qualifier: (estate: Estate)=>boolean,
    bonus: (estate: Estate)=>Map<string, number>
}

export interface SkillMapActionSkillBonus {
    name: string,
    qualifier: (tile: Tile)=>boolean,
    bonus: Map<Skill, number>
}

export interface MovementBonus {
    name: string,
    qualifier: (tile: Tile)=>boolean,
    bonus: number
}
import { Estate } from "./estate";
import { ExtractionBonus } from "./extraction";
import { Skill } from "./skill";
import { Tile } from "./tile/tile";

export interface EstateProductionBonusAndQualifier {
    type: "estate-production",
    name: string,
    qualifier: (estate: Estate)=>boolean,
    bonus: (estate: Estate)=>Map<string, number>
}

export interface ExtractionBonusAndQualifier {
    name: string,
    qualifier?: (tile: Tile)=>boolean,
    bonus: ExtractionBonus
}

export interface MovementBonusAndQualifier {
    name: string,
    qualifier: (tile: Tile)=>boolean,
    bonus: number
}
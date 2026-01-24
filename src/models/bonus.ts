import { Estate } from "./estate";
import { Extraction } from "./extraction";
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
    bonus: Extraction
}

export interface MovementBonusAndQualifier {
    name: string,
    qualifier: (tile: Tile)=>boolean,
    bonus: number
}
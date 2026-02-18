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

export interface MovementBonusAndQualifier {
    name: string,
    qualifier: (tile: Tile)=>boolean,
    bonus: number
}


export interface TileBonusAndQualifier {
    name: string,
    qualifier?: (tile: Tile)=>boolean,
    bonus: TileBonus
}

export interface TileBonus {
    extraction: Extraction
}

export function addTileBonuses(bonus1: TileBonus, bonus2: TileBonus) {
    return {
        extraction: Extraction.addFunctional(bonus1.extraction, bonus2.extraction)
    }
}

export function getZeroTileBonus() {
    return {
        extraction: new Extraction(0)
    }
}
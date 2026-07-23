import { addNumericalValues, addNumericalValuesFunctional } from "../util/map-functions";
import { Estate } from "./estate";
import { Extraction } from "./extraction";
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
    extraction?: Extraction,
}

export function tileBonusToTextParts(tileBonus: TileBonus) {
    return [
        ...(tileBonus.extraction ? (["extraction: ", ...tileBonus.extraction.getTextParts()]) : []),
    ]
}

export function addTileBonuses(bonus1: TileBonus, bonus2: TileBonus): TileBonus {
    return {
        extraction: Extraction.addFunctional(bonus1.extraction, bonus2.extraction),
    }
}
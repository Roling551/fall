import { addNumericalValues, addNumericalValuesFunctional } from "../util/map-functions";
import { Estate } from "./estate";
import { Extraction } from "./extraction";
import { Skill, skillsToTextPart } from "./skill";
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
    skillsBonus?: Map<Skill, number>,
}

export function tileBonusToTextParts(tileBonus: TileBonus) {
    return [
        ...(tileBonus.extraction ? (["extraction: ", ...tileBonus.extraction.getTextParts()]) : []),
        ...(tileBonus.skillsBonus ? (["skills: ", ...skillsToTextPart(tileBonus.skillsBonus)]) : []),
    ]
}

export function addTileBonuses(bonus1: TileBonus, bonus2: TileBonus): TileBonus {
    return {
        extraction: Extraction.addFunctional(bonus1.extraction, bonus2.extraction),
        skillsBonus: addNumericalValuesFunctional(bonus1.skillsBonus, bonus2.skillsBonus),
    }
}
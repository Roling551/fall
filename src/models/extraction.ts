import { addNumericalValuesFunctional } from "../util/map-functions"

export type ExtractionModyfications = "Sharpness" | "Precission"

export class Extraction {
    constructor(public strength: number, public modyfications: Map<ExtractionModyfications, number> = new Map()) {}
    
    static addFunctional(bonus1: Extraction, bonus2: Extraction) {
        return new Extraction(bonus1.strength + bonus2.strength, addNumericalValuesFunctional(bonus1.modyfications, bonus2.modyfications))
    }

    getText() {
        return this.strength.toString()
    }
}
import { addNumericalValuesFunctional } from "../util/map-functions"
import { TextPart } from "./text-part"

export type ExtractionModifications = "sharpness" | "precission" | "waste"

function getHoverInfo(modification: ExtractionModifications): TextPart[] {
    switch(modification) {
        case "sharpness":
            return ["Sharpness - cancels n points of hardness (", {type: "emoticon", emoticon: "hardness"}, ")"]
        case "precission":
            return ["Precission - cancels n points of fragility (", {type: "emoticon", emoticon: "fragility"}, ")"]
        case "waste":
            return ["Waste - resource yeld is n smaller"]
    }
}

export function extractionModificationsToTextPart(extractableModifications: Map<ExtractionModifications, number>): TextPart[] {
    return [...extractableModifications.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0],hoverInfo:getHoverInfo(x[0])}," "])
}

export class Extraction {
    constructor(public strength: number, public modifications: Map<ExtractionModifications, number> = new Map()) {}
    
    static addFunctional(bonus1?: Extraction, bonus2?: Extraction) {
        return new Extraction((bonus1?.strength||0) + (bonus2?.strength||0), addNumericalValuesFunctional(bonus1?.modifications, bonus2?.modifications))
    }

    getTextParts(): TextPart[] {
        return [this.strength.toString(), "+", ...extractionModificationsToTextPart(this.modifications)]
    }
}
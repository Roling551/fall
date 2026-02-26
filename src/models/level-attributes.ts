import { TextPart } from "./text-part"

export type LevelAttribute = "heat"

function levelAttributeHoverInfo(levelAttribute: LevelAttribute) {
    switch(levelAttribute) {
        case "heat":
            return ["Heat", " - ", "inrease water consumption"]
    }
}

export function toTextParts(attributes: Map<LevelAttribute, number>) {
    let textParts: TextPart[] = []
    for(const attribute of attributes) {
        textParts = textParts.concat([{type: "text", text:attribute[0], hoverInfo: levelAttributeHoverInfo(attribute[0])}, " ", attribute[1].toString()])
    }
    return textParts
}
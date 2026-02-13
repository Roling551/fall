import { TextPart } from "./text-part"

export type LevelAttribute = "heat"

export function toTextParts(attributes: Map<LevelAttribute, number>) {
    let textParts: TextPart[] = []
    for(const attribute of attributes) {
        textParts = textParts.concat([attribute[0], " ", attribute[1].toString()])
    }
    return textParts
}
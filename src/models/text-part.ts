import { ExtractableModifications } from "./environment-map-entity"
import { ExtractionModifications } from "./extraction"
import { Resource } from "./resource"
import { Skill } from "./skill"

export type TextPartType = "string" | "emoticon"

export type TextPart = 
string |
{
    type: "emoticon",
    emoticon: Emoticon,
    hoverInfo?: TextPart[],
} |
{
    type: "emoticon",
    emoticon: Emoticon,
    hoverInfo?: TextPart[],
}

export function getTextPartType(textPart: TextPart): TextPartType {
    if(typeof textPart === "string") {
        return "string"
    } else {
        return "emoticon"
    }
}


export type Emoticon = Resource | ExtractableModifications | ExtractionModifications | Skill

export function getEmoticonSource(part: TextPart) {
    if(typeof part != "object" || part["type"]!="emoticon") {
        return ``
    }
    return `assets/pictures/emoticons/${part.emoticon}.png`
}
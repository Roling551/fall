import { ExtractableModifications } from "./environment-map-entity"
import { ExtractionModifications } from "./extraction"
import { Resource } from "./resource"

export type TextPartType = "string" | "text" | "emoticon"

export type TextPart = 
string |
{
    type: "emoticon",
    emoticon: Emoticon,
    hoverInfo?: TextPart[],
} |
{
    type: "text",
    text: string,
    hoverInfo?: TextPart[],
}

export function getTextPartType(textPart: TextPart): TextPartType {
    if(typeof textPart === "string") {
        return "string"
    } else {
        return textPart.type
    }
}


export type Emoticon = Resource | ExtractableModifications | ExtractionModifications

export function getEmoticonSource(part: TextPart) {
    if(typeof part != "object" || part["type"]!="emoticon") {
        return ``
    }
    return `assets/pictures/emoticons/${part.emoticon}.png`
}

export function getTextPartsText(part: TextPart): string {
    if(typeof part == "string") {
        return part as string
    }
    if(typeof part != "object" || part["type"]!="text") {
        return ""
    }
    return part.text
}